import {ApolloError, gql, useQuery} from '@apollo/client'


export type OnErrorProps = {
  error: ApolloError
}


export type PageInfo = {
  startCursor: string
  hasNextPage: boolean
  endCursor: string | null
}

export const emptyPageInfo: PageInfo = {
  startCursor: "",
  hasNextPage: true,
  endCursor: null
}

export const ADD_STAR_REPOSITORY = gql`
  mutation ($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`

export const REMOVE_STAR_REPOSITORY = gql`
  mutation ($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`

export const CREATE_ISSUE = gql`
  mutation ($id: ID!, $title: String, $body: String) {
    createIssue(input: { repositoryId: $id, title: $title, body: $body }) {
      issue {
        id
        title
        body
        url
      }
    }
  }
`

export const UPDATE_ISSUE = gql`
  mutation ($id: ID!, $title: String, $body: String) {
    updateIssue(input: { id: $id, title: $title, body: $body }) {
      issue {
        id
        title
        body
        url
      }
    }
  }
`
