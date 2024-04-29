


const baseUrl = "http://13.48.136.44:3009" 
async function register() {
    // Get input values

    alert("DRIVER");
    var contact_no = document.getElementById('contact_no').value;

    console.log("HIIIIIIII")
    // Check if user already exists
    if (localStorage.getItem(contact_no) !== null) {
        alert('Emailername already exists. Please choose a different one.');
        return;
    }

    let data = {
        name:document.getElementById('name').value,
        email:document.getElementById('email').value,
        password:document.getElementById('password').value,
        address:document.getElementById('address').value,
        contact_no:contact_no
    } 

          
    // Store user data in local storage
    localStorage.setItem(`localDriver`, JSON.stringify(data));

    fetch(`${baseUrl}/driver`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Add any other headers as needed
      },
      body: JSON.stringify(data)
  })
  .then((res)=> {return res.json()})
  .then((response)=>{
    console.log("RESPONE",response)
    window.location.href = 'driverLogin.html'
  }).catch((error)=>{
    console.log("Error",error)
  })
  
    // Redirect to login page
    
}