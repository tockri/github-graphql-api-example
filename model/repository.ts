export type RepositorySummary = {
  id: string
  name: string
  url: string
  viewerHasStarred: boolean
  stargazers: {
    totalCount: number
  }
}

export type Repository = {
  id: string
  name: string
  url: string
  viewerHasStarred: boolean
  stargazers: {
    totalCount: number
  }
}
