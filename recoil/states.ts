import {Repository} from "../model/repository";
import {atom, selector} from "recoil";
import {emptyRepositoriesResponse, RepositoriesResponse} from "../graphql/repositories";
import {Issue} from "../model/issue";
import {emptyIssuesResponse, IssuesResponse} from "../graphql/issues";
import {emptyPageInfo, PageInfo} from "../graphql";
import {ApolloClient, useApolloClient} from "@apollo/client";

export type RepositoryItemState = {
  repository: Repository
  visible: boolean
}

export type SelectedRepositoryItemState = {
  selected?: Repository
}

export type RepoListState = {
  items: RepositoryItemState[]
  selectedId: string
}

export const selectedRepositoryIdState = atom<string>({
  key: 'selectedRepositoryIdState',
  default: ''
})

export const repositoriesResponseState = atom<RepositoriesResponse>({
  key: 'repositoriesResponse',
  default: emptyRepositoriesResponse
})

export const repoListState = selector<RepoListState>({
  key: 'repoListState',
  get: ({get}) => {
    const apiResponse = get(repositoriesResponseState)
    const selectedId = get(selectedRepositoryIdState)
    return {
      items: apiResponse.viewer.repositories.nodes.map(repo => ({
        repository: repo,
        visible: !selectedId || repo.id === selectedId
      })),
      selectedId: selectedId
    }
  }
})

export const selectedRepositoryState = selector<SelectedRepositoryItemState>({
  key: 'selectedRepositoryState',
  get: ({get}) => {
    const apiResponse = get(repositoriesResponseState)
    const selectedId = get(selectedRepositoryIdState)
    return {
      selected: apiResponse.viewer.repositories.nodes.find(repo => repo.id === selectedId)
    }
  }
})


// IssueList

export const mergeIssuesResponse = (currVal: IssueListState, response: IssuesResponse):IssueListState => ({
  issues: currVal.issues.concat(response.node.issues.edges.map(e => e.node)),
  pageInfo: response.node.issues.pageInfo
})

export type IssueListState = {
  issues: Issue[]
  pageInfo: PageInfo
}

const issueListStateAtom = atom({
  key: 'issueListState',
  default: emptyIssuesResponse
})

type InitState = {
  name: 'Init',
  repositoryId: string,
  limit: number
}

type LoadedState = {
  name: 'Loaded',
  cursor: string | null
}

type Action = InitState | LoadedState

export const actionState = (repositoryId:string, limit:number) => atom<Action>({
  key: 'actionState',
  default: {
    name: 'Init',
    repositoryId: repositoryId,
    limit: limit
  }
})

export const issueListState = (client: ApolloClient<any>, repositoryId:string, limit:number) => selector<IssueListState>({
  key: 'issueListState',
  get: async ({get, set}) => {
    const currState = get(issueListStateAtom)
    const action = get(actionState(repositoryId, limit))

    if (action.name === 'Init' || currState == emptyIssuesResponse) {

    }

    return {
      issues: issuesResponse.node.issues.edges.map(e => e.node),
      pageInfo: issuesResponse.node.issues.pageInfo
    }
  },
  set: ({set, get}) => {
    set(issueListStateAtom, {
      node: {
        issues: {
          edges: [],
          pageInfo: emptyPageInfo
        }
      }
    })
  }
})
