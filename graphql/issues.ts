// リポジトリ詳細取得
import {empty, gql, OperationVariables, QueryHookOptions, QueryResult, useQuery} from "@apollo/client";
import {Issue} from "../model/issue";
import {emptyPageInfo, PageInfo} from "./index";

export type IssuesResponse = {
  node:  {
    issues: {
      edges: {
        node: Issue
      }[]
      pageInfo: PageInfo
    }
  }
}

export const emptyIssuesResponse: IssuesResponse = {
  node: {
    issues: {
      edges: [],
      pageInfo: emptyPageInfo
    }
  }
}

export const issuesInRepositoryQuery = gql`
  query ($repositoryId: ID!, $limit: Int, $cursor: String) {
    node(id: $repositoryId) {
      ... on Repository {
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

export type IssuesInRepositoryQueryParam = {
  repositoryId: string,
  limit: number,
  cursor: string | null
}

export type FetchMoreIssues = {
  fetchMoreIssues: (callback: (newResponse: IssuesResponse) => void) => void
}

export const useIssuesInRepositoryQuery = (param: IssuesInRepositoryQueryParam, options?:QueryHookOptions<IssuesResponse, IssuesInRepositoryQueryParam>): QueryResult<IssuesResponse, IssuesInRepositoryQueryParam> & FetchMoreIssues => {
  const result = useQuery<IssuesResponse, IssuesInRepositoryQueryParam>(issuesInRepositoryQuery, {
    ...options,
    variables: param,
    fetchPolicy: 'no-cache'
  })
  const endCursor = result.data?.node.issues.pageInfo.endCursor
  return {...result,
    fetchMoreIssues: (callback: (newResponse: IssuesResponse) => void): void => {
      result.fetchMore({
        variables: {
          repositoryId: param.repositoryId,
          limit: param.limit,
          cursor: endCursor
        }
      }).then(response => callback(response.data))
    }
  }
}
