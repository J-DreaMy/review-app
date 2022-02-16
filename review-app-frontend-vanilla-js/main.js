const productId = 1;
const serverUrl = process.env.VITE_API_URL;
const review = { text: "", rating: 1, productId };
const round = (val) => Math.round(val * 10) / 10;

window.onload = async () => {
  await getProduct(productId);
};

const openModal = () => {
  const modal = document.getElementById("review-modal");
  modal.classList.add("open");
};

const closeModal = () => {
  const modal = document.getElementById("review-modal");
  modal.classList.remove("open");
  resetForm();
};

const addReviewBtn = document.querySelector("#add-review-btn");
addReviewBtn.addEventListener("click", openModal);

const modalExit = document.querySelector(".modal-exit");
modalExit.addEventListener("click", closeModal);

const reviewForm = document.querySelector("#review-form");
reviewForm.addEventListener("submit", createReview);

const inputRating = document.querySelector("#input-rating");
for (const [i, inputStar] of Object.entries(inputRating.children)) {
  const rating = Number(i) + 1;
  inputStar.addEventListener("click", () => setRatingReview(rating));
  inputStar.addEventListener("mouseenter", () => previewRatingReview(rating));
  inputStar.addEventListener("mouseleave", () => previewRatingReview());
}

async function getProduct(id) {
  try {
    const res = await fetch(`${serverUrl}/products/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const json = await res.json();
    if (res.status != 200) throw new Error(json.message);
    renderProductPage(json);
  } catch (error) {
    alert(error.message);
  }
}

async function createReview(event) {
  event.preventDefault();
  review.text = document.getElementById("input-text-review").value;
  if (!review.text) return alert("Please input your review!");

  const res = await fetch(`${serverUrl}/product-reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(review),
  });
  const productReview = await res.json();
  closeModal();
  getProduct(productReview.product.id);
}

function renderProductPage(product) {
  document.querySelector("#product-title").innerHTML = product.title;
  document.querySelector(".product-rating").innerHTML = round(product.rating);

  const productRatingHtmls = renderRatingHtml(product.rating);
  const rowStar = document.querySelector(".row-star");
  rowStar.innerHTML = "";
  for (const ratingHtml of productRatingHtmls) {
    rowStar.appendChild(ratingHtml);
  }

  const reviewSectionHtml = document.getElementById("review-section");
  reviewSectionHtml.innerHTML = `<div class="reviews-text">Reviews</div>`;
  for (const review of product.reviews) {
    reviewSectionHtml.append(renderReviewHtml(review));
  }
}

function renderRatingHtml(rating) {
  const starCount = Math.round(rating);
  const elements = [];

  for (let i = 0; i < starCount; i++) {
    const starOn = document.createElement("div");
    starOn.className = "star star-on";
    elements.push(starOn);
  }

  for (let i = 0; i < 5 - starCount; i++) {
    const starOff = document.createElement("div");
    starOff.className = "star star-off";
    elements.push(starOff);
  }

  return elements;
}

function renderReviewHtml(review) {
  const reviewsTextElement = document.createElement("div");
  reviewsTextElement.className = "row review-box";

  const rowStar = document.createElement("div");
  rowStar.className = "row row-star";
  const reviewRatingHtmls = renderRatingHtml(review.rating);
  for (const html of reviewRatingHtmls) rowStar.appendChild(html);

  reviewsTextElement.appendChild(rowStar);
  reviewsTextElement.innerHTML += `
      <div style="width: 16px;"></div>
      <div class="text-bold">${review.rating}</div>
      <div>, &nbsp;</div>
      <div class="review-text">${review.text}</div>
    `;
  return reviewsTextElement;
}

function previewRatingReview(value) {
  const starHtmls = document.getElementById("input-rating").getElementsByClassName("star");
  let rating = value || review.rating;
  for (var i = 0; i < starHtmls.length; i++) {
    if (i < rating) {
      starHtmls.item(i).classList.remove("star-off");
      starHtmls.item(i).classList.add("star-on");
    } else {
      starHtmls.item(i).classList.remove("star-on");
      starHtmls.item(i).classList.add("star-off");
    }
  }
}

function setRatingReview(rating) {
  review.rating = rating;
}

function setDefaultRatingReview() {
  const starHtmls = document.getElementById("input-rating").getElementsByClassName("star");
  for (var i = 0; i < starHtmls.length; i++) {
    if (i < review.rating) {
      starHtmls.item(i).classList.remove("star-off");
      starHtmls.item(i).classList.add("star-on");
    } else {
      starHtmls.item(i).classList.remove("star-on");
      starHtmls.item(i).classList.add("star-off");
    }
  }
}

function resetForm() {
  review.text = "";
  review.rating = 1;
  setTimeout(() => {
    setRatingReview(review.rating);
    previewRatingReview(review.rating);
    document.getElementById("input-text-review").value = "";
  }, 200);
}
