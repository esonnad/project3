import axios from 'axios'

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api',
  withCredentials: true
})

const errHandler = err => {
  console.error(err)
  if (err.response && err.response.data) {
    console.error("API response", err.response.data)
    throw err.response.data.message
  }
  throw err
}

export default {
  service: service,

  isLoggedIn() {
    return localStorage.getItem('user') != null
  },

  signup(userInfo) {
    return service
      .post('/signup', userInfo)
      .then(res => {
        console.log("data", res.data)
        // If we have localStorage.getItem('user') saved, the application will consider we are loggedin
        localStorage.setItem('user', JSON.stringify(res.data))
        return res.data
      })
      .catch(errHandler)
  },

  login(username, password) {
    return service
      .post('/login', {
        username,
        password,
      })
      .then(res => {
        // If we have localStorage.getItem('user') saved, the application will consider we are loggedin
        localStorage.setItem('user', JSON.stringify(res.data))
        return res.data
      })
      .catch(errHandler)
  },

  logout() {
    localStorage.removeItem('user')
    return service
      .get('/logout')
  },

  getPosts() {
    return service
      .get('/posts')
      .then(res => res.data)
      .catch(errHandler)
  },

  addPost(data) {
    return service
      .post('/posts', data)
      .then(res => res.data)
      .catch(errHandler)
  },

  uploadPostPicture(file, public_id){
    const formData = new FormData()
    formData.append("picture", file)
    return service
      .post('/posts/picture', formData, public_id,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => res.data)
      .catch(errHandler)
  },

  getUser () {
    return service
      .get('/user')
      .then(res => {
        res.data
        console.log("api data", res.data)
        return res.data
      })
  
      .catch(errHandler)
  },

  verifyEmail(id){
    return service
      .get(`/user/verify/${id}`)
      .then(res => res.data)
      .catch(errHandler)
  },

  updateUsernameEmail(data){
    return service
      .post('/user', data)
      .then(res => res.data)
      .catch(errHandler)
  },

  changePassword(data){
    return service
      .post('/user/changepassword', data)
      .then(res => res.data)
      .catch(errHandler)
  },

  addPicture(file) {
    const formData = new FormData()
    formData.append("picture", file)
    return service
      .post('/user/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => res.data)
      .catch(errHandler)
  },

  getMyPosts() {
    return service
      .get('/posts/myposts')
      .then(res => res.data)
      .catch(errHandler)
  },

  getOnePost(id){
    return service
      .get(`/posts/${id}`)
      .then(res => res.data)
      .catch(errHandler)
  },

  updateOnePost(id, data){
    const formData = new FormData()
    formData.append("picture", data.picture)
    return service
      .post(`/posts/${id}`, data, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => res.data)
      .catch(errHandler)   
  },


}
