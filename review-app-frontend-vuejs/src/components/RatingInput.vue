<template>
  <div>
    <div class="row" style="gap: 0px 8px">
      <template v-for="i in 5">
        <div class="star" :class="classObject(i)"></div>
      </template>
    </div>
    <div class="row boxes" @mouseleave="setDefaultRating()">
      <div v-for="i in 10" class="box-hover" @mouseenter="setCurrentRating(i)" @click="setRating(i)"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0.5,
  },
});
const emit = defineEmits(['update:modelValue']);

const setRating = (val) => emit('update:modelValue', val / 2);

const currentRating = ref(props.modelValue);
const setCurrentRating = (val) => (currentRating.value = val / 2);
const setDefaultRating = () => (currentRating.value = props.modelValue);

const classObject = (rating) => ({
  'star-half': currentRating.value - rating == -0.5,
  'star-off': currentRating.value < rating,
  'star-on': currentRating.value >= rating,
});
</script>

<style scoped>
.boxes {
  margin-top: -30px;
  width: max-content;
}
.box-hover {
  width: 15px;
  height: 40px;
  padding: 0px 1.5px;
  display: inline-block;
}
.boxes > .box-hover:last-child {
  padding-right: 12px;
}
</style>
