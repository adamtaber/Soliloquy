import { gql } from '../types';

export const UserFragment = gql(`
  fragment UserFields on User {
    displayname
    username
    userId
  }
`)