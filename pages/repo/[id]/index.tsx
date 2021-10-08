import type {NextPage} from 'next'

import * as React from 'react';
import {
  RepositoryWithIssuesResponse,
  useRepositoryWithIssuesQuery
} from "../../../graphql/repositoryWithIssues";
import {DataProps, onLoaded} from "../../../components/QueryHelper";
import {RepositoryDetail} from '../../../components/repository/RepositoryDetail'
import {useRouter} from "next/router";
import Link from 'next/link';
import {IssueItem} from "../../../components/issue/IssueItem";

const Repository = (props: DataProps<RepositoryWithIssuesResponse>) => {
  return <>
    <Link href="../..">Home</Link>
    <RepositoryDetail repository={props.data.node}/>
    <h3>Issues</h3>
    <ul>
      {props.data.node.issues.edges.map((n) => n.node).map((issue) =>
          <li key={issue.id}>
            <IssueItem issue={issue}/>
          </li>
      )}
    </ul>
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
