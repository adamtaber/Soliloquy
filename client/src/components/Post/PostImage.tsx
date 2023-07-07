import { useEffect, useRef, useState } from "react"
import { IconContext } from "react-icons"
import { IoCloseOutline } from "react-icons/io5"

interface IProps {
  imageUrl: string,
}

const PostImage = ({ imageUrl }: IProps) => {
  const [fullSize, setFullSize] = useState(false)
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const url 
    = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${imageUrl}`

  const containerClass = fullSize 
    ? 'fullSizeImageContainer'
    : 'postImageContainer' 

  const imageClass = fullSize 
    ? 'fullSizePostImage'
    : 'postImage'

  const clickImage = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setFullSize(!fullSize)
    e.stopPropagation()
  }

  useEffect(() => {
    if(fullSize) document.documentElement.style.overflowY = 'hidden'
    else document.documentElement.style.overflowY = 'scroll'
  }, [fullSize])
    
  return (
    <div>
      <div className='postImageContainer' onClick={(e) => clickImage(e)}>
        <img 
          className='postImage' 
          src={url}
        />
      </div>
      {fullSize &&
        <div className="fullSizeImageContainer" onClick={(e) => clickImage(e)}>
          <button 
            className="cancelFullSizeImage"
            onClick={() => setFullSize(false)}>
              <IconContext.Provider value={{style: {display: 'block'}}}>
                <IoCloseOutline/>
              </IconContext.Provider>
          </button>
          <img
            className="fullSizePostImage"
            src={url}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      }
    </div>
    
  )
}

export default PostImage