import {Issue} from "../../model/issue";
import React from "react";
import Box from "@mui/material/Box";
import {SxProps} from "@mui/system";
import ReactMarkdown from "react-markdown";
import {styled} from "@mui/material/styles";
import {Grid, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

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
  alignItems: "center"
}

const titleStyle: SxProps = {
  paddingLeft: 2,
  fontSize: "large"
}

const buttonsBoxStyle: SxProps = {
  textAlign: "right",
  paddingRight: 2
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
  h1,h2,h3,h4 {
    font-size: 1.2em !important;
  }
  p {
    margin: 0 0 0.5em 0 !important;
    &:last-child {
      margin-bottom: 0 !important;
    }
  }
`

const bodyBoxStyle: SxProps = {
  paddingX: 2,
  paddingY: 1.5
}

export type IssueItemParam = {
  issue: Issue,
  onEditButtonClicked: (issue: Issue) => void
}

export const IssueItem: React.FC<IssueItemParam> = (props) => {
  const {issue, onEditButtonClicked} = props
  const onEditButtonClick = () => onEditButtonClicked(issue)
  return <Box sx={issueItemBoxStyle}>
    <Grid container sx={titleBoxStyle}>
      <Grid item xs={11}>
        <Box sx={titleStyle}>{issue.title}</Box>
      </Grid>
      <Grid item xs={1} sx={buttonsBoxStyle}>
        <IconButton size="small" onClick={onEditButtonClick}>
          <EditIcon/>
        </IconButton>
        <IconButton size="small" component="a" href={issue.url} target="_blank" rel="noreferrer" title="Go to github">
          <Box component="img" src='/favicon.png' alt="" sx={githubIconStyle}/>
        </IconButton>
      </Grid>
    </Grid>
    <Box sx={bodyBoxStyle}>
      <BodyBox>{issue.body}</BodyBox>
    </Box>
  </Box>
}
