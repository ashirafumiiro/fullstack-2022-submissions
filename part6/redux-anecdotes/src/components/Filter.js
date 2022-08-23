import { filterChange } from '../reducers/filterReducer'
import {connect} from 'react-redux'

const Filter = (props) => {

    const handleChange = (event) => {
      const text =  event.target.value
      props.filterChange(text)
    }
    const style = {
      marginBottom: 10
    }
  
    return (
      <div style={style}>
        filter <input onChange={handleChange} />
      </div>
    )
  }
  
  const ConnectedFilter = connect(null, {filterChange})(Filter)
  export default ConnectedFilter