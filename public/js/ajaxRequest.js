function removeProduct(cartId, productId) {

  $.ajax({
    url: "/removeProduct",
    data: {
      cart: cartId,
      product: productId,
    },
    method: "post",
    success: () => {
      Swal.fire({
        title: "Product removed from cart!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(function () {
        location.reload();
      });
    },
  });
}
