import {Repository} from "../../model/repository";
import React from "react";
import Box from '@mui/material/Box'
import {SxProps} from "@mui/system";

export type RepositoryItemProps = {
  repository: Repository,
  onSelect?: (repositoryId:string) => void
}

const rootStyle = (props:RepositoryItemProps): SxProps => ({
  bgcolor: 'text.secondary',
  color: 'white',
  padding: 2,
  borderRadius: 1,
  cursor: props.onSelect ? 'pointer' : 'inherit'
})

const nameStyle: SxProps = {
  fontSize: "larger"
}

const descriptionStyle: SxProps = {
  color: '#e0e0e0',
  fontSize: 'smaller',
  paddingY: 2
}


export const RepositoryItem: React.FC<RepositoryItemProps> = (props) => {
  const {repository, onSelect} = props
  const onClick = onSelect ? () => {
    onSelect(repository.id)
  } : undefined
  return <Box sx={rootStyle(props)} onClick={onClick}>
    {repository.name}
    <Box sx={descriptionStyle}>{repository.description}</Box>
  </Box>
}
