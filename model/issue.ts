export type Issue = {
  readonly id: string
  readonly title: string
  readonly url: string
  readonly body: string
}

export const emptyIssue = {
  id: "",
  title: "",
  url: "",
  body: ""
}
