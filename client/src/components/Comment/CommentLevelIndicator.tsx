import { Dispatch, SetStateAction } from "react";

interface IProps {
  setCollapseThread: Dispatch<SetStateAction<boolean>>,
  collapseThread: boolean
}

const CommentLevelIndicator = ({ setCollapseThread, collapseThread }: IProps) => {
  return (
    <div className="levelIndicatorContainer" 
        onClick={() => setCollapseThread(!collapseThread)}>
          <div className="levelIndicator" />
    </div>
  )
}

export default CommentLevelIndicator