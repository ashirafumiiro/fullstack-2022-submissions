import { useState, useEffect } from 'react'
import personService from './services/persons';

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

const Person = ({id, name, number, handleDelete}) => <div>{name} {number} <button onClick={() => handleDelete(id)}>delete</button></div>


const Persons = ({persons, filter, handleDelete})=>{
  return (
    <div>
      {persons.filter(p=>p.name.toLowerCase().includes(filter.toLocaleLowerCase()))
        .map(person=><Person key={person.id} name={person.name} number={person.number} id={person.id} handleDelete={handleDelete}/>)}
        
    </div>
  )

}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [ phoneNumber, setPhoneNumber ] = useState('') 
  const [ filter, setFilter ] = useState('');

  useEffect(() => {
    personService
      .getAll()
      .then(returnedPersons => {
        console.log('retrieved data:', returnedPersons)
        setPersons(returnedPersons)
      })
  }, [])
  
  const handleNameChange = (event) =>{
    setNewName(event.target.value);
  }

  const handlePhoneChange = (event) =>{
    setPhoneNumber(event.target.value)
  }
  
  const addPerson = (event) =>{
    event.preventDefault();
    let newPerson = {name: newName, number: phoneNumber}
    if(persons.findIndex(p=>p.name.toLocaleLowerCase() === newName.toLocaleLowerCase()) > -1){
      if (window.confirm(`${newName} is already added to phonebook. replace the old number with a new one?`)) {
        var personToUpdate = persons.find(p => p.name.toLocaleLowerCase() === newName.toLocaleLowerCase()); 
        if(!personToUpdate) throw new Error('person not found');

        personService.update(personToUpdate.id, {...personToUpdate, number: phoneNumber})
          .then(returnedNote => {
              setPersons(persons.map(person => personToUpdate.id !== person.id ? person : returnedNote)) 
          });
      }
    }
    else{
      personService.create(newPerson)
        .then(returnedPerson =>{
          setPersons(persons.concat(returnedPerson));
          setNewName('')
          setPhoneNumber('')
        })
    }
  }

  const deletePerson = (id) =>{
    const person = persons.filter(p => p.id === id)[0];
    if (window.confirm(`Delete ${person.name}?`)) {
      
      personService.deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        });
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
      <Persons persons={persons} filter={filter} handleDelete={deletePerson} />
    </div>
  )
}

export default App