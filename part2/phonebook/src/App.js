import { useState, useEffect } from 'react'
import personService from './services/persons';
import Filter from './components/Filter'
import Notification from './components/Notification';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [ phoneNumber, setPhoneNumber ] = useState('') 
  const [ filter, setFilter ] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null);

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

  const showNotification = (message) =>{
    setNotificationMessage( message )
    setTimeout(() => {
      setNotificationMessage(null)
    }, 3000);
  }
  
  const addPerson = (event) =>{
    event.preventDefault();
    let newPerson = {name: newName, number: phoneNumber}
    if(persons.findIndex(p=>p.name.toLocaleLowerCase() === newName.toLocaleLowerCase()) > -1){
      if (window.confirm(`${newName} is already added to phonebook. replace the old number with a new one?`)) {
        var personToUpdate = persons.find(p => p.name.toLocaleLowerCase() === newName.toLocaleLowerCase()); 
        if(!personToUpdate) throw new Error('person not found');

        personService.update(personToUpdate.id, {...personToUpdate, number: phoneNumber})
          .then(returnedPerson => {
            showNotification(`Updated '${returnedPerson.name}'`);
              setPersons(persons.map(person => personToUpdate.id !== person.id ? person : returnedPerson));
              setNewName('')
              setPhoneNumber('') 
          })
          .catch(err =>{
            const msg = `Information of ${personToUpdate.name} has already been removed from server`;
            showNotification(msg);
            setPersons(persons.filter(p => p.id !== personToUpdate.id));
          });
      }
    }
    else{
      personService.create(newPerson)
        .then(returnedPerson =>{
          showNotification(`Added '${returnedPerson.name}'`)
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
          showNotification(`deleted '${person.name}'`);
          setPersons(persons.filter(person => person.id !== id));
        });
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
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