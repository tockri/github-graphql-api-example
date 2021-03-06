import type {NextPage} from 'next'

import * as React from 'react';
import {useEffect} from 'react';
import {useRouter} from "next/router";
import {useIssueListState} from "../../../recoil/IssueListState";
import {RepositoryItem} from "../../../components/repository/RepositoryItem";
import {PageRoot} from '../../../components/layout/PageRoot';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {LoadingWrapper} from "../../../components/common/LoadingWrapper";
import {IssueItem} from "../../../components/issue/IssueItem";
import {SxProps} from "@mui/system";
import {NavList, NavListItemProps} from "../../../components/common/NavList";
import {IssueEditor} from "../../../components/issue/IssueEditor";
import {Issue} from "../../../model/issue";
import {useRepositoryState} from "../../../recoil/RepositoryState";
import {InView} from "../../../components/common/InView";
import {CircularProgress, Stack} from "@mui/material";
import {IssueEditingUse, useIssueEditing} from "../../../recoil/IssueEditingState";

type IssueListProps = {
  repositoryId: string
}

const issueListItemStyle: SxProps = {
  marginBottom: 2
}

const CreationArea: React.FC<IssueEditingUse> = (props) => {
  const {createSubmitting, errorInCreate, editingNew, startCreate, cancel, submitCreate} = props

  return editingNew
      ? <IssueEditor onCancel={cancel} onSubmit={submitCreate} loading={createSubmitting} error={errorInCreate}/>
      : <Button onClick={startCreate}>Create New Issue</Button>

}

const IssueArea: React.FC<IssueEditingUse & { issue: Issue }> = (props) => {
  const {updateSubmitting, errorInUpdate, editingIssueId, startEdit, cancel, submitEdit, issue} = props

  if (editingIssueId === issue.id) {
    return <IssueEditor issue={issue} onCancel={cancel} onSubmit={submitEdit} loading={updateSubmitting}
                        error={errorInUpdate}/>
  } else {
    return <IssueItem issue={issue} onEditButtonClicked={startEdit}/>
  }
}

const IssueList: React.FC<IssueListProps> = (props) => {
  const {repositoryId} = props
  const {loading, error, issues, pageInfo, fetchMore} = useIssueListState(repositoryId, 3)
  const editing = useIssueEditing(repositoryId)
  useEffect(() => {
    editing.cancel()
  }, [])

  return <LoadingWrapper loading={loading} error={error}>
    <Box sx={{marginTop: 2}}>
      <CreationArea {...editing} />
      {issues.map(issue =>
          <Box sx={issueListItemStyle} key={issue.id}>
            <IssueArea {...editing} issue={issue}/>
          </Box>
      )}
      {pageInfo.hasNextPage
          ? <InView onIntersect={fetchMore}>
            <Stack alignItems="center">
              <CircularProgress />
            </Stack>
          </InView>
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
