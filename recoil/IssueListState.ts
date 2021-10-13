import {
  createIssueMutation,
  CreateIssueResponse,
  issuesInRepositoryQuery,
  IssuesResponse,
  updateIssueMutation,
  UpdateIssueResponse
} from "../graphql/issues";
import {Issue} from "../model/issue";
import {emptyPageInfo, PageInfo} from "../graphql";
import {atom, SetterOrUpdater, useRecoilCallback, useRecoilState} from "recoil";
import {ApolloError, useMutation, useQuery} from "@apollo/client";

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
  readonly error?: ApolloError
  readonly state: IssueListState
  readonly set: SetterOrUpdater<IssueListState>
  readonly fetchMore: () => Promise<void>
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
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      set(convertIssuesResponse(repositoryId, data))
    }
  })

  const fetchIssuesMore = useRecoilCallback((i) => async () => {
    const currentList = await i.snapshot.getPromise(issueListStateAtom)
    const response = await fetchMore({
      variables: {
        repositoryId: repositoryId,
        limit: limit,
        cursor: currentList.pageInfo.endCursor
      }
    })
    i.set(issueListStateAtom, mergeIssuesResponse(currentList, response.data))
  }, [repositoryId, limit, fetchMore])

  return {
    loading,
    error,
    state: currVal,
    set,
    fetchMore: fetchIssuesMore
  }
}


type IssueEditingState = {
  readonly editingIssueId: string
  readonly editingNew: boolean
}

const emptyIssueEditingState: IssueEditingState = {
  editingIssueId: "",
  editingNew: false
}

const issueEditingStateAtom = atom<IssueEditingState>({
  key: 'issueEditingState',
  default: emptyIssueEditingState
})

export type IssueEditingUse = {
  readonly startEdit: (issue: Issue) => void
  readonly submitEdit: (toSave: Issue) => Promise<void>
  readonly errorInUpdate?: ApolloError
  readonly updateSubmitting: boolean

  readonly startCreate: () => void
  readonly submitCreate: (toSave: Issue) => Promise<void>
  readonly createSubmitting: boolean
  readonly errorInCreate?: ApolloError

  readonly cancel: () => void
} & IssueEditingState

export const useIssueEditing = (repositoryId: string): IssueEditingUse => {
  const [, setList] = useRecoilState<IssueListState>(issueListStateAtom)
  const [currVal, set] = useRecoilState<IssueEditingState>(issueEditingStateAtom)
  const [createIssue, createResponse] = useMutation<CreateIssueResponse>(createIssueMutation)
  const [updateIssue, updateResponse] = useMutation<UpdateIssueResponse>(updateIssueMutation)

  const startEdit = (issue: Issue) => set({
    editingIssueId: issue.id,
    editingNew: false
  })

  const startCreate = () => set({
    editingIssueId: "",
    editingNew: true
  })


  const stopEditing = () => {
    set(emptyIssueEditingState)
  }

  const submitCreate = async (toSave: Issue) => {
    if (currVal.editingIssueId === "") {
      const {data} = await createIssue({
        variables: {
          repositoryId: repositoryId,
          title: toSave.title,
          body: toSave.body
        }
      })
      if (data) {
        const newIssue = data.createIssue.issue
        stopEditing()
        setList((currList) => ({
          ...currList,
          issues: [newIssue].concat(currList.issues)
        }))
      }
    }
  }

  const submitEdit = async (toSave: Issue) => {
    if (currVal.editingIssueId === toSave.id) {
      const {data} = await updateIssue({
        variables: {
          issueId: toSave.id,
          title: toSave.title,
          body: toSave.body
        }
      })
      if (data) {
        const updated = data.updateIssue.issue
        stopEditing()
        setList((currList) => ({
          ...currList,
          issues: currList.issues.map(i => i.id === updated.id ? updated : i)
        }))
      }
    }
  }

  return {
    ...currVal,
    createSubmitting: createResponse.loading,
    updateSubmitting: updateResponse.loading,
    errorInCreate: createResponse.error,
    errorInUpdate: updateResponse.error,
    startEdit,
    submitEdit,
    startCreate,
    submitCreate,
    cancel: stopEditing
  }
}




