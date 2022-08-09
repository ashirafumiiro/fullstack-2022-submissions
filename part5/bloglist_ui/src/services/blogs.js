import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
  }

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const config = {
      headers: { Authorization: token },
    }
  
  const request = axios.post(baseUrl, newObject, config);
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then(response => response.data);
}

const deleteBlog = (id) =>{
  const config = {
    headers: { Authorization: token },
  }
  const url = `${baseUrl}/${id}`;
  const request = axios.delete(url, config);
  return request.then(response => response);
}

const blogsService = { getAll, setToken , create, update, deleteBlog};

export default blogsService