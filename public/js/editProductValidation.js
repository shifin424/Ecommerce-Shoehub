const form = document.querySelector('form')
const productName = document.getElementById('product_name')
const Price = document.getElementById('price')
const Description = document.getElementById('description')
const Stock = document.getElementById('stock')
const Category = document.getElementById('category-select')
const subCategory = document.getElementById('subCategory-select')
const errorElement = document.getElementById('alert')

console.log("heloyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

function hideErrorMessage(){
    errorElement.innerHTML = ""
    console.log(1);
}
function showErrorMessage(message) {
    errorElement.innerHTML = `<div  class="alert alert-danger" role="alert">${message} </div>`
    console.log(2);
  
}
form.onsubmit=()=> {
    console.log(3,"entered here");
   
   if(productName.value  === ''||Price.value  === ''||Category.value  === ''||subCategory.value === ''||Description.value  === ''||Stock.value  === ''){
      showErrorMessage('Fill The  Form ')
      return false;
   }
    if (productName.value.length < 5 || productName.value === '' ) {
      showErrorMessage('Product name must be at least 5 characters long')
      return false;
    }

    if (Price.value.length < 0 || Price.value === '' ||Price.value <= 0) {
      showErrorMessage('Price must be a positive number')
      return false;

    }
    if (Category.value === '') {
        showErrorMessage('Category is required')
        return false;
      }
      if (subCategory.value === '') {
        showErrorMessage('Subcategory is required')
        return false;
      }
    
    
    if (Description.value.length < 30 ||Description.value === '' ) {
      showErrorMessage('Description must be at least 30 characters long')
      return false;
    }
    if (Stock.value < 0||Stock.value === '' ) {
      showErrorMessage('Stock must be a positive number')
      return false;
    }
   
   hideErrorMessage()
      return true;
  }
  


    
