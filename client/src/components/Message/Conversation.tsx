import { useQuery } from "@apollo/client"
import { GET_MESSAGES } from "../../graphql/messages/queries"
import { isMessage, isMessageArray } from "../../graphql/messages/types"
import { Navigate } from "react-router-dom"
import MessageForm from "./MessageForm"
import { MESSAGE_DELETED, MESSAGE_SENT } from "../../graphql/messages/subscriptions"
import { useEffect } from "react"
import DeleteMessage from "./DeleteMessage"

//update getMessagePartners as well for subscription so that it updates while
//user is looking at list of message partners

const Conversation = (props: {partnerId: string, receiverId: string, closeMessage: () => void}) => {
  const {partnerId, receiverId, closeMessage} = props

  const {subscribeToMore, ...result} = useQuery(GET_MESSAGES, {
    variables: {messagePartnerId: partnerId}
  })

  const subscribeToNewMessages = () => {
    subscribeToMore({
      document: MESSAGE_SENT,
      variables: { receiverId },
      updateQuery: (prev, { subscriptionData }) => {
        if(!subscriptionData.data) return prev
        const newFeedItem = subscriptionData.data.messageSent
        console.log(prev.getMessages)
        return Object.assign({}, prev, {
          getMessages: [newFeedItem, ...prev.getMessages]
        })
      }
    })
  }

  const subscribeToDeletedMessages = () => {
    subscribeToMore({
      document: MESSAGE_DELETED,
      variables: { receiverId },
      updateQuery: (prev, {subscriptionData }) => {
        if(!subscriptionData.data) return prev
        const deletedItem = subscriptionData.data.messageDeleted
        if(!isMessage(deletedItem)) return prev
        if(!isMessageArray(prev.getMessages)) return prev
        return Object.assign({}, prev, {
          getMessages: prev.getMessages.filter((item) => item.messageId !== deletedItem.messageId)
        })
      }
    })
  }

  useEffect(() => {
    subscribeToNewMessages()
    subscribeToDeletedMessages()
  }, [])

  if(result.loading) return null
  if(result.error) console.log(result.error)
  if(!result.data || !isMessageArray(result.data.getMessages)) {
    return <Navigate to='/' />
  }

  return (
    <>
      <MessageForm receiverId={partnerId}/>
      <button onClick={() => closeMessage()}>Back</button>
      {result.data.getMessages.map((message) => {
        return (
          <div key={message.messageId}>
            <p>{message.senderName}: {message.content}</p>
            {message.senderId === receiverId && <DeleteMessage messagePartnerId={partnerId} messageId={message.messageId}/>}
          </div>
        )
      })}
    </>
  )
}

export default Conversation