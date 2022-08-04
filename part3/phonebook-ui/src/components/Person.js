const Person = ({id, name, number, handleDelete}) => <div className="person">{name} {number} <button onClick={() => handleDelete(id)}>delete</button></div>
export default Person;