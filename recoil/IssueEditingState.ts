import {atom, useRecoilState} from "recoil";
import {Issue} from "../model/issue";
import {useMutation} from "@apollo/client";
import {createIssueMutation, CreateIssueResponse, updateIssueMutation, UpdateIssueResponse} from "../graphql/issues";
import {useIssueListEdit} from "./IssueListState";

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
  readonly errorInUpdate?: Error
  readonly updateSubmitting: boolean

  readonly startCreate: () => void
  readonly submitCreate: (toSave: Issue) => Promise<void>
  readonly createSubmitting: boolean
  readonly errorInCreate?: Error

  readonly cancel: () => void
} & IssueEditingState

export const useIssueEditing = (repositoryId: string): IssueEditingUse => {
  const {updateList, insertTopOnList} = useIssueListEdit()
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
        insertTopOnList(newIssue)
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
        updateList(updated)
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

