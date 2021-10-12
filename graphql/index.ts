import {gql} from '@apollo/client'


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
