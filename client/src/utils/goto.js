export default ({ history }) => href => e => {
  e.preventDefault()
  history.push(href)
}
