import { useNavigate } from "react-router-dom"
import { Comment } from "../../graphql/types/graphql"

interface IProps {
  collapseThread: boolean,
  comment: Comment
}

const CommentHeader = ({ collapseThread, comment }: IProps) => {
  const navigate = useNavigate()
  const { username, displayname, userId } = comment.user

  const createDate = () => {
    const date = new Date(Number(comment.createdOn))
    const timeDifference = Math.floor((Number(new Date()) - Number(date)) / 1000)
    if (timeDifference >= 31536000) {
      return Math.floor(timeDifference / 31536000) + ' yr. ago'
    } else if (timeDifference >= 2592000) {
      return Math.floor(timeDifference / 2592000) + ' mo. ago'
    } else if (timeDifference >= 86400) {
      return Math.floor(timeDifference / 86400) + ' days ago'
    } else if (timeDifference >= 3600) {
      return Math.floor(timeDifference / 3600) + ' hr. ago'
    } else if (timeDifference >= 60) {
      return Math.floor(timeDifference / 60) + ' min. ago'
    } else {
      // return Math.floor(timeDifference) + ' seconds ago'
      return '1 min. ago'
    }
  }
  
  return (
    <div className="commentHeaderContainer">
      <div className={`profilePicSub ${collapseThread && 
          'collapsedThread'}`}></div>
      <div className={`commentHeader ${collapseThread && 
          'collapsedThread'}`}>
        <p onClick={() => navigate(`/users/${userId}`)} 
           className="commentDisplayName">
            {displayname}
        </p>
        <p className="commentUsername">#{username}</p>
        <span className="dotSeparator">·</span>
        <p className="commentDate">{createDate()}</p>
      </div>
    </div>
  )
}

export default CommentHeader