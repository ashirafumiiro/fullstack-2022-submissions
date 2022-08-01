import { useState } from 'react'

const Filter = ({filter, filterChange})=>{
  return (
    <div style={{height: 50}}>filter shown with: 
        <input value={filter} onChange={filterChange}/>
      </div>
  );
}

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

const Person = ({name, number}) => <div>{name} {number}</div>


const Persons = ({persons, filter})=>{
  return (
    <div>
      {persons.filter(p=>p.name.toLowerCase().includes(filter.toLocaleLowerCase()))
        .map(person=><Person key={person.name} name={person.name} number={person.number}/>)}
    </div>
  )

}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [ phoneNumber, setPhoneNumber ] = useState('') 
  const [ filter, setFilter ] = useState('');
  
  const handleNameChange = (event) =>{
    setNewName(event.target.value);
  }

  const handlePhoneChange = (event) =>{
    setPhoneNumber(event.target.value)
  }
  
  const addPerson = (event) =>{
    event.preventDefault();
    let newPerson = {name: newName, number: phoneNumber}
    if(persons.findIndex(p=>p.name === newName) > -1)
      alert(`${newName} is already added to phonebook`);
    else{
      setPersons(persons.concat(newPerson));
      setNewName('')
      setPhoneNumber('')
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} filterChange={(e) => setFilter(e.target.value)}/>
      <h2>add new</h2>
      <PersonForm
        handleSubmit={addPerson} 
        newName={newName} 
        nameChange={handleNameChange}
        phoneNumber={phoneNumber} 
        phoneNumberChange={handlePhoneChange}
        />

      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} />
    </div>
  )
}

export default App