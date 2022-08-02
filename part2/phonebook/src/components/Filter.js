const Filter = ({filter, filterChange})=>{
    return (
      <div style={{height: 50}}>filter shown with: 
          <input value={filter} onChange={filterChange}/>
        </div>
    );
  }

export default Filter;