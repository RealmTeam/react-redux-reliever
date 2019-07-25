import {connectAdvanced} from 'react-redux'
import {shallowEqualObjects} from 'shallow-equal'

export default ({props, functions, connectOptions}) => {
  if (!props) props = (state, ownProps) => ownProps
  if (!functions) functions = () => ({})
  if (!connectOptions) connectOptions = {}
  return connectAdvanced(dispatch => {
    let prevResult = {}
    let prevProps = {}
    return (state, ownProps) => {
      const nextProps = props(state, ownProps)
      if (shallowEqualObjects(prevProps, nextProps)) return prevResult
      const nextResult = {...nextProps, ...functions(nextProps, dispatch)}
      prevResult = nextResult
      prevProps = nextProps
      return nextResult
    }
  }, {
    getDisplayName: name => `RelievedConnect(${name})`,
    methodName: 'reliever.connect',
    ...connectOptions
  })
}