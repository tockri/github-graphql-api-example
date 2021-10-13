import {emptyIssue, Issue} from "../../model/issue";
import React, {useState} from "react";
import Box from "@mui/material/Box";
import {Alert, FormControl, Stack, TextField} from "@mui/material";
import {SxProps} from "@mui/system";
import LoadingButton from '@mui/lab/LoadingButton';
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
import {ApolloError} from "@apollo/client";

const editorStyle: SxProps = {
  bgcolor: '#e0e0e0',
  padding: 2,
  borderRadius: 1,
  marginBottom: 2,
}

export type IssueEditorProps = {
  issue?: Issue
  loading: boolean
  error?: ApolloError | string
  onCancel: () => void
  onSubmit: (issue: Issue) => void
}

export const IssueEditor: React.FC<IssueEditorProps> = (props) => {
  const {onCancel, onSubmit, loading, error} = props
  const issue = props.issue || emptyIssue
  const [title, setTitle] = useState(issue.title)
  const [body, setBody] = useState(issue.body)
  const submittable = title !== "" && body !== "" && !loading

  return <FormControl fullWidth={true}>
    <Stack spacing={2} sx={editorStyle}>
      <Box>
        <TextField label="Title" fullWidth={true} size="small" variant="outlined" value={title} disabled={loading}
                   onChange={e => setTitle(e.target.value)}/>
      </Box>
      <Box>
        <TextField label="Body" multiline={true} fullWidth={true} minRows={5} maxRows={10} size="small"
                   variant="outlined"
                   value={body} disabled={loading} onChange={e => setBody(e.target.value)}/>
      </Box>
      {error
          ? <Alert severity="error">{`$error`}</Alert>
          : null}
      <Stack spacing={2} direction="row" justifyContent="center">
        <LoadingButton
            loading={loading}
            variant="outlined"
            color="secondary"
            startIcon={<CancelIcon/>}
            onClick={onCancel}
        >Cancel</LoadingButton>
        <LoadingButton
            disabled={!submittable}
            loading={loading}
            variant="contained"
            color="primary"
            startIcon={<SendIcon/>}
            onClick={() => onSubmit({
              ...issue,
              title,
              body
            })}
        >Submit
        </LoadingButton>
      </Stack>
    </Stack>
  </FormControl>
}
