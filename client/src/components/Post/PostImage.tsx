import { useEffect, useRef, useState } from "react"

interface IProps {
  imageUrl: string
}

type imgDimensionObj = {
  height: number,
  width: number
}

const PostImage = ({ imageUrl }: IProps) => {
  // const [imgDimensions, setImgDimensions] = useState<imgDimensionObj>()
  const [tallImage, setTallImage] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // const decodeImage = async (url: string) => {
  //   const img = new Image()
  //   img.src = url
  //   await img.decode()
  //   setImgDimensions({
  //     height: img.naturalHeight,
  //     width: img.naturalWidth
  //   })
  // }

  // useEffect(() => {
  //   decodeImage(imageUrl)
  // }, [])

  // useEffect(() => {
  //   if(imgDimensions && imgDimensions.height > 2000) {
  //     setImgClasses(`${imgClasses} partialImage`)
  //   }
  // }, [imgDimensions])

  const checkImgHeight = () => {
    if(imgRef.current && imgRef.current.height > 550) {
      setTallImage(true)
    }
  }

  return (
    <div className={'postImageContainer'}>
      <img 
        className="postImage" 
        src={imageUrl}
        ref={imgRef}
        onLoad={() => checkImgHeight()}
      />
      {/* {tallImage &&
        <div className="expandImage">
          See Full Image
        </div>
      } */}
    </div>
  )
}

export default PostImage