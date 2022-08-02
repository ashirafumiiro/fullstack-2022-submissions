const Person = ({id, name, number, handleDelete}) => <div>{name} {number} <button onClick={() => handleDelete(id)}>delete</button></div>
export default Person;