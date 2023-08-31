const password = document.getElementById('logins')
const err = document.getElementById('error')
password.addEventListener("submit",save)
async function save(event)
{
    try{
    event.preventDefault()
    var email = event.target.email.value
    console.log(email)
    const forgot = await axios.post('http://localhost:3000/forgotPassword',{email})
    console.log(forgot.data)
    if(forgot.data.success == true)
    alert("Check your email")
    else
    alert("Email Id does not matches")
    
   // const a = await axios.get('http://localhost:3000/resetpassword')
}
catch(err){
    console.log(err)
}
}

