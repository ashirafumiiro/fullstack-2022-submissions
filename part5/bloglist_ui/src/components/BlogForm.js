const BlogForm = (props)=>{
    return(
      <form onSubmit={props.handleSubmit}>
      <div>
        title: <input value={props.newTitle} onChange={props.titleChange}/>
      </div>
      <div>author: <input value={props.author} onChange={props.authorChange}/></div>
      <div>url: <input value={props.url} onChange={props.urlChange}/></div>
      <div>
        <button type="submit">create</button>
      </div>
    </form>
    )
  }

  export default BlogForm;