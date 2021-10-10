import type {NextPage} from 'next'
import Link from 'next/link'
import * as React from 'react';
import {RepositoriesResponse, useRepositoriesQuery} from "../graphql/repositories";
import {DataProps, onLoaded} from "../components/QueryHelper";
import Box from "@mui/material/Box";
import {RepositoryItem} from "../components/repository/RepositoryItem";
import {PageRoot} from "../components/layout/PageRoot";
import {atom} from "recoil";


const RepoList: React.FC<DataProps<RepositoriesResponse>> = (props) => {
  const repositories = props.data.viewer.repositories.nodes

  return <PageRoot>
    <Box>
      {repositories.map((repo) =>
          <RepositoryItem key={repo.id} repository={repo} clickable={true} />
      )}
    </Box>
  </PageRoot>
}

const IndexPage: NextPage = () => {
  const {loading, error, data} = useRepositoriesQuery()
  return onLoaded(RepoList)(loading, error, data)
}

export default IndexPage
