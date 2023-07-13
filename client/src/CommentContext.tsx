import { createContext, useState } from 'react'

interface CommentContextType {
  previousCommentId: string | null,
  setPreviousCommentId: (arg: string) => void
}

const CommentContext = createContext<CommentContextType | null>(null)

export const CommentContextProvider = ({children}: any) => {
  const [previousCommentId, setPreviousCommentId] = useState<string | null>('')
  // const [continueThreadCommentId]

  return (
    <CommentContext.Provider value={{previousCommentId, setPreviousCommentId}}>
      {children}
    </CommentContext.Provider>
  )
}

export default CommentContext