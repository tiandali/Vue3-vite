<template>
  <div class="titl">
    <h2>子组件{{count}}</h2>
    <button @click="addCount">添加</button>
  </div>
</template>
<script>
import { watch, watchEffect, toRefs } from 'vue'
export default {
  props: {
    count: Number,
  },
  setup(props, ctx) {
    console.log('ctx: ', ctx);
    console.log('props: ', props);
    const addCount = () => {
      ctx.emit('add', 3)
    }
    return {
      addCount
    }



  },
}
</script>

