var name=document.getElementById('name')
var errors = document.getElementById('errors')
var sign = document.getElementById('sign')
sign.addEventListener('submit',save)
async function save(event)
{
    event.preventDefault()
    var name = event.target.name.value
    var email = event.target.email.value
    var pass = event.target.password.value
    if(!email || !name || !pass){
    errors.innerHTML="Fields cannot be empty"
    return;
    }
    var object={
        name,
        email,
        pass
    }
    try{
        const response = await axios.post('http://localhost:3000/signup',object)
        console.log(response)
        window.location.href="../layout/login.html"
    }
    catch(err){
        alert(err.response.data.error)
       
    }
}