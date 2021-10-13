import {Repository} from "../../model/repository";
import React from "react";
import Box from '@mui/material/Box'
import {SxProps} from "@mui/system";
import {Grid, IconButton} from "@mui/material";

export type RepositoryItemProps = {
  readonly repository: Repository,
  readonly onSelect?: (repositoryId: string) => void
}

const rootStyle = (props: RepositoryItemProps): SxProps => ({
  bgcolor: 'text.secondary',
  color: 'white',
  borderRadius: 1,
  cursor: props.onSelect ? 'pointer' : 'inherit'
})

const nameRowStyle: SxProps = {
  padding: 2,
  borderBottomStyle: "solid",
  borderBottomColor: 'white',
  borderBottomWidth: '1px',
  alignItems: 'center'
}

const nameStyle: SxProps = {
  fontSize: "larger"
}

const descriptionStyle: SxProps = {
  color: '#e0e0e0',
  fontSize: 'smaller',
  padding: 2
}

const buttonsBoxStyle: SxProps = {
  textAlign: "right",
}

const githubIconStyle: SxProps = {
  width: 24,
  height: 24,
  cursor: 'pointer',
  padding: 0,
  margin: 0,
}

export const RepositoryItem: React.FC<RepositoryItemProps> = (props) => {
  const {repository, onSelect} = props
  const onClick = onSelect ? () => {
    onSelect(repository.id)
  } : undefined
  return <Grid sx={rootStyle(props)} onClick={onClick}>
    <Grid container sx={nameRowStyle}>
      <Grid item xs={11}>
        <Box sx={nameStyle}>
          {repository.name}
        </Box>
      </Grid>
      <Grid item xs={1} sx={buttonsBoxStyle}>
        <IconButton size="small" component="a" href={repository.url} target="_blank" rel="noreferrer" title="Go to github">
          <Box component="img" src='/favicon.png' alt="" sx={githubIconStyle}/>
        </IconButton>
      </Grid>
    </Grid>
    <Box sx={descriptionStyle}>
      {repository.description}
    </Box>
  </Grid>
}
