function init() {
const form = document.querySelector('myForm');
const Coupon = document.getElementById('CouponName');
const Discounts = document.getElementById('Discount');
const maxLimits = document.getElementById('Maxlimit');
const dates = document.getElementById('Exdate');
const ErrorElement = document.getElementById('alerts');

console.log(1,"reached to valiation");
function hideErrorMessage() {
  ErrorElement.innerHTML = "";
}

function showErrorMessage(message) {
  ErrorElement.innerHTML = `<div class="alert alert-danger" role="alert">${message} </div>`;
}

form.onsubmit = () => {
  console.log(2,"entered to formsubmit");
  if (Coupon.value === '' || Discounts.value === '' || maxLimits.value === '' || dates.value === '') {
    showErrorMessage('Fill The Form');
    return false;
  }

  if (Coupon.value === '' || Coupon.value.length <= 0) {
    showErrorMessage('CouponName is required');
    return false;
  } else if (Coupon.value <= 0) {
    showErrorMessage('CouponName must be greater than 0');
    return false;
  }

  if (Discounts.value === '' || Discounts.value.length <= 0) {
    showErrorMessage('Discount is required');
    return false;
  } else if (Discounts.value <= 0) {
    showErrorMessage('Discount must be greater than 0');
    return false;
  }

  if (maxLimits.value === '' || maxLimits.value.length <= 0) {
    showErrorMessage('Maximum limit is required');
    return false;
  } else if (maxLimits.value <= 0) {
    showErrorMessage('Maximum limit must be greater than 0');
    return false;
  }

  if (dates.value === '' || dates.value.length <= 0) {
    showErrorMessage('Expiration date is required');
    return false;
  } else {
    const currentDate = new Date();
    const expirationDate = new Date(dates.value);
    if (currentDate >= expirationDate) {
      showErrorMessage('Expiration date must be in the future');
      return false;
    }
  }

  hideErrorMessage();
  return true;
}
}

window.onload = init;
