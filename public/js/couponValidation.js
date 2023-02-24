const form = document.querySelector('form')
const CouponName = document.getElementById('couponName')
const Discount = document.getElementById('discount')
const maxLimit = document.getElementById('maxlimit')
const date = document.getElementById('exdate')
const errorElement = document.getElementById('alert')


function hideErrorMessage(){
    errorElement.innerHTML = ""

}
function showErrorMessage(message) {
    errorElement.innerHTML = `<div  class="alert alert-danger" role="alert">${message} </div>`
   
  
}
form.onsubmit=()=> {

   
    if(CouponName.value  === ''||Discount.value  === ''|| maxLimit.value  === ''||date.value === ''){
        showErrorMessage('Fill The  Form ')
        return false;
     }


     if (CouponName.value === '' || CouponName.value.length <=0 ) {

        showErrorMessage('CouponName is required')
        return false;
      } else if (CouponName.value <= 0) {
        showErrorMessage('CouponName must be greater than 0')
        return false;
      }
    
      if (Discount.value === '' || Discount.value.length <=0 ) {

        showErrorMessage('Discount is required')
        return false;
      } else if (Discount.value <= 0) {
        showErrorMessage('Discount must be greater than 0')
        return false;
      }
    
      if (maxLimit.value === '' || maxLimit.value.length <=0 ) {
        showErrorMessage('Maximum limit is required')
        return false;
      } else if (maxLimit.value <= 0) {
        showErrorMessage('Maximum limit must be greater than 0')
        return false;
      }
    
      if (date.value === '' || date.value.length <= 0  ) {
        showErrorMessage('Expiration date is required')
        return false;
      } else {
        const currentDate = new Date()
        const expirationDate = new Date(date.value)
        if (currentDate >= expirationDate) {
            showErrorMessage('Expiration date must be in the future')
            return false;
        }
      }

   
   hideErrorMessage()
      return true;
  }
  


    
