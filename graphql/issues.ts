// リポジトリ詳細取得
import {gql} from "@apollo/client";
import {Issue} from "../model/issue";
import {PageInfo} from "./index";

export type IssuesInRepositoryResponse = {
  node: {
    issues: {
      edges: {
        node: Issue
      }[]
      pageInfo: PageInfo
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

export type CreateIssueResponse = {
  createIssue: {
    issue: Issue
  }
}

export const createIssueMutation = gql`
  mutation ($repositoryId: ID!, $title: String, $body: String) {
    createIssue(input: { repositoryId: $repositoryId, title: $title, body: $body }) {
      issue {
        id
        title
        body
        url
      }
    }
  }
`

export type UpdateIssueResponse = {
  updateIssue: {
    issue: Issue
  }
}

export const updateIssueMutation = gql`
  mutation ($issueId: ID!, $title: String, $body: String) {
    updateIssue(input: { id: $issueId, title: $title, body: $body }) {
      issue {
        id
        title
        body
        url
      }
    }
  }
`
