import { useQuery } from "@apollo/client"
import { GET_MESSAGE_PARTNERS } from "../../graphql/messages/queries"
import { isBasicUserArray, isMessage } from "../../graphql/messages/types"
import { Navigate } from "react-router-dom"
import { useEffect } from "react"
import { MESSAGE_SENT } from "../../graphql/messages/subscriptions"

const MessageList = (props: {receiverId: string, openMessage: (partnerId: string) => void}) => {
  const {subscribeToMore, loading, error, data} = useQuery(GET_MESSAGE_PARTNERS)
  const {receiverId, openMessage} = props

  const subscribeToNewMessages = () => {
    subscribeToMore({
      document: MESSAGE_SENT,
      variables: { receiverId },
      updateQuery: (prev, { subscriptionData }) => {
        if(!subscriptionData.data) return prev
        const newMessage = subscriptionData.data.messageSent
        if(!isMessage(newMessage)) return prev
        if(!isBasicUserArray(prev.getMessagePartners)) return prev

        const newItem = {
          userId: newMessage.sender.userId,
          displayname: newMessage.sender.displayname,
          username: newMessage.sender.username,
          recentMessage: newMessage.content
        }

        const messagePartners = prev.getMessagePartners.filter((item) => {
          return item.userId !== newItem.userId
        })

        return Object.assign({}, prev, {
          getMessagePartners: [newItem, ...messagePartners]
        })
      }
    })
  }

  useEffect(() => {
    subscribeToNewMessages()
  })

  if(loading) return null
  if(error) console.log(error)

  if(!data || !isBasicUserArray(data.getMessagePartners)) {
    return <Navigate to='/' />
  }

  return (
    <>
      {data.getMessagePartners.map((user) => {
        return (
          <div onClick={() => openMessage(user.userId)} key={user.userId}>
            <p>{user.displayname}</p>
            <p>{user.recentMessage}</p>
            <p>------------</p>
          </div>
        )
      })}
    </>
  )
}

export default MessageList