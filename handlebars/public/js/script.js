const applyBtn = document.querySelectorAll(".coupon_apply_btn");
const popupDiv = document.querySelector(".coupon_popup");
const setPopup = () => {
  console.log("script called");
  popupDiv.classList.toggle("toggle_popup");
};
const fetchCoupons = async (e) => {
  const categoryname = e.target.dataset.id;
  const response = await fetch(`/coupons/fetchcoupons/${categoryname}`);
  console.log(response);
};
applyBtn?.forEach((btn) => {
  addEventListener("click", fetchCoupons);
});
