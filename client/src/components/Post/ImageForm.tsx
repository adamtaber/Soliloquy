import { useLazyQuery, useQuery } from "@apollo/client"
import axios from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { GET_POST_IMAGE_SIGNATURE } from "../../graphql/posts/queries"
import { isPostImageSignature } from "../../graphql/posts/types"

type Inputs = {
  file: File
}

const ImageForm = () => {
  const { register, handleSubmit } = useForm<Inputs>()
  const [image, setImage] = useState<File>()
  const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

  const getPostImageSig = useQuery(GET_POST_IMAGE_SIGNATURE)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]) setImage(e.target.files[0])
  }

  const onSubmit = async () => {
    if(image === undefined) console.log('no image')
    else {
      // getPostImageSignature()
      const postImageSigData =
          getPostImageSig.data 
            && isPostImageSignature(getPostImageSig.data?.getPostImageSignature)
              ? getPostImageSig.data.getPostImageSignature
              : ''
      if(postImageSigData && isPostImageSignature(postImageSigData)) {
          const { signature, timestamp } = postImageSigData
          const formData = new FormData()
          formData.append('file', image)
          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload?api_key=${API_KEY}&timestamp=${timestamp}&signature=${signature}`,
            {
              method: 'POST',
              body: formData,
            }
          )
          const data = await res.json()
          console.log(data)
        }
       
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('file', 
          {onChange: (e) => handleFileChange(e)})} 
          type='file'/>
        <input type="submit" />
      </form>
    </div>
  )
}

export default ImageForm