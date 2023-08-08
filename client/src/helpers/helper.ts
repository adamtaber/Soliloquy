import { ApolloQueryResult } from "@apollo/client"
import { Exact, GetPostImageSignatureQuery, Post } from "../graphql/types/graphql"
import { isPostImageSignature } from "../graphql/posts/types"

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY

export const createDate = (itemDate: string) => {
  // const date = new Date(Number(itemDate))
  const date = new Date(itemDate)
  const timeDifference = Math.floor((Number(new Date()) - Number(date)) / 1000)
  
  if (timeDifference >= 31536000) {
    return Math.floor(timeDifference / 31536000) + ' yr. ago'
  } else if (timeDifference >= 2592000) {
    return Math.floor(timeDifference / 2592000) + ' mo. ago'
  } else if (timeDifference >= 86400 && timeDifference < (86400 * 2)) {
    return '1 day ago'
  } else if (timeDifference >= 86400) {
    return Math.floor(timeDifference / 86400) + ' days ago'
  } else if (timeDifference >= 3600) {
    return Math.floor(timeDifference / 3600) + ' hr. ago'
  } else if (timeDifference >= 60) {
    return Math.floor(timeDifference / 60) + ' min. ago'
  } else {
    // return Math.floor(timeDifference) + ' seconds ago'
    return '1 min. ago'
  }
}

export const loadImage = (image: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${image}`

    img.onload = () => {
      resolve(image)
      // setTimeout(() => {
      //   resolve(image)
      // }, 1000)
    }
    img.onerror = (err) => reject(err)
  })
}

export const createImgArray = (feed: Array<Post>, loadingPoint: number) => {
  const imgArray: string[] = []

  feed.slice(loadingPoint).map((post) => {
    if (post.imageUrl) {
      imgArray.push(post.imageUrl)
    }
  })

  return imgArray
}

type textAreaRef = React.MutableRefObject<HTMLTextAreaElement | null>

export const handleTextInputChange = (textAreaRef: textAreaRef) => {
  if(textAreaRef.current) {
    textAreaRef.current.style.height = "35px"
    const scrollHeight = textAreaRef.current.scrollHeight + "px"
    textAreaRef.current.style.height = scrollHeight
  }
}

type refetchImgSig = 
  () => Promise<ApolloQueryResult<GetPostImageSignatureQuery>>

interface fetchSigArgs {
  refetchImgSig: refetchImgSig, 
  setImageSignature: (arg: string) => void,
  setImageTimestamp: (arg: number) => void
}

export const fetchSignature = async ({
  refetchImgSig, 
  setImageSignature, 
  setImageTimestamp,
}: fetchSigArgs) => {
  const { data } = await refetchImgSig()
  if (
    data.getPostImageSignature && 
    isPostImageSignature(data.getPostImageSignature)
  ) {
    setImageSignature(data.getPostImageSignature.signature)
    setImageTimestamp(data.getPostImageSignature.timestamp)
  }
}

interface submitImageArgs {
  file: File | null,
  content: string,
  imageTimestamp: number | undefined,
  imageSignature: string
}

export const submitImage = async ({
  file, 
  content, 
  imageTimestamp, 
  imageSignature
}: submitImageArgs) => {
    if (file && imageTimestamp && imageSignature) {
      const formData = new FormData()
      console.log(formData)
      formData.append('file', file)
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload?api_key=${API_KEY}&timestamp=${imageTimestamp}&signature=${imageSignature}`,
        {
          method: 'POST',
          body: formData,
        }
      )
      const imageData = await res.json()
      return imageData.public_id 
        ? { content, imageUrl: imageData.public_id }
        : { content }
    } else {
      return { content }
    }
}