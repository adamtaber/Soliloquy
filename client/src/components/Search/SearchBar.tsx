import { useLazyQuery } from "@apollo/client"
import { SEARCH_USERS } from "../../graphql/users/queries"
import { SubmitHandler, useForm } from "react-hook-form"
import { isUserArray } from "../../graphql/users/types"
import { useEffect, useRef, useState } from "react"
import { User } from "../../graphql/types/graphql"
import { useNavigate, useSearchParams } from "react-router-dom"
import SearchList from "./SearchList"
import DynamicSearchList from "./DynamicSearchList"

// Still need to add pagination and handle scrolling

type Inputs = {
  search: string
}

const SearchBar = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchUsers, {data, loading, error}] = useLazyQuery(SEARCH_USERS)
  const [users, setUsers] = useState<User[]>([])
  const [tempUsers, setTempUsers] = useState<User[]>([])
  const [showDynamicList, setShowDynamicList] = useState(false)
  const dynamicListRef = useRef<any>(null)
  const searchBarRef = useRef<any>(null)

  const { register, handleSubmit, watch, setValue } = useForm<Inputs>()

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if ((dynamicListRef.current && !dynamicListRef.current.contains(event.target)) 
        && (searchBarRef.current && !searchBarRef.current.contains(event.target))) {
        setShowDynamicList(false)
      } else {
        setShowDynamicList(true)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [dynamicListRef, searchBarRef])

  const onSubmit: SubmitHandler<Inputs> = (input) => {
    searchUsers({ 
      variables: { searchInput: input.search },
      onCompleted: (data) => {
        if(input.search.length && 
          data?.searchUsers && isUserArray(data.searchUsers)) {
            setUsers(data.searchUsers)
            setTempUsers([])
            setSearchParams({q: `${input.search}`})
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

  useEffect(() => {
    const searchVal = searchParams.get('q')
    if(searchVal && searchVal.length) {
      searchUsers({
        variables: { searchInput: searchVal },
        onCompleted: (data) => {
          if(data?.searchUsers && isUserArray(data.searchUsers)) {
            setUsers(data.searchUsers)
          }
        }
      })
    }
  }, [])

  const navToUser = (userId: string) => {
    navigate(`/users/${userId}`)
  }

  return (
    <div>
      <div>
        <div className="searchBarContainer">
          <form ref={searchBarRef} className="searchBar" onSubmit={handleSubmit(onSubmit)}>
            <label className="searchLabel" htmlFor="search">
              {!watch('search') && 
                <span className="searchBar_inputFiller">Search</span>
              }
              <input 
                className='searchBar_input'
                onFocus={() => setShowDynamicList(true)}
                autoComplete="off"
                {...register('search', {
                  onChange: handleSubmit(onChangeSubmit)
                })}
              />
            </label>
          </form>
        </div>
        <div>
          {showDynamicList && 
            <DynamicSearchList 
              tempUsers={tempUsers} 
              navToUser={navToUser} 
              dynamicListRef={dynamicListRef}
            />
          }
        </div>
      </div>
      <SearchList users={users} navToUser={navToUser}/>
    </div>
  )
}

export default SearchBar