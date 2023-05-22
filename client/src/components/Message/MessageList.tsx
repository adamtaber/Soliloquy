import { useQuery } from "@apollo/client"
import { GET_MESSAGE_PARTNERS } from "../../graphql/messages/queries"
import { isBasicUserArray } from "../../graphql/messages/types"
import { Navigate } from "react-router-dom"

const MessageList = (props: {openMessage: (partnerId: string) => void}) => {
  const {loading, error, data} = useQuery(GET_MESSAGE_PARTNERS)
  const {openMessage} = props

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