import { useLazyQuery, useQuery } from "@apollo/client"
import { GET_CHILD_COMMENTS, GET_COMMENTS, GET_COMMENT_PARENT_ID } from "../../graphql/comments/queries"
import { isCommentArray } from "../../graphql/comments/types"
import { useNavigate } from "react-router-dom"
import PostCommentForm from "./PostCommentForm"
import PostComment from "./PostComment"
import { useEffect, useRef, useState } from "react"
import { useContext } from "react"
import CommentContext from "../../CommentContext"

interface IProps {
  postId: string,
  commentId?: string
}

const PostCommentList = ({ postId, commentId }: IProps) => {
  const navigate = useNavigate()
  const [getChildren, childrenQuery] = useLazyQuery(GET_CHILD_COMMENTS)
  const [getParentId, parentIdQuery] = useLazyQuery(GET_COMMENT_PARENT_ID)
  const getComments = useQuery(GET_COMMENTS, {variables: {postId}})
  const commentContext = useContext(CommentContext)
  const [sortType, setSortType] = useState('New')
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  const sortDropdownRef = useRef<any>()

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [sortDropdownRef])
  
  useEffect(() => {
    if(commentId) {
      getChildren({variables: {
        postId,
        parentCommentId: commentId
      }})

      getParentId({variables: {
        commentId
      }})
    } 
  }, [commentId])

  const returnToParent = () => {
    if(commentContext?.setPreviousCommentId && commentId) {
      commentContext.setPreviousCommentId(commentId)
    }
    if(parentIdQuery.data?.getCommentParentId) {
      console.log(parentIdQuery.data?.getCommentParentId)
      navigate(`/posts/${postId}/comments/${parentIdQuery.data?.getCommentParentId}`)
    } 
    else {
      navigate(`/posts/${postId}/`)
    }
  }

  const comments = isCommentArray(childrenQuery.data?.getChildComments) && commentId
    ? childrenQuery.data?.getChildComments
    : getComments.data?.getComments
  
  if (!isCommentArray(comments)) return null

  const sortedComments = [...comments].sort((a, b) => {
    if (sortType === 'New') {
      return Number(b.createdOn) - Number(a.createdOn)
    } else if (sortType === 'Old') {
      return Number(a.createdOn) - Number(b.createdOn)
    } else {
      return Number(b.likesCount) - Number(a.likesCount)
    }
  })

  return (
    <div>
      <div ref={sortDropdownRef} className="commentSortContainer">
        <button 
          onClick={() => setShowSortDropdown(!showSortDropdown)} 
          className="commentSortButton">
            Sort By: {sortType}
        </button>
        {showSortDropdown &&
          <div className="commentSortDropdown">
            <button 
              onClick={() => setSortType('Top')} 
              className="commentSortButton">
                Top
            </button>
            <button 
              onClick={() => setSortType('New')} 
              className="commentSortButton">
                New
            </button>
            <button 
              onClick={() => setSortType('Old')} 
              className="commentSortButton">
                Old
            </button>
          </div>
        }
      </div>
      {commentId && 
        <button className="parentCommentsButton" onClick={() => returnToParent()}>
          Show parent comments
        </button>}
      <div className="postCommentList">
        {sortedComments.map((comment) => {
          return (
            <div key={comment.commentId}>
              <PostComment 
                comment={comment} 
                initialLevel={true}
                commentLevel={1}
                commentPageId={commentId}
              />
            </div>
          )
        })}
      </div>
      
    </div>
  )
}

export default PostCommentList