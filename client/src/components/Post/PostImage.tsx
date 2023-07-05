import { useEffect, useRef, useState } from "react"

interface IProps {
  imageUrl: string,
}

const PostImage = ({ imageUrl }: IProps) => {
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const url 
    = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${imageUrl}`
  // const previewUrl 
  //   = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,c_scale,w_30/${imageUrl}`
  const [imageLoaded, setImageLoaded] = useState(false)


  return (
    <div className={'postImageContainer'}>
      <img 
        className="postImage" 
        src={url}
      />
    </div>
  )
}

export default PostImage