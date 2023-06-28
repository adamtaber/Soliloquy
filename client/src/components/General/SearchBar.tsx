import { useLazyQuery } from "@apollo/client"
import { SEARCH_USERS } from "../../graphql/users/queries"
import { SubmitHandler, useForm } from "react-hook-form"
import { isUserArray } from "../../graphql/users/types"
import { useState } from "react"
import { User } from "../../graphql/types/graphql"
import { useNavigate } from "react-router-dom"
type Inputs = {
  search: string
}

const SearchBar = () => {
  const navigate = useNavigate()
  const [searchUsers, {data, loading, error}] = useLazyQuery(SEARCH_USERS)
  const [users, setUsers] = useState<User[]>([])
  const [tempUsers, setTempUsers] = useState<User[]>([])

  const { register, handleSubmit, watch, setValue } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (input) => {
    searchUsers({ 
      variables: { searchInput: input.search },
      onCompleted: (data) => {
        if(data?.searchUsers && isUserArray(data.searchUsers)) {
          setUsers(data.searchUsers)
          setTempUsers([])
        }
      }
    })
    .catch((err) => console.log(err))
    setValue('search', '')
  }

  const onChangeSubmit: SubmitHandler<Inputs> = (input) => {
    if(watch('search').length < 3) setTempUsers([])
    else {
      searchUsers({ 
        variables: { searchInput: input.search },
        onCompleted: (data) => {
          if(data?.searchUsers && isUserArray(data.searchUsers)) {
            setTempUsers(data.searchUsers)
          }
        }
      })
      .catch((err) => console.log(err))
    }
  }

  const navToUser = (userId: string) => {
    navigate(`/users/${userId}`)
  }

  return (
    <div>
      <form className="searchBar" onSubmit={handleSubmit(onSubmit)}>
        <label className="searchLabel" htmlFor="search">
          {!watch('search') && 
            <span className="searchBar_inputFiller">Search</span>
          }
          <input 
            className='searchBar_input'
            {...register('search', {onChange: handleSubmit(onChangeSubmit)})}
          />
        </label>
        {/* <input className="searchBar_submit" type="submit" /> */}
      </form>
      {tempUsers.length > 0 && <div className={`tempSearchList`}>
        {isUserArray(tempUsers) && tempUsers.map((user) => {
          return (
            <div onClick={() => navToUser(user.userId)} className="tempSearchUser" key={user.userId}>
              <p>{user.displayname}</p>
              <p>{user.username}</p>
            </div>
          )
        })}
      </div>}
      <div className="searchList">
        {isUserArray(users) && users.map((user) => {
          return (
            <div onClick={() => navToUser(user.userId)} className="tempSearchUser" key={user.userId}>
              <p>{user.displayname}</p>
              <p>{user.username}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SearchBar