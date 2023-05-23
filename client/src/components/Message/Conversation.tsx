import { useQuery } from "@apollo/client"
import { GET_MESSAGES } from "../../graphql/messages/queries"
import { isMessageArray } from "../../graphql/messages/types"
import { Navigate } from "react-router-dom"
import MessageForm from "./MessageForm"

const Conversation = (props: {partnerId: string, closeMessage: () => void}) => {
  const {partnerId, closeMessage} = props

  const {loading, error, data} = useQuery(GET_MESSAGES, {
    variables: {messagePartnerId: partnerId}
  })

  if(loading) return null
  if(error) console.log(error)

  if(!data || !isMessageArray(data.getMessages)) {
    return <Navigate to='/' />
  }

  return (
    <>
      <MessageForm receiverId={partnerId}/>
      <button onClick={() => closeMessage()}>Back</button>
      {data.getMessages.map((message) => {
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