import { useState } from "react"
import MessageList from "../components/Message/MessageList"
import Conversation from "../components/Message/Conversation"

const Messages = () => {
  const [messageList, setMessageList] = useState(true)
  const [partnerId, setPartnerId] = useState('')

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
        : <Conversation partnerId ={partnerId} closeMessage={closeMessage}/>}
    </>
  )
}

export default Messages