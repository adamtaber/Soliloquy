import { isUser, isUserArray } from "../types"

const notUser = {
  username: "test",
  displayname: "test"
}

const yesUser = {
  username: "test",
  displayname: "test",
  email: "test@test",
  password: "password",
  userId: "test"
}

describe('isUser Type', () => {
  it('isUser is false when not user', async () => {
    expect(isUser(notUser)).toBe(false)
  }) 

  it('isUser is true when user', async () => {
    expect(isUser(yesUser)).toBe(true)
  })
})

describe('isUserArray Type', () => {
  it('isUserArray is false when it contains a non-user', () => {
    const array = [notUser, yesUser]
    
    expect(isUserArray(array)).toBe(false)
  })

  it('isUserArray is true when it cotains only users', () => {
    const array = [yesUser, yesUser]

    expect(isUserArray(array)).toBe(true)
  })
}) 