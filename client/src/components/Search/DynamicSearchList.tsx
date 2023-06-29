import { useEffect } from "react"
import { User } from "../../graphql/types/graphql"

interface IProps {
  tempUsers: Array<User>,
  navToUser: (arg: string) => void,
  dynamicListRef: React.MutableRefObject<any>
}

const DynamicSearchList = ({tempUsers, navToUser, dynamicListRef}: IProps) => {
  return (
    <div className="dynamicSearchContainer">
      {tempUsers.length > 0 && 
        <div ref={dynamicListRef} className={`tempSearchList`}>
          {tempUsers.map((user) => {
            return (
              <div 
                onClick={() => navToUser(user.userId)} 
                className="tempSearchUser" key={user.userId}>
                  <p>{user.displayname}</p>
                  <p>{user.username}</p>
              </div>
            )
          })}
        </div>
      }
    </div>
  )
}

export default DynamicSearchList