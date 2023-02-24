const form = document.querySelector('form')
const Email=  document.getElementById('email')
const password = document.getElementById('password')
const errorElement = document.getElementById('alert')

const EmailRegex =  /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
// const PasswordRegex =  /^(?=.[A-Za-z])(?=.\d)(?=.[@$!%#?&])[A-Za-z\d@$!%*#?&]{8,}$/

function hideErrorMessage(){
    errorElement.innerHTML = ""
}
function showErrorMessage(message) {
    errorElement.innerHTML = `<div  class="alert alert-danger" role="alert">${message} </div>`
  
}
form.onsubmit=()=> {
   
    
    if( Email.value === "" && password.value === ""   ){
        showErrorMessage("Invalid submission")
        return false;
    }
   
     if(Email.value === ""){
        showErrorMessage("Email is required")
    }

    else if(!Email.value.match(EmailRegex)){
        showErrorMessage("Enter a valid email")
        return false;
    }
    else if(password.value === "" ){
        showErrorMessage("Password is Required")
        return false;
    }
  
    else if (password.value.length < 6) {
        showErrorMessage("Password must be longer than 6 characters ")
        return false;
    }
    else if (password.value.length > 14) {
        showErrorMessage("Password must be less than 10 characters")
        return false;
    }
    else if (password.value === "password") {
        showErrorMessage("password cannot be password")
        return false;
    }
   

    
    hideErrorMessage()
    return true;
    
}