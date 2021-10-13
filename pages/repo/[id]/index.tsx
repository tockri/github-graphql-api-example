import type {NextPage} from 'next'

import * as React from 'react';
import {useEffect} from 'react';
import {useRouter} from "next/router";
import {IssueEditingUse, useIssueEditing, useIssueListState} from "../../../recoil/IssueListState";
import {RepositoryItem} from "../../../components/repository/RepositoryItem";
import {PageRoot} from '../../../components/layout/PageRoot';
import Box from "@mui/material/Box";
import {Button} from "@mui/material";
import {LoadingWrapper} from "../../../components/QueryHelper";
import {IssueItem} from "../../../components/issue/IssueItem";
import {SxProps} from "@mui/system";
import {NavList, NavListItemProps} from "../../../components/common/NavList";
import {IssueEditor} from "../../../components/issue/IssueEditor";
import {Issue} from "../../../model/issue";
import {useRepositoryState} from "../../../recoil/RepositoryListState";
import {InView} from "../../../components/common/InView";

type IssueListProps = {
  repositoryId: string
}

const issueListItemStyle: SxProps = {
  marginBottom: 2
}

const CreationArea: React.FC<IssueEditingUse> = (props) => {
  const {createSubmitting, errorInCreate, editingIssueId, startCreate, cancel, submitCreate} = props
  const buttonLabel = "Create New Issue"

  return editingIssueId === undefined
        ? <Button onClick={startCreate}>{buttonLabel}</Button>
        : editingIssueId === ""
          ? <IssueEditor onCancel={cancel} onSubmit={submitCreate} loading={createSubmitting} />
          : <Button disabled>{buttonLabel}</Button>

}

const IssueArea: React.FC<IssueEditingUse & { issue: Issue }> = (props) => {
  const {updateSubmitting, errorInUpdate, editingIssueId, startEdit, cancel, submitEdit, issue} = props

  if (editingIssueId === issue.id) {
    return <IssueEditor issue={issue} onCancel={cancel} onSubmit={submitEdit} loading={updateSubmitting} />
  } else {
    return <IssueItem issue={issue} onEditButtonClicked={startEdit}/>
  }
}

const IssueList: React.FC<IssueListProps> = (props) => {
  const {repositoryId} = props
  const {loading, error, state, fetchMore} = useIssueListState(repositoryId, 2)
  const editing = useIssueEditing(repositoryId)
  useEffect(() => {
    editing.cancel()
  }, [])

  return <LoadingWrapper loading={loading} error={error}>
    <Box sx={{marginTop: 2}}>
      <CreationArea {...editing} />
      {state.issues.map(issue =>
          <Box sx={issueListItemStyle} key={issue.id}>
            <IssueArea {...editing} issue={issue}/>
          </Box>
      )}
      {state.pageInfo.hasNextPage
          ? <InView onIntersect={fetchMore} />
          : null
      }
    </Box>
  </LoadingWrapper>
}

const RepositoryPage: NextPage = () => {
  const router = useRouter()
  const repositoryId = router.query.id as string
  const {loading, error, repository} = useRepositoryState(repositoryId)

  const navListItems: NavListItemProps[] = [{
    label: "Home",
    href: "../../",
    onClick: () => router.push("../../")
  }, {
    label: `Repository ${repository?.name}`
  }]

  return <PageRoot>
    <NavList items={navListItems}/>
    <LoadingWrapper loading={loading} error={error}>
      {repository
          ? <>
            <RepositoryItem repository={repository}/>
            <IssueList repositoryId={repository.id}/>
          </>
          : null}
    </LoadingWrapper>
  </PageRoot>
}

export default RepositoryPage
