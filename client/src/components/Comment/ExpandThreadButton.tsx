import { Dispatch, SetStateAction } from "react"

interface IProps {
  setCollapseThread: Dispatch<SetStateAction<boolean>>,
  collapseThread: boolean
}

const ExpandThreadButton = ({ setCollapseThread, collapseThread }: IProps) => {
  return (
    <div>
      {collapseThread && 
        <button className="expandThreadButton" 
          onClick={() => setCollapseThread(false)}>[+]</button>
      }
    </div>
  )
}

export default ExpandThreadButton