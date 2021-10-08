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

export type DataProps<A> = {
  data: A
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function onLoaded<A>(Component: React.FC<DataProps<A>>) {
  function B(loading: boolean, error?: ApolloError, data?: A) {
    if (loading)
      return <Loading/>
    else if (error)
      return <ErrorDisplay error={error}/>
    else if (data)
      return <Component data={data}/>
    else
      return <div>No data</div>
  }

  return B
}
