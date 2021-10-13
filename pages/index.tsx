import type {NextPage} from 'next'
import * as React from 'react';
import {LoadingWrapper} from "../components/common/LoadingWrapper";
import Box from "@mui/material/Box";
import {RepositoryItem} from "../components/repository/RepositoryItem";
import {PageRoot} from "../components/layout/PageRoot";
import {styled} from "@mui/material/styles";
import {useRouter} from "next/router";
import {useRepositoryListState} from "../recoil/RepositoryListState";
import {NavList} from "../components/common/NavList";
import {useRepositorySelection} from "../recoil/RepositorySelectionState";

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

const IndexPage: NextPage = () => {
  const {loading, error, repositories} = useRepositoryListState()
  const router = useRouter()
  const {selectedRepositoryId, selectWithAnimation} = useRepositorySelection({
    onSelectCallback: async (repositoryId) => {
      await router.push(`repo/${repositoryId}`)
    },
    animationDuration: 500
  })

  const cn = (repositoryId: string): string =>
      !selectedRepositoryId || repositoryId === selectedRepositoryId ? 'extended' : 'collapsed'

  return <PageRoot>
    <LoadingWrapper loading={loading} error={error}>
      <NavList items={[{label: "Home"}]}/>
      {repositories.map((repository) =>
          <ListItem key={repository.id} className={cn(repository.id)}>
            <RepositoryItem repository={repository} onSelect={selectWithAnimation}/>
          </ListItem>
      )}
    </LoadingWrapper>
  </PageRoot>
}

export default IndexPage
