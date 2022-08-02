import Person from './Person'
const Persons = ({persons, filter, handleDelete})=>{
    return (
      <div>
        {persons.filter(p=>p.name.toLowerCase().includes(filter.toLocaleLowerCase()))
          .map(person=><Person key={person.id} name={person.name} number={person.number} id={person.id} handleDelete={handleDelete}/>)}
          
      </div>
    )
  
  }

export default Persons;