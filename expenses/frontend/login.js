//import axios from './axios'

var name=document.getElementById('name')
let logins= document.getElementById('logins')
//var error = document.getElementById('error')
logins.addEventListener('submit',save)
async function save(event)
{
    event.preventDefault()
    var email = event.target.email.value
    var pass = event.target.password.value
    var object={
        email,
        pass
    }
    if(!email || !pass){
      error.innerHTML="Fields cannot be empty"
      return;
      }
    //console.log(object)
    try {
        const response = await axios.post('http://localhost:3000/login', object);
        console.log(response);
        const tokens = response.data.token
        const premium = response.data.premium
         
         console.log(tokens)
        
         localStorage.setItem('token', tokens);
         localStorage.setItem('prime',premium)
      alert(response.data.message)
       window.location.href='../layout/expense.html'
      }
    catch(err){
      console.log(err)
      alert( err.response.data);
    }
}