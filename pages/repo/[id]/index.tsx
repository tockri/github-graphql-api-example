import type {NextPage} from 'next'

import * as React from 'react';
import {useRouter} from "next/router";
import {useRecoilState, useRecoilValue} from "recoil";
import {
  issueListState,
  issuesResponseState, mergeIssuesResponseState,
  selectedRepositoryIdState,
  selectedRepositoryState
} from "../../../recoil/states";
import {RepositoryItem} from "../../../components/repository/RepositoryItem";
import {PageRoot} from '../../../components/layout/PageRoot';
import Box, {BoxProps} from "@mui/material/Box";
import {Breadcrumbs, Button} from "@mui/material";
import {useIssuesInRepositoryQuery} from "../../../graphql/issues";
import {LoadingWrapper} from "../../../components/QueryHelper";
import {IssueItem} from "../../../components/issue/IssueItem";
import {SxProps} from "@mui/system";
import {node} from "prop-types";
import {emptyPageInfo} from "../../../graphql";
import {useApolloClient} from "@apollo/client";

type IssueListProps = {
  repositoryId: string
}

const issueListItemStyle: SxProps = {
  marginBottom: 2
}

const IssueList: React.FC<IssueListProps> = (props) => {
  const {repositoryId} = props
  const [resp, setResponse] = useRecoilState(issuesResponseState)
  const {loading, error, fetchMoreIssues} = useIssuesInRepositoryQuery({repositoryId: repositoryId, limit: 3, cursor: null}, {
    onCompleted: setResponse
  })
  const client = useApolloClient()
  const issueList = useRecoilValue(issueListState(client))
  const onclick = () => {
    fetchMoreIssues((newResponse) => {
      setResponse((currVal) => mergeIssuesResponseState(currVal, newResponse))
    })
  }

  return <LoadingWrapper loading={loading} error={error}>
    <Box sx={{marginTop: 2}}>
      {issueList.issues.map(issue =>
        <Box sx={issueListItemStyle} key={issue.id}>
          <IssueItem issue={issue}/>
        </Box>
      )}
      {issueList.pageInfo.hasNextPage
        ? <Button onClick={onclick}>more</Button>
        : null
      }

    </Box>
  </LoadingWrapper>

}

const homeLinkSx: SxProps = {
  color: 'primary.main',
  cursor: 'pointer'
}

const HomeLink: React.FC<BoxProps> = (props) =>
    <Box {...props} sx={homeLinkSx}>{props.children}</Box>

const RepositoryPage: NextPage = () => {
  const router = useRouter()
  const repositoryId = router.query.id as string
  const selected = useRecoilValue(selectedRepositoryState)
  const [selectedId, setSelectedId] = useRecoilState(selectedRepositoryIdState)
  const goHome = () => {
    setSelectedId('')
    router.push("../..")
  }

  return <PageRoot>
    <Breadcrumbs sx={{marginBottom: 2}}>
      <HomeLink onClick={goHome} sx={homeLinkSx}>Home</HomeLink>
      {selected.selected
          ? <Box>Repository {selected.selected.name}</Box>
          : null}
    </Breadcrumbs>
    {selected.selected && selected.selected.id === repositoryId
        ? <>
          <RepositoryItem repository={selected.selected}/>
          <IssueList repositoryId={selectedId}/>
        </>
        : <p>ごめんなさい！実装サボってます！Homeから戻ってください。</p>}
  </PageRoot>
}

export default RepositoryPage
