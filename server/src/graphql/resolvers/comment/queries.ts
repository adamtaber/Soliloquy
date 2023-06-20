import { pool } from "../../../db/config"
import { QueryResolvers } from "../graphql-types"
import humps from 'humps'
import { isCommentArray } from "./types"
import { GraphQLError } from "graphql"
import * as _ from 'lodash'

const commentQueries: QueryResolvers = {
  getComments: async (_root, args, {authorizedId}) => {
    const { postId } = args

    const likesCount = 
      `SELECT COUNT(*)
       FROM likes l
       WHERE l.comment_id = c.comment_id`
    
    const likedByCurrentUser = 
      `SELECT user_id
       FROM likes l
       WHERE (l.comment_id = c.comment_id) AND (l.user_id = $2)`

    const recursiveQuery = 
      `SELECT 
          *,
          c.created_on AS comment_created_on,
          u.created_on AS user_created_on,
          (${likesCount}) AS likes_count, 
          (${likedByCurrentUser}) AS current_user_like
        FROM comments c
        JOIN users u
          ON u.user_id = c.user_id
        WHERE post_id = $1`
     const values = [postId, authorizedId]

    const testQuery = await pool.query(recursiveQuery, values)
    const testComments = humps.camelizeKeys(testQuery.rows)

    let result = []

    if(Array.isArray(testComments)) {
      const map = new Map()

      for (let i = 0; i < testComments.length; i++) {
        map.set(testComments[i].commentId, i)
        testComments[i].comments = []
      }

      for (let i = 0; i < testComments.length; i++) {
        testComments[i] = {
          commentId: testComments[i].commentId,
          postId: testComments[i].postId,
          parentCommentId: testComments[i].parentCommentId,
          content: testComments[i].content,
          createdOn: testComments[i].commentCreatedOn,
          likesCount: testComments[i].likesCount,
          currentUserLike: testComments[i].currentUserLike,
          comments: testComments[i].comments,
          user: {
            userId: testComments[i].userId,
            username: testComments[i].username,
            displayname: testComments[i].displayname,
            email: testComments[i].email,
            password: testComments[i].password,
            createdOn: testComments[i].userCreatedOn
          }
        }

        if (testComments[i].parentCommentId) {
          const parentIndex = map.get(testComments[i].parentCommentId)
          testComments[parentIndex].comments =
            testComments[parentIndex].comments.length
            ? [...testComments[parentIndex].comments, testComments[i]]
            : [testComments[i]]
        } else {
          result.push(testComments[i])
        }
      }
    }

    if(!Array.isArray(result)) {
      throw new GraphQLError('Query response is not of type Array', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    if(!isCommentArray(result)) {
      throw new GraphQLError('Query response is not of type CommentArray', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }
    return result
  },
  getChildComments: async (_root, args, {authorizedId}) => {
    const { postId, parentCommentId } = args
    console.log(postId, authorizedId)


    const likesCount = 
      `SELECT COUNT(*)
       FROM likes l
       WHERE l.comment_id = c.comment_id`
    
    const likedByCurrentUser = 
      `SELECT user_id
       FROM likes l
       WHERE (l.comment_id = c.comment_id) AND (l.user_id = $2)`

    // const query = 
    //   `SELECT *, c.created_on AS comment_created_on, 
    //     u.created_on AS user_created_on, (${likesCount}) AS likes_count,
    //     (${likedByCurrentUser}) AS current_user_like
    //    FROM comments c
    //    JOIN users u
    //     ON u.user_id = c.user_id
    //    WHERE post_id = $1 AND parent_comment_id = $2`
    // const values = [postId, parentCommentId, authorizedId]

    const query = 
      `WITH RECURSIVE comment_tree AS (
        SELECT 
          c.content,
          c.comment_id,
          c.parent_comment_id,
          c.post_id,
          u.displayname,
          u.username,
          u.email,
          u.password,
          u.user_id,
          c.created_on AS comment_created_on,
          u.created_on AS user_created_on,
          (${likesCount}) AS likes_count,
          (${likedByCurrentUser}) AS current_user_like
        FROM comments c
        JOIN users u
          ON u.user_id = c.user_id
        WHERE c.parent_comment_id = $1

        UNION ALL

        SELECT 
          c.content,
          c.comment_id,
          c.parent_comment_id,
          c.post_id,
          u.displayname,
          u.username,
          u.email,
          u.password,
          u.user_id,
          c.created_on AS comment_created_on,
          u.created_on AS user_created_on,
          (${likesCount}) AS likes_count,
          (${likedByCurrentUser}) AS current_user_like
        FROM comment_tree t
        INNER JOIN comments c
          ON c.parent_comment_id = t.comment_id
        JOIN users u
          ON u.user_id = c.user_id
      )
      SELECT *
      FROM comment_tree t`
    const values = [parentCommentId, authorizedId]

    const commentQuery = await pool.query(query, values)
    const comments = humps.camelizeKeys(commentQuery.rows)

    if(!Array.isArray(comments)) {
      throw new GraphQLError('Query response is not of type Array', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    const result = []

    const map = new Map()

    for (let i = 0; i < comments.length; i++) {
      map.set(comments[i].commentId, i)
      comments[i].comments = []
    }

    for (let i = 0; i < comments.length; i++) {
      comments[i] = {
        commentId: comments[i].commentId,
        postId: comments[i].postId,
        parentCommentId: comments[i].parentCommentId,
        content: comments[i].content,
        createdOn: comments[i].commentCreatedOn,
        likesCount: comments[i].likesCount,
        currentUserLike: comments[i].currentUserLike,
        comments: comments[i].comments,
        user: {
          userId: comments[i].userId,
          username: comments[i].username,
          displayname: comments[i].displayname,
          email: comments[i].email,
          password: comments[i].password,
          createdOn: comments[i].userCreatedOn
        }
      }

      if (comments[i].parentCommentId !== parentCommentId) {
        const parentIndex = map.get(comments[i].parentCommentId)
        comments[parentIndex].comments =
          comments[parentIndex].comments.length
          ? [...comments[parentIndex].comments, comments[i]]
          : [comments[i]]
      } else {
        result.push(comments[i])
      }
    }

    console.log(result)
    if(!isCommentArray(result)) {
      throw new GraphQLError('Query response is not of type CommentArray', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }
    
    return result
  }
}

export default commentQueries