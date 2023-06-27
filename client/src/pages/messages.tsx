import { useState } from "react"
import MessageList from "../components/Message/MessageList"
import Conversation from "../components/Message/Conversation"
import { useQuery } from "@apollo/client"
import { CURRENT_USER } from "../graphql/users/queries"
import { isUser } from "../graphql/users/types"
import { useNavigate, useParams } from "react-router-dom"

const Messages = () => {
  const navigate = useNavigate()
  const { userId } = useParams()
  const [messageList, setMessageList] = useState(true)
  const [partnerId, setPartnerId] = useState('')
  let receiverId = ''

  const {loading, error, data} = useQuery(CURRENT_USER)
  if(data && isUser(data.currentUser)) receiverId = data.currentUser.userId

  const openMessage = (partnerId: string) => {
    // setMessageList(false)
    // setPartnerId(partnerId)
    navigate(`/messages/${partnerId}`)
  }

  // const closeMessage = () => {
  //   setMessageList(true)
  // }

  return (
    <div className="messages">
      {userId && 
       <Conversation 
         partnerId={userId}
         receiverId={receiverId}
        />}
      {!userId && 
       <MessageList 
         receiverId={receiverId} 
         openMessage={openMessage}
       />}
      {/* {messageList 
        ? <MessageList receiverId={receiverId} openMessage={openMessage} />
        : <Conversation 
            partnerId ={partnerId} 
            receiverId={receiverId} 
            closeMessage={closeMessage}
          />} */}
    </div>
  )
}

export default Messages