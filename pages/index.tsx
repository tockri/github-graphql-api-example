import type {NextPage} from 'next'
import Link from 'next/link'
import * as React from 'react';
import {RepositoriesResponse, useRepositoriesQuery} from "../graphql/repositories";
import {DataProps, onLoaded} from "../components/QueryHelper";

const RepoList: React.FC<DataProps<RepositoriesResponse>> = (props) => {
  const repositories = props.data.viewer.repositories.nodes
  return <>
    <ul>
      {repositories.map((repo) =>
          <li key={repo.id}><Link href={`repo/${repo.id}`}>{repo.name}</Link></li>
      )}
    </ul>
  </>
}

const Issues: NextPage = () => {
  const {loading, error, data} = useRepositoriesQuery()
  return onLoaded(RepoList)(loading, error, data)
}

export default Issues
