import React from "react";
import {Repository} from "../../model/repository";

export type RepositoryDetailProps = {
  repository: Repository
}

export const RepositoryDetail: React.FC<RepositoryDetailProps> = (props) => {
  const {repository} = props
  return <>
    <h2>Repository</h2>
    <div>id: {repository.id}</div>
    <div>name: {repository.name}</div>
    <div>url: <a href={repository.url} target="_blank">{repository.url}</a></div>
  </>
}
