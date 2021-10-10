import type {NextPage} from 'next'
import * as React from 'react';
import {
  emptyRepositoriesResponse,
  RepositoriesResponse,
  useRepositoriesQuery
} from "../graphql/repositories";
import {LoadingWrapper} from "../components/QueryHelper";
import Box from "@mui/material/Box";
import {RepositoryItem} from "../components/repository/RepositoryItem";
import {PageRoot} from "../components/layout/PageRoot";
import {atom, selector, useRecoilState, useRecoilValue} from "recoil";
import {Repository} from "../model/repository";
import {styled} from "@mui/material/styles";
import {Button} from "@mui/material";
import {useEffect} from "react";
import {useRouter} from "next/router";

type RepositoryItemState = {
  repository: Repository
  visible: boolean
}

type RepoListState = {
  items: RepositoryItemState[]
  selectedId: string
}

const selectedRepositoryIdState = atom<string>({
  key: 'selectedRepositoryIdState',
  default: ''
})

const repositoriesResponseState = atom<RepositoriesResponse>({
  key: 'repositoriesResponse',
  default: emptyRepositoriesResponse
})

const repoListState = selector<RepoListState>({
  key: 'repoListState',
  get: ({get}) => {
    const resp = get(repositoriesResponseState)
    const selectedId = get(selectedRepositoryIdState)
    return {
      items: resp.viewer.repositories.nodes.map(repo => ({
        repository: repo,
        visible: !selectedId || repo.id === selectedId
      })),
      selectedId: selectedId
    }
  }
})

const ListItem = styled(Box)`
  transition: max-height 0.8s ease-in-out, margin-bottom 0.8s ease-in-out, opacity 0.4s ease-in-out; 
 
  overflow: hidden;
  &.extended {
    opacity: 1;
    max-height: 56px;
    margin-bottom: 1em;
  }
  &.collapsed {
    opacity: 0;
    max-height: 0;
    margin-bottom: 0;
  }
`

const HomeButton = styled(Button)`
  &.visible: {
    visibility: show;
  }
  &.hidden: {
    visibility: hidden;
  }
  margin-bottom: 1em;
`

const RepoList: React.FC = () => {
  const state = useRecoilValue(repoListState)
  const [selectedId, setSelectedId] = useRecoilState(selectedRepositoryIdState)
  const router = useRouter()
  useEffect(() => {
    if (selectedId !== '')
      setTimeout(() => {router.push(`/repo/${selectedId}`)}, 800)
  }, [selectedId])
  return <Box>
    {selectedId !== ''
        ? <HomeButton variant='contained'
                onClick={() => setSelectedId('')}
    >Home</HomeButton>
        : <Box sx={{marginTop: '2em'}}/>}
    {state.items.map((repo) =>
        <ListItem key={repo.repository.id} className={repo.visible ? 'extended' : 'collapsed'}>
          <RepositoryItem repository={repo.repository} onSelect={setSelectedId}/>
        </ListItem>
    )}
  </Box>
}

const IndexPage: NextPage = () => {
  const [state, setState] = useRecoilState(repositoriesResponseState)
  const {loading, error, data} = useRepositoriesQuery({
    onCompleted: setState
  })
  return <PageRoot>
    <LoadingWrapper loading={loading} error={error}>
      <RepoList/>
    </LoadingWrapper>
  </PageRoot>
}

export default IndexPage
