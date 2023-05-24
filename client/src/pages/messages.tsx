import { useState } from "react"
import MessageList from "../components/Message/MessageList"
import Conversation from "../components/Message/Conversation"
import { useQuery } from "@apollo/client"
import { CURRENT_USER } from "../graphql/users/queries"
import { isUser } from "../graphql/users/types"

const Messages = () => {
  const [messageList, setMessageList] = useState(true)
  const [partnerId, setPartnerId] = useState('')
  let receiverId = ''

  const {loading, error, data} = useQuery(CURRENT_USER)
  if(loading) console.log('query loading...')
  if(error) console.log(error)
  if(data && isUser(data.currentUser)) receiverId = data.currentUser.userId

  const openMessage = (partnerId: string) => {
    setMessageList(false)
    setPartnerId(partnerId)
  }

  const closeMessage = () => {
    setMessageList(true)
  }

  return (
    <>
      <h1>Messages</h1>
      {messageList 
        ? <MessageList openMessage={openMessage} />
        : <Conversation 
            partnerId ={partnerId} 
            receiverId={receiverId} 
            closeMessage={closeMessage}
          />}
    </>
  )
}

export default Messages