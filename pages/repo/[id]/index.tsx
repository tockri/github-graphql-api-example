import type {NextPage} from 'next'

import * as React from 'react';
import {useRouter} from "next/router";
import {useRecoilState, useRecoilValue} from "recoil";
import {selectedRepositoryIdState, selectedRepositoryState, useIssueListState} from "../../../recoil/states";
import {RepositoryItem} from "../../../components/repository/RepositoryItem";
import {PageRoot} from '../../../components/layout/PageRoot';
import Box from "@mui/material/Box";
import {Button} from "@mui/material";
import {LoadingWrapper} from "../../../components/QueryHelper";
import {IssueItem} from "../../../components/issue/IssueItem";
import {SxProps} from "@mui/system";
import {NavList, NavListItemProps} from "../../../components/common/NavList";

type IssueListProps = {
  repositoryId: string
}

const issueListItemStyle: SxProps = {
  marginBottom: 2
}

const IssueList: React.FC<IssueListProps> = (props) => {
  const {repositoryId} = props
  const {loading, error, state, fetchMore} = useIssueListState(repositoryId, 2)

  return <LoadingWrapper loading={loading} error={error}>
    <Box sx={{marginTop: 2}}>
      {state.issues.map(issue =>
          <Box sx={issueListItemStyle} key={issue.id}>
            <IssueItem issue={issue}/>
          </Box>
      )}
      {state.pageInfo.hasNextPage
          ? <Button onClick={fetchMore}>more</Button>
          : null
      }
    </Box>
  </LoadingWrapper>
}

const RepositoryPage: NextPage = () => {
  const router = useRouter()
  const repositoryId = router.query.id as string
  const selected = useRecoilValue(selectedRepositoryState)
  const [selectedId, setSelectedId] = useRecoilState(selectedRepositoryIdState)
  const navListItems: NavListItemProps[] = [{
    label: "Home",
    href: "../..",
    onClick: () => {
      setSelectedId('')
      router.push("../..")
    }
  }, {
    label: `Repository ${selected.repository?.name}`
  }]

  return <PageRoot>
    <NavList items={navListItems}/>
    {selected.repository && selected.repository.id === repositoryId
        ? <>
          <RepositoryItem repository={selected.repository}/>
          <IssueList repositoryId={selectedId}/>
        </>
        : <p>ごめんなさい！実装サボってます！Homeから戻ってください。</p>}
  </PageRoot>
}

export default RepositoryPage
