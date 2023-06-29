import { User } from "../../graphql/types/graphql"
import FollowButton from "../User/FollowButton"

interface IProps {
  users: Array<User>,
  navToUser: (arg: string) => void
}

const SearchList = ({users, navToUser}: IProps) => {
  return (
    <div>
      <div className="searchList">
        {users.map((user) => {
          return (
            // <div 
            //   onClick={() => navToUser(user.userId)} 
            //   className="tempSearchUser" key={user.userId}>
            //     <p>{user.displayname}</p>
            //     <p>{user.username}</p>
            // </div>
            <div 
              className="followList__user" 
              onClick={() => navToUser(user.userId)} 
              key={user.userId}>
                <div>
                  <p>{user.displayname}</p>
                  <p className="followList__username">#{user.username}</p>
                </div>
                <FollowButton userId={user.userId}/>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SearchList