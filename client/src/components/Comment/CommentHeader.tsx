import { useNavigate } from "react-router-dom"
import { Comment } from "../../graphql/types/graphql"

interface IProps {
  collapseThread: boolean,
  comment: Comment
}

const CommentHeader = ({ collapseThread, comment }: IProps) => {
  const navigate = useNavigate()
  const { username, displayname, userId } = comment.user
  
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
      </div>
    </div>
  )
}

export default CommentHeader