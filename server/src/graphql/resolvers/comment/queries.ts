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

    // const query = 
    //   `SELECT *, c.created_on AS comment_created_on, 
    //     u.created_on AS user_created_on, (${likesCount}) AS likes_count, 
    //     (${likedByCurrentUser}) AS current_user_like
    //    FROM comments c
    //    JOIN users u
    //      ON u.user_id = c.user_id
    //    WHERE post_id = $1 AND parent_comment_id IS NULL`
    // const values = [postId, authorizedId]

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

    // const commentQuery = await pool.query(query, values)
    // const comments = humps.camelizeKeys(commentQuery.rows)

    const testQuery = await pool.query(recursiveQuery, values)
    const testComments = humps.camelizeKeys(testQuery.rows)

    let result = []

    if(Array.isArray(testComments)) {
      const map = new Map()

      for (let i = 0; i < testComments.length; i++) {
        map.set(testComments[i].commentId, i)
        testComments[i].comments = []
      }

      console.log(testComments)

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

  
    // if(!Array.isArray(comments)) {
    //   throw new GraphQLError('Query response is not of type Array', {
    //     extensions: {
    //       code: 'INVALID_TYPE'
    //     }
    //   })
    // }

    if(!Array.isArray(result)) {
      throw new GraphQLError('Query response is not of type Array', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    // const formattedComments = comments.map((comment) => {
    //   return {
    //     commentId: comment.commentId,
    //     postId: comment.postId,
    //     parentCommentId: comment.parent_comment_id,
    //     content: comment.content,
    //     createdOn: comment.commentCreatedOn,
    //     likesCount: comment.likesCount,
    //     currentUserLike: comment.currentUserLike,
    //     user: {
    //       userId: comment.userId,
    //       username: comment.username,
    //       displayname: comment.displayname,
    //       email: comment.email,
    //       password: comment.password,
    //       createdOn: comment.userCreatedOn
    //     }
    //   }
    // })

    // if(!isCommentArray(formattedComments)) {
    //   throw new GraphQLError('Query response is not of type CommentArray', {
    //     extensions: {
    //       code: 'INVALID_TYPE'
    //     }
    //   })
    // }

    if(!isCommentArray(result)) {
      throw new GraphQLError('Query response is not of type CommentArray', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }
    return result
    // return formattedComments
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
       WHERE (l.comment_id = c.comment_id) AND (l.user_id = $3)`

    const query = 
      `SELECT *, c.created_on AS comment_created_on, 
        u.created_on AS user_created_on, (${likesCount}) AS likes_count,
        (${likedByCurrentUser}) AS current_user_like
       FROM comments c
       JOIN users u
        ON u.user_id = c.user_id
       WHERE post_id = $1 AND parent_comment_id = $2`
    const values = [postId, parentCommentId, authorizedId]

    const commentQuery = await pool.query(query, values)
    const comments = humps.camelizeKeys(commentQuery.rows)

    if(!Array.isArray(comments)) {
      throw new GraphQLError('Query response is not of type Array', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    const formattedComments = comments.map((comment) => {
      return {
        commentId: comment.commentId,
        postId: comment.postId,
        parentCommentId: comment.parent_comment_id,
        content: comment.content,
        createdOn: comment.commentCreatedOn,
        likesCount: comment.likesCount,
        currentUserLike: comment.currentUserLike,
        user: {
          userId: comment.userId,
          username: comment.username,
          displayname: comment.displayname,
          email: comment.email,
          password: comment.password,
          createdOn: comment.userCreatedOn
        }
      }
    })


    if(!isCommentArray(formattedComments)) {
      throw new GraphQLError('Query response is not of type CommentArray', {
        extensions: {
          code: 'INVALID_TYPE'
        }
      })
    }

    return formattedComments
  }
}

export default commentQueries