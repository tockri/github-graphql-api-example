export type Repository = {
  readonly id: string
  readonly name: string
  readonly url: string
  readonly description: string
  readonly viewerHasStarred: boolean
  readonly stargazers: {
    readonly totalCount: number
  }
}
