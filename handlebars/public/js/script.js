const setPopup = (popupDivs, id) => {
  Array.from(popupDivs).forEach((popupDiv) => {
    if (popupDiv.dataset.key == id) {
      popupDiv.classList.toggle("toggle_popup");
    } else {
      popupDiv.classList.remove("toggle_popup");
    }
  }); // popupDivs.classList.toggle("toggle_popup");
};
const fetchCoupons = async () => {
  const categoryId = event.target.dataset.categoryid;
  const id = event.target.dataset.id;

  const selectElement = document.querySelector(
    `.coupon_select[data-key="${id}"]`
  );

  while (selectElement.firstChild) {
    selectElement.removeChild(selectElement.firstChild);
  }
  const popupDivs = document.querySelectorAll(`.coupon_popup`);

  const response = await fetch(`/users/fetchcoupons/${categoryId}`);
  const data = await response.json();
  data.coupons.forEach((coupon) => {
    const optionElement = document.createElement("option");
    optionElement.value = coupon.id;
    optionElement.textContent = coupon.Name;
    selectElement.appendChild(optionElement);
  });
  setPopup(popupDivs, id);
};

const changeQuantity = async (action) => {
  const bookId = event.target.dataset.id;
  const dataId = event.target.dataset.id;
  const form = document.querySelector(
    `.coupon_apply_form[data-id="${bookId}"]`
  );
  selectElement = form.elements["Coupon"];
  const couponId = selectElement?.options[selectElement.selectedIndex]?.value;

  const quantityElement = document.querySelector(
    `.quantity[data-id="${bookId}"]`
  );
  const unitPriceElement = document.querySelector(
    `.unit_price[data-id="${dataId}"]`
  );
  const priceElement = document.querySelector(`.price[data-id="${dataId}"]`);
  const payableAmountElement = document.querySelector(
    `.payable_amount[data-id="${dataId}"]`
  );
  const discountElement = document.querySelector(
    `.discount[data-id="${bookId}"]`
  );

  const response = await fetch(
    `/users/cart/add/${bookId}/${couponId}/${action}`
  );
  const data = await response.json();
  console.log(data);
  const reqBookFromCart = data.cart.filter((book) => book.id == bookId);
  quantityElement.textContent = reqBookFromCart[0].quantity;
  unitPriceElement.textContent = reqBookFromCart[0].unitPrice;
  priceElement.textContent = reqBookFromCart[0].price;
  payableAmountElement.textContent = reqBookFromCart[0].payableAmount;
  discountElement.textContent =
    reqBookFromCart[0].price - reqBookFromCart[0].payableAmount;
  if (data.error?.errorMsg) {
    const errorMsgElement = document.querySelector(".error_msg_from_fetch");
    while (errorMsgElement.firstChild) {
      errorMsgElement.removeChild(errorMsgElement.firstChild);
    }
    const errorMsg = document.createElement("p");
    errorMsg.textContent = data.error?.errorMsg;
    errorMsgElement.appendChild(errorMsg);
    errorMsgElement.classList.add("show_error_msg_from_fetch");
    setTimeout(() => {
      errorMsgElement.classList.remove("show_error_msg_from_fetch");
    }, 3000);
  }
};

const removeCoupon = async () => {
  const bookId = event.target.dataset.id;
  const response = await fetch(`/users/cart/removecoupon/${bookId}`);
  const data = await response.json();
  const popupDivs = document.querySelectorAll(`.coupon_popup`);

  const quantityElement = document.querySelector(
    `.quantity[data-id="${bookId}"]`
  );
  const unitPriceElement = document.querySelector(
    `.unit_price[data-id="${bookId}"]`
  );
  const priceElement = document.querySelector(`.price[data-id="${bookId}"]`);
  const payableAmountElement = document.querySelector(
    `.payable_amount[data-id="${bookId}"]`
  );
  const discountElement = document.querySelector(
    `.discount[data-id="${bookId}"]`
  );

  if (data.success?.successMsg) {
    const successMsgElement = document.querySelector(".success_msg_from_fetch");
    while (successMsgElement.firstChild) {
      successMsgElement.removeChild(successMsgElement.firstChild);
    }
    const reqBookFromCart = data.cart.filter((book) => book.id == bookId);
    console.log(reqBookFromCart);
    quantityElement.textContent = reqBookFromCart[0].quantity;
    unitPriceElement.textContent = reqBookFromCart[0].unitPrice;
    priceElement.textContent = reqBookFromCart[0].price;
    payableAmountElement.textContent = reqBookFromCart[0].payableAmount;
    discountElement.textContent = 0;
    const successMsg = document.createElement("p");
    successMsg.textContent = data.success?.successMsg;
    successMsgElement.appendChild(successMsg);
    successMsgElement.classList.add("show_success_msg_from_fetch");
    setPopup(popupDivs, bookId);
    setTimeout(() => {
      successMsgElement.classList.remove("show_success_msg_from_fetch");
    }, 3000);
  }
  if (data.error?.errorMsg) {
    const errorMsgElement = document.querySelector(".error_msg_from_fetch");
    while (errorMsgElement.firstChild) {
      errorMsgElement.removeChild(errorMsgElement.firstChild);
    }
    const errorMsg = document.createElement("p");
    errorMsg.textContent = data.error?.errorMsg;
    errorMsgElement.appendChild(errorMsg);
    errorMsgElement.classList.add("show_error_msg_from_fetch");
    setPopup(popupDivs, bookId);
    setTimeout(() => {
      errorMsgElement.classList.remove("show_error_msg_from_fetch");
    }, 3000);
  }
};
// "/users/cart/applycoupon/{{this.id}}";

const couponApplyForm = document.querySelectorAll(`.coupon_apply_form`);

const submitForm = async (e) => {
  e.preventDefault();
  const form = e.target;
  const bookId = form.dataset.id;
  const selectElement = form.elements["Coupon"];
  const selectedOption =
    selectElement.options[selectElement.selectedIndex].value;
  const response = await fetch(`/users/cart/applycoupon/${selectedOption}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bookId }),
  });
  const data = await response.json();
  const popupDivs = document.querySelectorAll(`.coupon_popup`);

  const payableAmountElement = document.querySelector(
    `.payable_amount[data-id="${bookId}"]`
  );
  const discountElement = document.querySelector(
    `.discount[data-id="${bookId}"]`
  );

  if (data.success?.successMsg) {
    const successMsgElement = document.querySelector(".success_msg_from_fetch");
    while (successMsgElement.firstChild) {
      successMsgElement.removeChild(successMsgElement.firstChild);
    }
    const reqBookFromCart = data.cart.filter((book) => book.id == bookId);
    console.log(reqBookFromCart);
    payableAmountElement.textContent = reqBookFromCart[0].payableAmount;
    discountElement.textContent =
      reqBookFromCart[0].price - reqBookFromCart[0].payableAmount;
    const successMsg = document.createElement("p");
    successMsg.textContent = data.success?.successMsg;
    successMsgElement.appendChild(successMsg);
    successMsgElement.classList.add("show_success_msg_from_fetch");
    setPopup(popupDivs, bookId);
    setTimeout(() => {
      successMsgElement.classList.remove("show_success_msg_from_fetch");
    }, 3000);
  }
  if (data.error?.errorMsg) {
    const errorMsgElement = document.querySelector(".error_msg_from_fetch");
    while (errorMsgElement.firstChild) {
      errorMsgElement.removeChild(errorMsgElement.firstChild);
    }
    const errorMsg = document.createElement("p");
    errorMsg.textContent = data.error?.errorMsg;
    errorMsgElement.appendChild(errorMsg);
    errorMsgElement.classList.add("show_error_msg_from_fetch");
    setPopup(popupDivs, bookId);
    setTimeout(() => {
      errorMsgElement.classList.remove("show_error_msg_from_fetch");
    }, 3000);
  }
};

couponApplyForm.forEach((form) => {
  form.addEventListener("submit", submitForm);
});
