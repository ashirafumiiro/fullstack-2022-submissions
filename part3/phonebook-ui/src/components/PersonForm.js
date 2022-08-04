const PersonForm = (props)=>{
    return(
      <form onSubmit={props.handleSubmit}>
      <div>
        name: <input value={props.newName} onChange={props.nameChange}/>
      </div>
      <div>number: <input value={props.phoneNumber} onChange={props.phoneNumberChange}/></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
    )
  }

  export default PersonForm;