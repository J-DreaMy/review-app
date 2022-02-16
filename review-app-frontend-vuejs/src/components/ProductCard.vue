<template>
  <div class="product-card" v-if="!isLoading">
    <div class="product-title">{{ product.title }}</div>
    <div class="row" style="min-width: 420px">
      <div class="row">
        <div class="product-rating">{{ round(product.rating) }}</div>
        <Rating :rating="product.rating" />
      </div>
      <div class="spacer"></div>
      <button class="btn" @click="openModal">Add review</button>
    </div>
    <div style="height: 16px"></div>
    <div class="seperator"></div>
    <div style="height: 8px"></div>
    <div class="review-section">
      <div class="reviews-text">Reviews</div>
      <div class="row review-box" v-for="review in product.reviews">
        <Rating :rating="review.rating" />
        <div style="width: 16px"></div>
        <div class="text-bold">{{ review.rating }}</div>
        <div>, &nbsp;</div>
        <div class="review-text">{{ review.text }}</div>
      </div>
    </div>
  </div>
  <FormReviewModal v-model="showModal" @onSubmit="handleCreatedProductReview" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from '../common/axios';
import socket from '../common/socket';
import FormReviewModal from './FormReviewModal.vue';
import Rating from './Rating.vue';

const product = ref({ title: '...', star: 0, reviews: [] });
const isLoading = ref(false);
const showModal = ref(false);

socket.on('connect', () => console.log('socket connected'));
socket.on('sendNewProductReview', (data) => updateProductRating(data));

const getProduct = async (id) => {
  try {
    isLoading.value = true;
    const res = await axios.get(`/products/${id}`);
    product.value = res.data;
    isLoading.value = false;
  } catch (error) {
    console.log(error);
  }
};

const handleCreatedProductReview = (productReview) => {
  updateProductRating(productReview);
  socket.emit('receiveNewProductReview', productReview);
};

const updateProductRating = (productReview) => {
  product.value.reviews.push(productReview);
  product.value.totalReview += 1;
  const { totalReview } = product.value;
  product.value.rating = (product.value.rating * (totalReview - 1)) / totalReview + productReview.rating / totalReview;
};

const round = (val) => Math.round(val * 10) / 10;

const openModal = () => {
  showModal.value = true;
};

onMounted(() => {
  getProduct(1);
});
</script>

<style scoped>
.product-card {
  margin: auto;
  width: max-content;
}
.product-title {
  font-size: 44px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.4rem;
}
.product-rating {
  font-size: 38px;
  margin: 0 16px 0 2px;
}
.review-section {
  text-align: left;
}
.reviews-text {
  font-size: 22px;
  font-weight: bold;
}
.review-box {
  margin: 24px 0px;
}
.review-text {
  color: #8d8d8d;
}
</style>
