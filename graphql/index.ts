export type PageInfo = {
  readonly startCursor: string
  readonly hasNextPage: boolean
  readonly endCursor: string | null
}

export const emptyPageInfo: PageInfo = {
  startCursor: "",
  hasNextPage: true,
  endCursor: null
}
