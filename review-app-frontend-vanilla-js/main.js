const productId = 1;
onMounted();

async function onMounted() {
  const product = await getProduct(productId);
  renderProductPage(product);
}

let modals = document.querySelectorAll("[data-modal]");
modals.forEach(function (trigger) {
  trigger.addEventListener("click", function (event) {
    event.preventDefault();
    let modal = document.getElementById(trigger.dataset.modal);
    modal.classList.add("open");
    let exits = modal.querySelectorAll(".modal-exit");
    exits.forEach(function (exit) {
      exit.addEventListener("click", function (event) {
        event.preventDefault();
        modal.classList.remove("open");
      });
    });
  });
});

async function getProduct(id) {
  const res = await fetch(`http://localhost:3001/products/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return res.json();
}

const review = { text: "", rating: "", productId };

async function createReview() {
  review.text = document.getElementById("input-text-review").value;
  const res = await fetch(`http://localhost:3001/product-reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(review),
  });

  // const reviewSectionHtml = document.getElementById("review-section");
  // const createdReview = await res.json();
  // reviewSectionHtml.append(renderReviewHtml(createdReview));
  const product = await getProduct(productId);
  renderProductPage(product);
}

function resetForm() {
  review.text = "";
  review.rating = 1;
  document.getElementById("input-text-review").value = "";
  addRatingReview(review.rating);
}

function renderProductPage(product) {
  document.getElementById("product-title").innerHTML = product.title;
  document.getElementById("product-rating").innerHTML = product.rating;

  const productRatingHtmls = renderRatingHtml(product.rating);
  for (const html of productRatingHtmls) {
    document.getElementById("product-rating").parentElement.appendChild(html);
  }

  const reviewSectionHtml = document.getElementById("review-section");
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
