

const Header = (props) =>{
    return(
      <h1>{props.course}</h1>
    )
  }
  
  const Part = (props) =>{
    return (
      <p>
          {props.name} {props.exercises}
      </p>
    )
  }
  
  const Content = ({parts}) =>{
    return (
      <div>
        {parts.map(part =>
          <Part key={part.id} name={part.name} exercises={part.exercises} />
          )}
      
      </div>
    )
  }
  
  const Total = (props) =>{
    return (
      <p><strong> total of {props.parts.reduce((prev, curr) => prev + curr.exercises, 0)} exercises</strong> </p>
    )
  }
  
  
  const Course = ({course}) =>{
    return (
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total  parts={course.parts} />
      </div>
    )
  }

export default Course