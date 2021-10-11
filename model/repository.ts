export type Repository = {
  id: string
  name: string
  url: string
  description: string
  viewerHasStarred: boolean
  stargazers: {
    totalCount: number
  }
}
