import {Repository} from "../model/repository";
import {atom, selector, SetterOrUpdater, useRecoilCallback, useRecoilState} from "recoil";
import {repositoriesQuery, RepositoriesResponse} from "../graphql/repositories";
import {Issue} from "../model/issue";
import {issuesInRepositoryQuery, IssuesResponse} from "../graphql/issues";
import {emptyPageInfo, PageInfo} from "../graphql";
import {ApolloError, useQuery} from "@apollo/client";

export type RepositoryItemState = {
  repository: Repository
}

export type RepositoryListState = {
  items: RepositoryItemState[]
}

const emptyRepositoryListState: RepositoryListState = {
  items: [],
}

export const selectedRepositoryIdState = atom<string>({
  key: 'selectedRepositoryIdState',
  default: ''
})

export const repositoryListState = atom<RepositoryListState>({
  key: 'repositoryListState',
  default: emptyRepositoryListState
})

export type RepositoryListStateUse = {
  loading: boolean
  error?: ApolloError
  state: RepositoryListState
  set: SetterOrUpdater<RepositoryListState>
}

const convertRepositoriesResponse = (data: RepositoriesResponse): RepositoryListState =>
    ({
      items: data.viewer.repositories.nodes.map(repo => ({
        repository: repo
      }))
    })

export const useRepositoryListState = (): RepositoryListStateUse => {
  const [currVal, set] = useRecoilState(repositoryListState)

  const {loading, error} = useQuery(repositoriesQuery, {
    onCompleted: (data) => {
      const nextVal = convertRepositoriesResponse(data)
      set(nextVal)
    }
  })

  return {
    loading,
    error,
    state: currVal,
    set
  }
}

export type SelectedRepositoryItemState = {
  repository?: Repository
}

export const selectedRepositoryState = selector<SelectedRepositoryItemState>({
  key: 'selectedRepositoryState',
  get: ({get}) => {
    const list = get(repositoryListState)
    const selectedId = get(selectedRepositoryIdState)
    return {
      repository: list.items.find(repo => repo.repository.id === selectedId)?.repository
    }
  }
})


// IssueList

const convertIssuesResponse = (repositoryId: string, response: IssuesResponse): IssueListState => ({
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
    set({...emptyIssueListState, repositoryId: repositoryId})
  }

  const {loading, error, fetchMore} = useQuery<IssuesResponse>(issuesInRepositoryQuery, {
    variables: {
      repositoryId: repositoryId,
      limit: limit,
      cursor: null
    },
    onCompleted: (data) => {
      set(convertIssuesResponse(repositoryId, data))
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
