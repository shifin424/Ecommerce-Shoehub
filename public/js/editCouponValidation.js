// const forms = document.querySelector('#myForm');
// const Coupon = document.getElementById('CouponNames');
// const Discount = document.getElementById('Discount');
// const maxLimits = document.getElementById('Maxlimit');
// const dates = document.getElementById('Exdate');
// const ErrorElement = document.getElementById('alerts');

// function hideErrorMessages() {
//   ErrorElement.innerHTML = "";
// }

// function showErrorMessages(message) {
//   ErrorElement.innerHTML = `<div class="alert alert-danger" role="alert">${message} </div>`;
// }

// forms.onsubmit = (event) => {
//   event.preventDefault();
//   if (Coupon.value === '' || Discount.value === '' || maxLimits.value === '' || dates.value === '') {
//     showErrorMessages('Fill the form');
//     return false;
//   }

//   if (Coupon.value === '') {
//     showErrorMessages('Coupon code is required');
//     return false;
//   }

//   if (Discount.value === '') {
//     showErrorMessages('Discount is required');
//     return false;
//   }

//   if (maxLimits.value === '') {
//     showErrorMessages('Maximum limit is required');
//     return false;
//   }

//   if (dates.value === '') {
//     showErrorMessages('Expiration date is required');
//     return false;
//   } else {
//     const currentDate = new Date();
//     const expirationDate = new Date(dates.value);
//     if (currentDate >= expirationDate) {
//       showErrorMessages('Expiration date must be in the future');
//       return false;
//     }
//   }

//   hideErrorMessages();
//   return true;
// }
