const productId = 1;
const serverUrl = process.env.VITE_API_URL;
const review = { text: "", rating: 1, productId };

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

async function getProduct(id) {
  const res = await fetch(`${serverUrl}/products/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const product = await res.json();
  renderProductPage(product);
}

async function createReview(event) {
  event.preventDefault();
  review.text = document.getElementById("input-text-review").value;
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
  getProduct(productReview.product.id)
}

function renderProductPage(product) {
  document.getElementById("product-title").innerHTML = product.title;
  document.getElementById("product-rating-section").innerHTML = `<div class="product-rating">${product.rating}</div>`;

  const productRatingHtmls = renderRatingHtml(product.rating);
  for (const html of productRatingHtmls) {
    document.getElementById("product-rating-section").appendChild(html);
  }

  const reviewSectionHtml = document.getElementById("review-section");
  reviewSectionHtml.innerHTML = "";
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
  const reviewRatingHtmls = renderRatingHtml(review.rating);
  for (const html of reviewRatingHtmls) reviewsTextElement.appendChild(html);
  reviewsTextElement.innerHTML += `
      <div style="width: 16px;"></div>
      <div class="text-bold">${review.rating}</div>
      <div>, &nbsp;</div>
      <div class="review-text">${review.text}</div>
    `;
  return reviewsTextElement;
}

function addRatingReview(rating) {
  review.rating = rating;
  const starHtmls = document.getElementById("input-rating").getElementsByClassName("star");
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

function resetForm() {
  review.text = "";
  review.rating = 1;
  document.getElementById("input-text-review").value = "";
  addRatingReview(review.rating);
}

window.addRatingReview = addRatingReview;
