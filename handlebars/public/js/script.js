const setPopup = (data, popupDiv, selectElement) => {
  data.coupons.forEach((coupon) => {
    const optionElement = document.createElement("option");
    optionElement.value = coupon.id;
    optionElement.textContent = coupon.Name;
    selectElement.appendChild(optionElement);
  });
  popupDiv.classList.toggle("toggle_popup");
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
  const popupDiv = document.querySelector(`.coupon_popup[data-key="${id}"]`);

  const response = await fetch(`/users/fetchcoupons/${categoryId}`);
  const data = await response.json();
  setPopup(data, popupDiv, selectElement);
};

const changeQuantity = async (action) => {
  const bookId = event.target.dataset.id;
  const quantityElement = document.querySelector(
    `.quantity[data-id="${bookId}"]`
  );
  const response = await fetch(`/users/cart/add/${bookId}/${action}`);
  const data = await response.json();
  const reqBookFromCart = data.filter((book) => book.id == bookId);
  console.log(reqBookFromCart);
};
