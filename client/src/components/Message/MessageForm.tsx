import { useMutation } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { CREATE_MESSAGE } from "../../graphql/messages/mutations"
import { GET_MESSAGES, GET_MESSAGE_PARTNERS } from "../../graphql/messages/queries"
import { useRef } from "react"

type Inputs = {
  content: string
}

const MessageForm = (props: {receiverId: string}) => {
  const {receiverId} = props
  const { register, handleSubmit, watch } = useForm<Inputs>()
  const { ref } = register('content')
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

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

  const handleChange = () => {
    if(textAreaRef.current) {
      textAreaRef.current.style.height = "35px"
      const scrollHeight = textAreaRef.current.scrollHeight + "px"
      textAreaRef.current.style.height = scrollHeight
    }
  }

  return (
    <div className="messageForm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="content">
          { !watch('content') &&
            <span className="messageInputFiller">
              Send a message
            </span>
          }
          {/* <textarea 
            className="messageInput" 
            {...register('content')} 
          /> */}
          <textarea 
            className='messageInput'
            {...register('content', {
              onChange: () => handleChange()
            })} 
            ref={(e) => {
              ref(e)
              textAreaRef.current = e
            }}
          />
        </label>
        <button 
          className="messageSubmit" 
          type="submit">
            Send
        </button>
      </form>
    </div>
  )
}

export default MessageForm