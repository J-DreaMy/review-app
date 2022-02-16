<template>
  <div class="row star-row">
    <template v-for="i in 5">
      <div class="star" :class="classObject(i)"></div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  rating: Number,
});

const classObject = (value) => ({
  'star-half': props.rating < value && props.rating - value >= -0.5,
  'star-off': props.rating < value,
  'star-on': props.rating >= value,
});
</script>

