import { useQuery } from "@apollo/client"
import { GET_MESSAGES } from "../../graphql/messages/queries"
import { isMessageArray } from "../../graphql/messages/types"
import { Navigate } from "react-router-dom"
import MessageForm from "./MessageForm"
import { MESSAGE_SENT } from "../../graphql/messages/subscriptions"
import { useEffect } from "react"

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
        return Object.assign({}, prev, {
          getMessages: [newFeedItem, ...prev.getMessages]
        })
      }
    })
  }

  useEffect(() => {
    subscribeToNewMessages()
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
          </div>
        )
      })}
    </>
  )
}

export default Conversation