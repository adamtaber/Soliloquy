import { useMutation, useQuery } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { CREATE_POST } from "../../graphql/posts/mutations"
import { GET_FEED_POSTS, GET_POST_IMAGE_SIGNATURE, GET_USER_POSTS } from "../../graphql/posts/queries"
import { useRef, useState } from "react"
import { isPostImageSignature } from "../../graphql/posts/types"

type Inputs = {
  content: string,
  imageFile: FileList
}

interface IProps {
  userId: string
}

const PostForm = ({ userId }: IProps) => {
  const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const [imageSignature, setImageSignature] = useState('')
  const [imageTimestamp, setImageTimestamp] = useState<number>()
  const { register, handleSubmit, watch, setValue } = useForm<Inputs>()
  const { ref } = register('content')
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const chooseFileRef = useRef<HTMLInputElement | null>(null)
  
  const handleChange = () => {
    if(textAreaRef.current) {
      textAreaRef.current.style.height = "35px"
      const scrollHeight = textAreaRef.current.scrollHeight + "px"
      textAreaRef.current.style.height = scrollHeight
    }
  }

  const [createPost, { data, loading, error }] = useMutation(CREATE_POST, {
    refetchQueries: [
      {query: GET_FEED_POSTS, variables: {limit: 30}}, 
      {query: GET_USER_POSTS, variables: {userId}}
    ]
  })

  const { refetch: refetchImageSignature } = useQuery(GET_POST_IMAGE_SIGNATURE, {
    skip: true
  })

  const handleImageChange = async () => {
    const { data } = await refetchImageSignature()
    if(data.getPostImageSignature 
      && isPostImageSignature(data.getPostImageSignature)) {
        console.log(data.getPostImageSignature)
        setImageSignature(data.getPostImageSignature.signature)
        setImageTimestamp(data.getPostImageSignature.timestamp)
      }
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data.imageFile[0])
    const formData = new FormData()
    formData.append('file', data.imageFile[0])
    console.log(CLOUD_NAME, API_KEY, imageTimestamp, imageSignature)
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload?api_key=${API_KEY}&timestamp=${imageTimestamp}&signature=${imageSignature}`,
      {
        method: 'POST',
        body: formData,
      }
    )
    const imageData = await res.json()
    if(imageData.secure_url) {
      console.log(imageData)
      createPost({ variables: {
        content: data.content, 
        // imageUrl: imageData.secure_url
        // imageUrl: `https://res.cloudinary.com/ds5rgradj/image/upload/f_auto,q_auto/${imageData.public_id}`
        imageUrl: imageData.public_id
      }})
      setValue('content', '')
    }
  }

  const chooseFile = () => {
    if(chooseFileRef.current) chooseFileRef.current.click()
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
              onChange: () => handleChange()
            })} 
            ref={(e) => {
              ref(e)
              textAreaRef.current = e
            }}
          />
        </label>
        <div className="postForm__bottomRow">
          <input 
            type='file' 
            {...register('imageFile', {
              onChange: () => handleImageChange()
            })}
            // style={{display: 'none'}}
            // ref={chooseFileRef}
            // ref={(e) => {
            //   ref(e)
            //   chooseFileRef.current = e
            // }} 
          />
          {/* <button className="postForm__submit" onClick={() => chooseFile()}>Image</button> */}
          <input className="postForm__submit" type="submit" />
        </div>
      </form>
    </>
  )
}

export default PostForm