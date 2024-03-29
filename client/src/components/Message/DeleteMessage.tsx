import { useMutation } from "@apollo/client"
import { DELETE_MESSAGE } from "../../graphql/messages/mutations"
import { GET_MESSAGES, GET_MESSAGE_PARTNERS } from "../../graphql/messages/queries"

//Add subscription for this so it updates for both users

const DeleteMessage = (props: {messagePartnerId: string, messageId: string}) => {
  const {messagePartnerId, messageId} = props

  const [deleteMessage, {loading, error, data}] = useMutation(DELETE_MESSAGE, {
    refetchQueries: [
      { query: GET_MESSAGES, variables: { messagePartnerId } },
      { query: GET_MESSAGE_PARTNERS }
    ]
  })

  if(loading) console.log('loading...')
  if(error)console.log(error)

  const onDelete = () => {
    deleteMessage({
      variables: {messageId}
    })
  }

  return (
    <button onClick={() => onDelete()}>Delete Message</button>
  )
}

export default DeleteMessage