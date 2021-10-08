import type {NextPage} from 'next'

import * as React from 'react';
import {
  RepositoryWithIssues,
  useRepositoryWithIssuesQuery
} from "../../../graphql/repositoryWithIssues";
import {DataProps, onLoaded} from "../../../components/QueryHelper";
import {useRouter} from "next/router";
import Link from 'next/link';

const Repository = (props: DataProps<RepositoryWithIssues>) => {
  const repository = props.data.node
  return <>
    <div>
      <Link href={'../..'}>Home</Link>
    </div>
    <h2>Repository</h2>
    <div>id: {repository.id}</div>
    <div>name: {repository.name}</div>
    <h3>Issues</h3>
  </>
}

const RepositoryPage: NextPage = (props) => {
  const router = useRouter()
  const repositoryId = router.query.id as string
  const {loading, error, data, refetch, fetchMore} = useRepositoryWithIssuesQuery({
    repositoryId,
    limit: 3
  })
  return onLoaded(Repository)(loading, error, data)
}

export default RepositoryPage
