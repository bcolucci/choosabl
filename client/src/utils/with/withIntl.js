import { translate } from 'react-i18next'

const defaultOpts = ['commons', 'langs']

export default (namespaces = []) => translate([...defaultOpts, ...namespaces])
