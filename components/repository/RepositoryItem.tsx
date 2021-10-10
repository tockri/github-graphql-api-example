import {Repository} from "../../model/repository";
import React from "react";
import Box from '@mui/material/Box'
import {SxProps} from "@mui/system";

export type RepositoryItemProps = {
  repository: Repository,
  clickable: boolean
}

const RootSx = (props:RepositoryItemProps): SxProps => ({
  bgcolor: 'text.secondary',
  color: 'background.paper',
  marginX: 0,
  marginY: 2,
  padding: 2,
  borderRadius: 1,
  cursor: props.clickable ? 'pointer' : 'inherit'
})

export const RepositoryItem: React.FC<RepositoryItemProps> = (props) => {
  const {repository} = props
  const onClick = () => {
    alert('onClick')
  }
  return <Box sx={RootSx(props)} onClick={props.clickable ? onClick : undefined}>
    {repository.name}
  </Box>
}
