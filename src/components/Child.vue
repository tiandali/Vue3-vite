<template>
  <div class="titl">
    <h2>{{title}}</h2>
    <h3>{{childTitle}}</h3>
  </div>
</template>
<script>
import { watch, watchEffect, toRefs } from 'vue'
export default {
  props: {
    title: String,
  },
  setup(props, ctx) {
    console.log('props: ', props);
    const { title } = toRefs(props);
    //不要结构props，会让props里的值失去响应式
    //可以toRefs，const {title}=toRefs(props)
    // watchEffect(() => {
    //   console.log('props.title', props.title)
    // })
    watch(() => {
      return props.title
    }, (newValue) => {
      console.log('newValue: ', newValue);
      console.log('新值拿到后触发');
    })
    return {
      childTitle: title
    }
  },
}
</script>

