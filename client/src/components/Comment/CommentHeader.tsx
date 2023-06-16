import { Comment } from "../../graphql/types/graphql"

interface IProps {
  collapseThread: boolean,
  comment: Comment
}

const CommentHeader = ({ collapseThread, comment }: IProps) => {
  const { username, displayname } = comment.user
  
  return (
    <div className="commentHeaderContainer">
      <div className={`profilePicSub ${collapseThread && 
          'collapsedThread'}`}></div>
      <div className={`commentHeader ${collapseThread && 
          'collapsedThread'}`}>
        <p className="commentDisplayName">{displayname}</p>
        <p className="commentUsername">#{username}</p>
      </div>
    </div>
  )
}

export default CommentHeader