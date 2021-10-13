import {Repository} from "../model/repository";
import {useRepositoryListState} from "./RepositoryListState";

export type RepositoryStateUse = {
  readonly loading: boolean,
  readonly error?: Error,
  readonly repository?: Repository
}

export const useRepositoryState = (repositoryId: string): RepositoryStateUse => {
  const {loading, error, repositories} = useRepositoryListState()
  const repository = repositories?.find(repo => repo.id === repositoryId)
  return {
    loading,
    error,
    repository
  }
}
