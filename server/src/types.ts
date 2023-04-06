
export interface userObject {
  displayname: string,
  username: string,
  email: string,
  password: string
}

export interface jwtPayload {
  user_id?: string
}