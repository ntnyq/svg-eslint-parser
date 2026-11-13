export interface TabOption<Name extends string = string> {
  name: Name
  title?: string
  icon?: string
  disabled?: boolean
}
