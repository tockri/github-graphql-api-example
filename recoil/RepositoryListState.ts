import {Repository} from "../model/repository";
import {atom, useRecoilState} from "recoil";
import {useQuery} from "@apollo/client";
import {repositoriesQuery, RepositoriesResponse} from "../graphql/repositories";

const repositoryListState = atom<Repository[]>({
  key: 'repositoryListState',
  default: []
})

export type RepositoryListStateUse = {
  readonly loading: boolean
  readonly error?: Error
  readonly repositories: Repository[]
}

export const useRepositoryListState = (): RepositoryListStateUse => {
  const [currVal, set] = useRecoilState(repositoryListState)

  const {loading, error} = useQuery<RepositoriesResponse>(repositoriesQuery, {
    onCompleted: (data) => {
      set(data.viewer.repositories.nodes)
    }
  })

  return {
    loading,
    error,
    repositories: currVal
  }
}
