<template>
  <transition name="modal">
    <div v-if="modelValue" class="modal">
      <div class="modal-bg modal-exit" @click="closeModal"></div>
      <form class="modal-container column" style="align-items: start; width: 420px; gap: 20px">
        <div class="text-h1">What's Your rating?</div>
        <div class="text-semibold">Rating</div>
        <RatingInput v-model="productReview.rating" />
        <div>Review</div>
        <input v-model="productReview.text" class="form-input" placeholder="Start typing..." />
        <button @click="createProductReview" class="btn" type="submit" style="width: 180px">Submit review</button>
      </form>
    </div>
  </transition>
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue';
import axios from '../common/axios';
import RatingInput from './RatingInput.vue';

defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue', 'onSubmit']);
const closeModal = () => {
  emit('update:modelValue', false);
};

const productReview = ref({ text: '', rating: 1, productId: 1 });
const createProductReview = async (event) => {
  event.preventDefault();
  if (!productReview.value.text) return alert('Please input your review!');
  const res = await axios.post('/product-reviews', productReview.value);
  closeModal();
  emit('onSubmit', res.data);
};
</script>

<style scoped>
.modal-enter {
  opacity: 1;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-leave-active {
  transition: all 0.3s ease;
  transition-delay: 0s;
}
.modal {
  position: fixed;
  width: 100vw;
  height: 100vh;
  transition: all 0.3s ease;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-bg {
  position: absolute;
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
}
.modal-container {
  border-radius: 10px;
  background: #fff;
  position: relative;
  padding: 24px;
}
</style>
