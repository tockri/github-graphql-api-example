import {gql, QueryHookOptions, useQuery} from "@apollo/client";
import {Repository} from "../model/repository";


export type RepositoriesResponse = {
  viewer: {
    repositories: {
      nodes: Repository[]
    }
  }
}

export const emptyRepositoriesResponse: RepositoriesResponse = {
  viewer: {
    repositories: {
      nodes: []
    }
  }
}

// リポジトリ取得
export const repositoriesQuery = gql`
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
          description
          viewerHasStarred
          stargazers {
            totalCount
          }
        }
      }
    }
  }
`

export const useRepositoriesQuery = (options?:QueryHookOptions) => useQuery<RepositoriesResponse>(repositoriesQuery, options)
