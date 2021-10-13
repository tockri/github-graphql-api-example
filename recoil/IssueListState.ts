import {issuesInRepositoryQuery, IssuesInRepositoryResponse} from "../graphql/issues";
import {Issue} from "../model/issue";
import {emptyPageInfo, PageInfo} from "../graphql";
import {atom, useRecoilState, useSetRecoilState} from "recoil";
import {useQuery} from "@apollo/client";

const convertIssuesResponse = (repositoryId: string, response: IssuesInRepositoryResponse): IssueListState => ({
  repositoryId: repositoryId,
  issues: response.node.issues.edges.map(e => e.node),
  pageInfo: response.node.issues.pageInfo
})

const mergeIssuesResponse = (currVal: IssueListState, response: IssuesInRepositoryResponse): IssueListState => ({
  repositoryId: currVal.repositoryId,
  issues: currVal.issues.concat(response.node.issues.edges.map(e => e.node)),
  pageInfo: response.node.issues.pageInfo
})

export type IssueListState = {
  readonly repositoryId: string
  readonly issues: Issue[]
  readonly pageInfo: PageInfo
}

const emptyIssueListState: IssueListState = {
  repositoryId: "",
  issues: [],
  pageInfo: emptyPageInfo
}

const issueListStateAtom = atom<IssueListState>({
  key: 'issueListState',
  default: emptyIssueListState
})

export type IssueListStateUse = {
  readonly loading: boolean
  readonly error?: Error
  readonly issues: Issue[]
  readonly pageInfo: PageInfo
  readonly fetchMore: () => Promise<void>
}

export const useIssueListState = (repositoryId: string, limit: number): IssueListStateUse => {
  const [currVal, set] = useRecoilState(issueListStateAtom)
  if (currVal.repositoryId !== repositoryId) {
    set({...emptyIssueListState, repositoryId: repositoryId})
  }

  const {loading, error, fetchMore} = useQuery<IssuesInRepositoryResponse>(issuesInRepositoryQuery, {
    variables: {
      repositoryId: repositoryId,
      limit: limit,
      cursor: null
    },
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      set(convertIssuesResponse(repositoryId, data))
    }
  })

  const fetchIssuesMore = async () => {
    const response = await fetchMore({
      variables: {
        repositoryId: repositoryId,
        limit: limit,
        cursor: currVal.pageInfo.endCursor
      }
    })
    set((curr) => mergeIssuesResponse(curr, response.data))
  }

  return {
    loading,
    error,
    issues: currVal.issues,
    pageInfo: currVal.pageInfo,
    fetchMore: fetchIssuesMore
  }
}

export type IssueListEditUse = {
  readonly updateList: (toSave: Issue) => void
  readonly insertTopOnList: (toSave: Issue) => void
}

export const useIssueListEdit = (): IssueListEditUse => {
  const setList = useSetRecoilState<IssueListState>(issueListStateAtom)

  const updateList = (toSave: Issue) => {
    setList((currList) => ({
      ...currList,
      issues: currList.issues.map(i => i.id === toSave.id ? toSave : i)
    }))
  }

  const insertTopOnList = (toSave: Issue) => {
    setList((currList) => ({
      ...currList,
      issues: [toSave].concat(currList.issues)
    }))
  }

  return {
    updateList,
    insertTopOnList
  }
}



