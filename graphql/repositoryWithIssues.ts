// リポジトリ詳細取得
import {gql, useQuery} from "@apollo/client";
import {Repository} from "../model/repository";
import {IssueSummary} from "../model/issue";
import {PageInfo} from "./index";

export type RepositoryWithIssuesResponse = {
  node: Repository & {
    issues: {
      edges: {
        node: IssueSummary
      }[]
      pageInfo: PageInfo
    }
  }
}
export const repositoryWithIssuesQuery = gql`
  query ($id: ID!, $limit: Int, $cursor: String) {
    node(id: $id) {
      ... on Repository {
        id
        name
        url
        viewerHasStarred
        stargazers {
          totalCount
        }
        issues(
          first: $limit
          after: $cursor
          orderBy: { field: CREATED_AT, direction: DESC }
        ) {
          edges {
            node {
              id
              title
              body
              url
            }
          }
          pageInfo {
            startCursor
            hasNextPage
            endCursor
          }
        }
      }
    }
  }
`
export type RepositoryWithIssuesQueryParam = {
  repositoryId: string,
  limit: number
}
export const useRepositoryWithIssuesQuery = (param: RepositoryWithIssuesQueryParam) =>
    useQuery<RepositoryWithIssuesResponse>(repositoryWithIssuesQuery, {
      variables: {id: param.repositoryId, limit: param.limit},
      fetchPolicy: 'no-cache'
    })
