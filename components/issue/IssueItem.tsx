import {IssueSummary} from "../../model/issue";
import React from "react";

export type IssueItemParam = {
  issue: IssueSummary
}

export const IssueItem: React.FC<IssueItemParam> = (props) => {
  const {issue} = props
  return <>
    <div>id: {issue.id}</div>
    <div>title: {issue.title}</div>
    <div>url: <a href={issue.url} target="_blank" rel="noreferrer">{issue.url}</a></div>
  </>
}
