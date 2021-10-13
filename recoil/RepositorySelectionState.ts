import {atom, useRecoilState} from "recoil";

const selectedRepositoryIdState = atom<string>({
  key: 'selectedRepositoryIdState',
  default: ""
})

export type RepositorySelectionUse = {
  readonly selectedRepositoryId: string
  readonly selectWithAnimation: (repositoryId: string) => void
}

export type RepositorySelectionOptions = {
  readonly onSelectCallback: (repositoryId: string) => Promise<void>
  readonly animationDuration: number
}

export const useRepositorySelection = (options: RepositorySelectionOptions): RepositorySelectionUse => {
  const [currVal, set] = useRecoilState(selectedRepositoryIdState)

  const selectedRepositoryId = currVal

  const selectWithAnimation = (repositoryId: string) => {
    if (currVal === "" && repositoryId) {
      set(repositoryId)
      setTimeout(() => {
        options.onSelectCallback(repositoryId).then(() => set(""))
      }, options.animationDuration)
    }
  }

  return {
    selectedRepositoryId,
    selectWithAnimation
  }

}
