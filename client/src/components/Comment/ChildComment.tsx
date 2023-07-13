// import { Navigate } from "react-router-dom";
// import { Comment } from "../../graphql/types/graphql";
// import { isUser } from "../../graphql/users/types";
// import { useQuery } from "@apollo/client";
// import { CURRENT_USER } from "../../graphql/users/queries";
// import ChildCommentList from "./ChildCommentList";
// import { useState } from "react";
// import CommentLevelIndicator from "./CommentLevelIndicator";
// import ExpandThreadButton from "./ExpandThreadButton";
// import CommentHeader from "./CommentHeader";
// import CommentButtons from "./CommentButtons";
// import CommentReplyContainer from "./CommentReplyContainer";

// const ChildComment = (props: {comment: Comment}) => {
//   const { comment } = props
//   const [showReplyForm, setShowReplyForm] = useState(false)
//   const [showOptionsModal, setShowOptionsModal] = useState(false)
//   const [collapseThread, setCollapseThread] = useState(false)

//   const {loading, error, data} = useQuery(CURRENT_USER)

//   // if(loading) return null
//   if(error) console.log(error)

//   if(!data || !isUser(data.currentUser)) return <Navigate to='/' />

//   const currentUser = data.currentUser

//   return (
//     <div className={`childComment ${collapseThread && 'collapsedThread'}`}>
//       <CommentLevelIndicator 
//         setCollapseThread={setCollapseThread} 
//         collapseThread={collapseThread}
//       />
//       <ExpandThreadButton 
//         setCollapseThread={setCollapseThread}
//         collapseThread={collapseThread}
//       />
//       <CommentHeader 
//         collapseThread={collapseThread} 
//         comment={comment}
//       />
//       <div className={`commentBody ${collapseThread && 'collapsedThread'}`}>
//         <p>{comment.content}</p>
//         <CommentButtons 
//           setShowReplyForm={setShowReplyForm}
//           setShowOptionsModal={setShowOptionsModal}
//           showReplyForm={showReplyForm}
//           showOptionsModal={showOptionsModal}
//           comment={comment} currentUser={currentUser} 
//         />
//         <CommentReplyContainer 
//           setShowReplyForm={setShowReplyForm}
//           showReplyForm={showReplyForm} comment={comment}
//         />
//         <ChildCommentList 
//           commentId={comment.commentId} 
//           postId={comment.postId}
//         />
//       </div>
//     </div>
//   )
// }

// export default ChildComment