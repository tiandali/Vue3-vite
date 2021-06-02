<template>
  <div>
    <h1>{{ msg }}</h1>
    <div @click="state.count++">count is: {{ state.count }}</div>
  </div>
</template>

<script>
import { defineProps, reactive } from 'vue'

defineProps({
  msg: String
})

const state = reactive({ count: 0 })
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  // setup(props) {
  //   return { state }
  // },
  data() {
    return {
      state: { count: 0 },

    }
  },

}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
