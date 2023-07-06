import { useMutation, useQuery } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { CREATE_POST } from "../../graphql/posts/mutations"
import { GET_FEED_POSTS, GET_POST_IMAGE_SIGNATURE, GET_USER_POSTS } from "../../graphql/posts/queries"
import { useRef, useState } from "react"
import { fetchSignature, handleTextInputChange, submitImage } from "../../helpers/helper"

type Inputs = {
  content: string,
  imageFile: FileList
}

interface IProps {
  userId: string
}

const PostForm = ({ userId }: IProps) => {
  const [imageSignature, setImageSignature] = useState('')
  const [imageTimestamp, setImageTimestamp] = useState<number>()
  const [selectedImage, setSelectedImage] = useState('')

  const { register, handleSubmit, watch, setValue, resetField } = useForm<Inputs>()
  const contentRef = register('content')
  const imageFileRef = register('imageFile')
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const chooseFileRef = useRef<HTMLInputElement | null>(null)

  const chooseFile = () => {
    if(chooseFileRef.current) chooseFileRef.current.click()
  }

  const [createPost, createPostMutation] = useMutation(CREATE_POST, {
    refetchQueries: [
      { query: GET_FEED_POSTS, variables: { limit: 15 } }, 
      { query: GET_USER_POSTS, variables: { userId } }
    ]
  })

  const { refetch: refetchImgSig } = useQuery(GET_POST_IMAGE_SIGNATURE, {
    skip: true
  })

  const handleImageChange = () => {
    fetchSignature({refetchImgSig, setImageSignature, setImageTimestamp})
    setSelectedImage(URL.createObjectURL(watch('imageFile')[0]))
  }

  const removeImage = () => {
    setSelectedImage('')
    resetField('imageFile')
    console.log(watch('imageFile'))
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const file = data.imageFile ? data.imageFile[0] : null
    const content = data.content
    const variables = 
      await submitImage({file, content, imageTimestamp, imageSignature})
    createPost({ variables })
    setValue('content', '')
  }

  return (
    <>
      <form className="home__postForm" onSubmit={handleSubmit(onSubmit)}>        
        <label htmlFor="content">
          {!watch('content') && 
            <span className="postForm__inputFiller">Post something here!</span>
          }
          {watch('content') && 
            <span className="postForm__charCount">
              {watch('content').length}/500
            </span>
          }
          <textarea 
            className='postForm__input'
            {...register('content', {
              onChange: () => handleTextInputChange(textAreaRef)
            })} 
            ref={(e) => {
              contentRef.ref(e)
              textAreaRef.current = e
            }}
          />
        </label>
        <div className="postForm__imageContainer">
          <img className="postForm__image" src={selectedImage} />
        </div>
        <div className="postForm__bottomRow">
          <input 
            type='file' 
            {...register('imageFile', {
              onChange: () => handleImageChange()
            })}
            style={{display: 'none'}}
            ref={(e) => {
              imageFileRef.ref(e)
              chooseFileRef.current = e
            }} 
          />
          <button 
            className="postForm__submit" 
            type='button' 
            onClick={() => chooseFile()}>
              Image
          </button>
          {selectedImage && 
            <button 
              className="postForm__submit"
              onClick={() => removeImage()}>
                Cancel
            </button>
          }
          <button className="postForm__submit" type="submit">Submit</button>
        </div>
        
      </form>
    </>
  )
}

export default PostForm