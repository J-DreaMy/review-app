<template>
  <transition name="fade">
    <div v-if="currentValue" class="modal">
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
import { computed, ref } from 'vue';
import axios from '../common/axios';
import RatingInput from './RatingInput.vue';

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue', 'onSubmit']);
const currentValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const closeModal = () => {
  currentValue.value = false;
};

const productReview = ref({ text: '', rating: 1, productId: 1 });
const createProductReview = async (event) => {
  event.preventDefault();
  if (!productReview.value.text) return alert('Please input your review!');
  try {
    const res = await axios.post('/product-reviews', productReview.value);
    emit('onSubmit', res.data);
    closeModal();
    productReview.value = { text: '', rating: 1, productId: 1 };
  } catch (error) {
    if (!error.response.data.message) return;
    alert(error.response.data.message);
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.modal {
  position: fixed;
  width: 100vw;
  height: 100vh;
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
