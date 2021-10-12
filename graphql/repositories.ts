import {gql} from "@apollo/client";
import {Repository} from "../model/repository";


export type RepositoriesResponse = {
  viewer: {
    repositories: {
      nodes: Repository[]
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
