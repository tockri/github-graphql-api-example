// リポジトリ詳細取得
import {gql, useQuery} from "@apollo/client";

export type IssueSummary = {
  id: string
  title: string
  url: string
  body: string
}
export type PageInfo = {
  startCursor: string
  hasNextPage: boolean
  endCursor: string
}
export type RepositoryWithIssues = {
  node: {
    id: string
    name: string
    url: string
    viewerHasStarred: boolean
    stargazers: {
      totalCount: number
    }
    issues: {
      edges: [
        node: IssueSummary
      ]
      pageInfo: PageInfo
    }
  }
}
export const GetRepositoryWithIssuesQuery = gql`
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
    useQuery<RepositoryWithIssues>(GetRepositoryWithIssuesQuery, {
      variables: {id: param.repositoryId, limit: param.limit},
      fetchPolicy: 'no-cache'
    })
