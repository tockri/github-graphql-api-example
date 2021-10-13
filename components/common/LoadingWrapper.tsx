import * as React from "react";
import {Alert, CircularProgress, Stack} from "@mui/material";

export type ErrorDisplayProps = {
  readonly error: Error
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = (props: ErrorDisplayProps) =>
    <Alert severity="error">{props.error.message}</Alert>

export const Loading: React.FC = () =>
    <Stack alignItems="center">
      <CircularProgress sx={{marginX: "auto", marginTop: 3}}/>
    </Stack>

export type LoadingWrapperProps = {
  readonly loading: boolean
  readonly error?: Error
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = (props) => {
  const {loading, error, children} = props
  if (loading)
    return <Loading/>
  else if (error)
    return <ErrorDisplay error={error}/>
  else
    return <>{children}</>
}
