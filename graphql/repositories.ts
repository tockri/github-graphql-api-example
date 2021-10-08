import {gql, useQuery} from "@apollo/client";
import {RepositorySummary} from "../model/repository";


export type RepositoriesResponse = {
  viewer: {
    repositories: {
      nodes: RepositorySummary[]
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
          viewerHasStarred
          stargazers {
            totalCount
          }
        }
      }
    }
  }
`
export const useRepositoriesQuery = () => useQuery<RepositoriesResponse>(repositoriesQuery)
