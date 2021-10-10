import {ApolloError} from "@apollo/client";
import * as React from "react";

export type OnErrorProps = {
  error: ApolloError
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ErrorDisplay = (props: OnErrorProps) =>
    <p style={{color: 'red'}}>{props.error.message}</p>

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const Loading = () =>
    <p>Loading ...</p>

type LoadingWrapperProps = {
  loading: boolean
  error?: ApolloError
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
