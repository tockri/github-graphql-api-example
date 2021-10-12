import type {NextPage} from 'next'
import * as React from 'react';
import {useEffect} from 'react';
import {LoadingWrapper} from "../components/QueryHelper";
import Box from "@mui/material/Box";
import {RepositoryItem} from "../components/repository/RepositoryItem";
import {PageRoot} from "../components/layout/PageRoot";
import {useRecoilState} from "recoil";
import {styled} from "@mui/material/styles";
import {useRouter} from "next/router";
import {RepositoryListState, selectedRepositoryIdState, useRepositoryListState} from "../recoil/states";
import {NavList} from "../components/common/NavList";

const ListItem = styled(Box)`
  transition: max-height 0.5s ease-in-out, margin-bottom 0.5s ease-in-out, opacity 0.2s ease-in-out; 
 
  overflow: hidden;
  &.extended {
    opacity: 1;
    max-height: 200px;
    margin-bottom: 1em;
  }
  &.collapsed {
    opacity: 0;
    max-height: 0;
    margin-bottom: 0;
  }
`

type RepoListProps = {
  state: RepositoryListState
}

const RepoList: React.FC<RepoListProps> = (props) => {
  const {state} = props
  const [selectedId, setSelectedId] = useRecoilState(selectedRepositoryIdState)
  const router = useRouter()
  const getClassName = (repositoryId: string):string =>
      !selectedId || repositoryId === selectedId ? 'extended' : 'collapsed'
  useEffect(() => {
    if (selectedId !== '')
      setTimeout(() => {
        router.push(`/repo/${selectedId}`)
      }, 500)
  }, [selectedId, router])

  return <Box>
    <NavList items={[{label: "Home"}]} />
    {state.items.map((item) =>
        <ListItem key={item.repository.id} className={getClassName(item.repository.id)}>
          <RepositoryItem repository={item.repository} onSelect={setSelectedId}/>
        </ListItem>
    )}
  </Box>
}

const IndexPage: NextPage = () => {
  const {loading, error, state} = useRepositoryListState()

  return <PageRoot>
    <LoadingWrapper loading={loading} error={error}>
      <RepoList state={state}/>
    </LoadingWrapper>
  </PageRoot>
}

export default IndexPage
