import { withNamespaces } from 'react-i18next'

const defaultOpts = ['commons', 'langs']

export default (namespaces = []) =>
  withNamespaces([...defaultOpts, ...namespaces])
