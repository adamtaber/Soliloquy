import { useMutation } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { CREATE_MESSAGE } from "../../graphql/messages/mutations"
import { GET_MESSAGES, GET_MESSAGE_PARTNERS } from "../../graphql/messages/queries"

type Inputs = {
  content: string
}

const MessageForm = (props: {receiverId: string}) => {
  const {receiverId} = props
  const { register, handleSubmit } = useForm<Inputs>()

  const [message, { data, loading, error }] = useMutation(CREATE_MESSAGE, {
    refetchQueries: [ 
      { query: GET_MESSAGES, variables: {messagePartnerId: receiverId}},
      { query: GET_MESSAGE_PARTNERS }
    ]
  })

  if (loading) console.log('loading...')
  if (error) console.log(error)

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    message({ variables: {content: data.content, receiverId} })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input defaultValue="Send a message..." {...register('content')} />
        <input type="submit" />
      </form>
    </>
  )
}

export default MessageForm