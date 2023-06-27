import { pool } from "../../../db/config"
import { QueryResolvers } from "../graphql-types"
import humps from 'humps'
import { isCommentArray } from "./types"
import { GraphQLError } from "graphql"
import * as _ from 'lodash'

const commentQueries: QueryResolvers = {
  getCommentParentId: async (_root, args) => {
    const {commentId} = args

    // const query = 
    //   `SELECT parent_comment_id
    //    FROM comments
    //    WHERE comment_id = $1`

    const query =
      `SELECT c9.comment_id, c9.parent_comment_id
       FROM comments c1
       LEFT JOIN comments c2 ON c1.parent_comment_id = c2.comment_id
       LEFT JOIN comments c3 ON c2.parent_comment_id = c3.comment_id
       LEFT JOIN comments c4 ON c3.parent_comment_id = c4.comment_id
       LEFT JOIN comments c5 ON c4.parent_comment_id = c5.comment_id
       LEFT JOIN comments c6 ON c5.parent_comment_id = c6.comment_id
       LEFT JOIN comments c7 ON c6.parent_comment_id = c7.comment_id
       LEFT JOIN comments c8 ON c7.parent_comment_id = c8.comment_id
       LEFT JOIN comments c9 ON c8.parent_comment_id = c9.comment_id
       LEFT JOIN comments c10 ON c9.parent_comment_id = c10.comment_id
       LEFT JOIN comments c11 ON c10.parent_comment_id = c11.comment_id
       WHERE c1.comment_id = $1`
       
    const values = [commentId]

    const parentIdQuery = await pool.query(query, values)
    const parentId = humps.camelizeKeys(parentIdQuery.rows[0])

    if(!(typeof(parentId.commentId) === 'string')) {
      throw new GraphQLError('Query response is not of type String', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return parentId.parentCommentId ? parentId.commentId : ''
  },
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

    const likesCount = 
      `SELECT COUNT(*)
       FROM likes l
       WHERE l.comment_id = c.comment_id`
    
    const likedByCurrentUser = 
      `SELECT user_id
       FROM likes l
       WHERE (l.comment_id = c.comment_id) AND (l.user_id = $2)`
    
    const root = 
       `SELECT c.content,
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
         WHERE comment_id = $1`
     const rootValues = [parentCommentId, authorizedId]

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
        WHERE c.parent_comment_id = $1 AND c.post_id = $3

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
    const values = [parentCommentId, authorizedId, postId]

    const rootQuery = await pool.query(root, rootValues)
    const rootComment = humps.camelizeKeys(rootQuery.rows[0])

    const commentQuery = await pool.query(query, values)
    const comments = humps.camelizeKeys(commentQuery.rows)

    if(!Array.isArray(comments)) {
      throw new GraphQLError('Query response is not of type Array', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    comments.push(rootComment)

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

      if (comments[i].commentId !== parentCommentId) {
        const parentIndex = map.get(comments[i].parentCommentId)
        comments[parentIndex].comments =
          comments[parentIndex].comments.length
          ? [...comments[parentIndex].comments, comments[i]]
          : [comments[i]]
      } else {
        result.push(comments[i])
      }

      // if (comments[i].parentCommentId !== parentCommentId) {
      //   const parentIndex = map.get(comments[i].parentCommentId)
      //   comments[parentIndex].comments =
      //     comments[parentIndex].comments.length
      //     ? [...comments[parentIndex].comments, comments[i]]
      //     : [comments[i]]
      // } else {
      //   result.push(comments[i])
      // }
    }

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