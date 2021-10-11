import {Repository} from "../model/repository";
import {
  atom,
  selector,
  SetterOrUpdater,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue
} from "recoil";
import {emptyRepositoriesResponse, RepositoriesResponse} from "../graphql/repositories";
import {Issue} from "../model/issue";
import {issuesInRepositoryQuery, IssuesResponse} from "../graphql/issues";
import {emptyPageInfo, PageInfo} from "../graphql";
import {ApolloClient, ApolloError, useQuery} from "@apollo/client";

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

const convert = (repositoryId: string, response: IssuesResponse): IssueListState => ({
  repositoryId: repositoryId,
  issues: response.node.issues.edges.map(e => e.node),
  pageInfo: response.node.issues.pageInfo
})

const mergeIssuesResponse = (currVal: IssueListState, response: IssuesResponse): IssueListState => ({
  repositoryId: currVal.repositoryId,
  issues: currVal.issues.concat(response.node.issues.edges.map(e => e.node)),
  pageInfo: response.node.issues.pageInfo
})

export type IssueListState = {
  repositoryId: string
  issues: Issue[]
  pageInfo: PageInfo
}

const emptyIssueListState = {
  repositoryId: "",
  issues: [],
  pageInfo: emptyPageInfo
}

const issueListStateAtom = atom<IssueListState>({
  key: 'issueListState',
  default: emptyIssueListState
})

export type IssueListStateUse = {
  loading: boolean,
  error?: ApolloError,
  state: IssueListState,
  set: SetterOrUpdater<IssueListState>,
  fetchMore: () => Promise<void>
}

export const useIssueListState = (repositoryId: string, limit: number): IssueListStateUse => {
  const [currVal, set] = useRecoilState(issueListStateAtom)
  if (currVal.repositoryId !== repositoryId) {
    set({...emptyIssueListState, repositoryId:repositoryId})
  }

  const {loading, error, fetchMore} = useQuery<IssuesResponse>(issuesInRepositoryQuery, {
    variables: {
      repositoryId: repositoryId,
      limit: limit,
      cursor: null
    },
    onCompleted: (data) => {
      set(convert(repositoryId, data))
    }
  })

  const fetchIssuesMore = useRecoilCallback((i) => async () => {
    const currVal = await i.snapshot.getPromise(issueListStateAtom)
    const response = await fetchMore({
      variables: {
        repositoryId: repositoryId,
        limit: limit,
        cursor: currVal.pageInfo.endCursor
      }
    })
    i.set(issueListStateAtom, mergeIssuesResponse(currVal, response.data))
  }, [repositoryId])

  return {
    loading,
    error,
    state: currVal,
    set,
    fetchMore: fetchIssuesMore
  }
}
