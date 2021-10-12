import {Repository} from "../model/repository";
import {atom, selector, SetterOrUpdater, useRecoilState, useRecoilValue} from "recoil";
import {ApolloError, useQuery} from "@apollo/client";
import {repositoriesQuery, RepositoriesResponse} from "../graphql/repositories";

export type RepositoryItemState = {
  repository: Repository
}

export type RepositoryListState = {
  items: RepositoryItemState[]
}

const emptyRepositoryListState: RepositoryListState = {
  items: [],
}

export const selectedRepositoryIdState = atom<string>({
  key: 'selectedRepositoryIdState',
  default: ''
})

const repositoryListState = atom<RepositoryListState>({
  key: 'repositoryListState',
  default: emptyRepositoryListState
})

export type RepositoryListStateUse = {
  loading: boolean
  error?: ApolloError
  state: RepositoryListState
  set: SetterOrUpdater<RepositoryListState>
}

const convertRepositoriesResponse = (data: RepositoriesResponse): RepositoryListState =>
    ({
      items: data.viewer.repositories.nodes.map(repo => ({
        repository: repo
      }))
    })

export const useRepositoryListState = (): RepositoryListStateUse => {
  const [currVal, set] = useRecoilState(repositoryListState)

  const {loading, error} = useQuery(repositoriesQuery, {
    onCompleted: (data) => {
      const nextVal = convertRepositoriesResponse(data)
      set(nextVal)
    }
  })

  return {
    loading,
    error,
    state: currVal,
    set
  }
}

export type RepositoryStateUse = {
  loading: boolean,
  error?: ApolloError,
  repository?: Repository
}

export const useRepositoryState = (repositoryId: string): RepositoryStateUse => {
  const {loading, error, state} = useRepositoryListState()
  const repository = state?.items.find(repo => repo.repository.id === repositoryId)?.repository
  return {
    loading,
    error,
    repository
  }
}
