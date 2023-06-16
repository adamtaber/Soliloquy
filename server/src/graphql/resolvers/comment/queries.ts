import { pool } from "../../../db/config"
import { QueryResolvers } from "../graphql-types"
import humps from 'humps'
import { isCommentArray } from "./types"
import { GraphQLError } from "graphql"

const commentQueries: QueryResolvers = {
  getComments: async (_root, args) => {
    const { postId } = args

    const likesCount = 
      `SELECT COUNT(*)
       FROM likes l
       WHERE l.comment_id = c.comment_id`
    
    const likedByCurrentUser = 
      `SELECT user_id
       FROM likes l
       WHERE (l.comment_id = c.comment_id) AND (l.user_id = $1)`

    const query = 
      `SELECT *, c.created_on AS comment_created_on, 
        u.created_on AS user_created_on, (${likesCount}) AS likes_count, 
        (${likedByCurrentUser}) AS current_user_like
       FROM comments c
       JOIN users u
         ON u.user_id = c.user_id
       WHERE post_id = $1 AND parent_comment_id IS NULL`
    const values = [postId]

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
        likedByCurrentUser: comment.likedByCurrentUser,
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
  },
  getChildComments: async (_root, args) => {
    const { postId, parentCommentId } = args

    const likesCount = 
      `SELECT COUNT(*)
       FROM likes l
       WHERE l.comment_id = c.comment_id`
    
    const likedByCurrentUser = 
      `SELECT user_id
       FROM likes l
       WHERE (l.comment_id = c.comment_id) AND (l.user_id = $1)`

    const query = 
      `SELECT *, c.created_on AS comment_created_on, 
        u.created_on AS user_created_on, (${likesCount}) AS likes_count,
        (${likedByCurrentUser}) AS current_user_like
       FROM comments c
       JOIN users u
        ON u.user_id = c.user_id
       WHERE post_id = $1 AND parent_comment_id = $2`
    const values = [postId, parentCommentId]

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