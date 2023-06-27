import { useQuery } from "@apollo/client"
import { GET_MESSAGES } from "../../graphql/messages/queries"
import { isMessage, isMessageArray } from "../../graphql/messages/types"
import { Navigate, useNavigate } from "react-router-dom"
import MessageForm from "./MessageForm"
import { MESSAGE_DELETED, MESSAGE_SENT } from "../../graphql/messages/subscriptions"
import { useEffect } from "react"
import DeleteMessage from "./DeleteMessage"
import { IconContext } from "react-icons"
import { MdOutlineArrowBackIosNew } from "react-icons/md"
import { FIND_USER } from "../../graphql/users/queries"
import { isUser } from "../../graphql/users/types"

//update getMessagePartners as well for subscription so that it updates while
//user is looking at list of message partners

interface IProps {
  partnerId: string,
  receiverId: string
}

const Conversation = ({partnerId, receiverId}: IProps) => {
  const navigate = useNavigate()
  const userQuery = useQuery(FIND_USER, {
    variables: {userId: partnerId}
  })
  let user

  if(userQuery.data?.findUser && isUser(userQuery.data?.findUser)) {
    user = userQuery.data?.findUser
  } 

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
  if(!result.data || !isMessageArray(result.data.getMessages) || !user) {
    return <Navigate to='/' />
  }

  return (
    <div className="conversation">
      <div className="messagesHeader messageConversation">
        <button className={'backButton'} 
          onClick={() => navigate(`/messages`)}>
            <IconContext.Provider value={{style: {display: 'block'}}}>
              <MdOutlineArrowBackIosNew />
            </IconContext.Provider>        
        </button> 
        <h1 className="messagesHeader__title">{user.displayname}</h1>
      </div>
      <div className="conversation_body">
        <div className="conversation_messages">
          {result.data.getMessages.map((message) => {
            return (
              <div 
                className={`messageBubble 
                  ${message.sender.userId === receiverId
                    ? 'sender' : 'receiver'}`} 
                key={message.messageId}
              >
                <p>{message.content}</p>
                {/* {
                  message.sender.userId === receiverId 
                  && <DeleteMessage 
                        messagePartnerId={partnerId} 
                        messageId={message.messageId}
                      />
                } */}
              </div>
            )
          })}
        </div>
        <MessageForm receiverId={partnerId}/>
      </div>
    </div>
  )
}

export default Conversation