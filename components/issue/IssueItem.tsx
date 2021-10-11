import {Issue} from "../../model/issue";
import React from "react";
import Box from "@mui/material/Box";
import {SxProps} from "@mui/system";
import ReactMarkdown from "react-markdown";
import {styled} from "@mui/material/styles";
import {Grid} from "@mui/material";

export type IssueItemParam = {
  issue: Issue
}

const issueItemBoxStyle: SxProps = {
  borderRadius: 1,
  background: '#e0e0c0',
  padding: 0,
}

const titleBoxStyle: SxProps = {
  borderBottomStyle: 'solid',
  borderBottomColor: '#c0c0a0',
  borderBottomWidth: '1px',
  paddingTop: 2,
  paddingBottom: 1,
}

const titleStyle: SxProps = {
  paddingLeft: 2,
  fontSize: "large"
}

const githubIconStyle: SxProps = {
  width: 24,
  height: 24,
  cursor: 'pointer',
  padding: 0,
  margin: 0,
}

const BodyBox = styled(ReactMarkdown)`
  font-size: 1em !important;
  padding: 2em;
  h1,h2,h3,h4 {
    font-size: 1.2em !important;
  }
`

export const IssueItem: React.FC<IssueItemParam> = (props) => {
  const {issue} = props
  return <Box sx={issueItemBoxStyle}>
    <Grid container sx={titleBoxStyle}>
      <Grid item xs={11}>
        <Box sx={titleStyle}>{issue.title}</Box>
      </Grid>
      <Grid item xs={1}>
        <Box component="a" href={issue.url} target="_blank" rel="noreferrer">
          <Box component="img" src='/favicon.png' alt="" sx={githubIconStyle}/>
        </Box>
      </Grid>
    </Grid>
    <BodyBox>{issue.body}</BodyBox>
  </Box>
}
