import {Repository} from "../../model/repository";
import React from "react";
import Box from '@mui/material/Box'
import {SxProps} from "@mui/system";

export type RepositoryItemProps = {
  repository: Repository,
  onSelect?: (repositoryId:string) => void
}

const RootSx = (props:RepositoryItemProps): SxProps => ({
  bgcolor: 'text.secondary',
  color: 'background.paper',
  padding: 2,
  borderRadius: 1,
  cursor: props.onSelect ? 'pointer' : 'inherit'
})

export const RepositoryItem: React.FC<RepositoryItemProps> = (props) => {
  const {repository, onSelect} = props
  const onClick = onSelect ? () => {
    onSelect(repository.id)
  } : undefined
  return <Box sx={RootSx(props)} onClick={onClick}>
    {repository.name}
  </Box>
}
