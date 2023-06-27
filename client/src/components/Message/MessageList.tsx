import { useQuery } from "@apollo/client"
import { GET_MESSAGE_PARTNERS } from "../../graphql/messages/queries"
import { isBasicUserArray, isMessage } from "../../graphql/messages/types"
import { Navigate } from "react-router-dom"
import { useEffect } from "react"
import { MESSAGE_DELETED, MESSAGE_SENT } from "../../graphql/messages/subscriptions"

//now that user data is combined with message data there is no reason to have
//this convoluted data type, definitely refactor

const MessageList = 
  (props: {receiverId: string, openMessage: (partnerId: string) => void}) => {
  
  const {subscribeToMore, loading, error, data, refetch} = 
    useQuery(GET_MESSAGE_PARTNERS)
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

  const subscribeToDeletedMessages = () => {
    subscribeToMore({
      document: MESSAGE_DELETED,
      variables: { receiverId },
      updateQuery: (prev) => {
        refetch()
        if(!data || !data.getMessagePartners) return prev
        return Object.assign({}, prev, {
          getMessagePartners: data.getMessagePartners
        })
      }
    })
  }

  useEffect(() => {
    subscribeToNewMessages()
    subscribeToDeletedMessages()
  })

  if(loading) return null
  if(error) console.log(error)

  if(!data || !isBasicUserArray(data.getMessagePartners)) {
    return <Navigate to='/' />
  }

  return (
    <div>
      <div className="messagesHeader">
          <h1 className="messagesHeader__title">Messages</h1>
      </div>
      <div className="messageList">
        {data.getMessagePartners.map((user) => {
          return (
            <div 
              onClick={() => openMessage(user.userId)} 
              key={user.userId}
              className="messagePartner">
                <p className="messagePartner__name">{user.displayname}</p>
                <p className="messagePartner__message">{user.recentMessage}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MessageList