<template>
  <div>
    <div class="row" style="gap: 0px 6px">
      <template v-for="i in 5">
        <div class="star" :class="classObject(i)"></div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  rating: Number,
});

const classObject = (value) => ({
  'star-half': props.rating < value && props.rating - value >= -0.5,
  'star-off': props.rating < value,
  'star-on': props.rating >= value,
});
</script>

