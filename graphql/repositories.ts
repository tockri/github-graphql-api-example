import {gql, useQuery} from "@apollo/client";

export type RepositorySummary = {
  id: string
  name: string
  url: string
  viewerHasStarred: boolean
  stargazers: {
    totalCount: number
  }
}

export type GetRepositoriesResponse = {
  viewer: {
    repositories: {
      nodes: RepositorySummary[]
    }
  }
}

// リポジトリ取得
export const GetRepositoriesQuery = gql`
  query {
    viewer {
      repositories(
        orderBy: { field: CREATED_AT, direction: DESC }
        first: 8
        privacy: PUBLIC
      ) {
        nodes {
          id
          name
          url
          viewerHasStarred
          stargazers {
            totalCount
          }
        }
      }
    }
  }
`
export const useRepositoriesQuery = () => useQuery<GetRepositoriesResponse>(GetRepositoriesQuery)
