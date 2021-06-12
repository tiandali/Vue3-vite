<template>
  <div class="main">
    <h1 class="name">{{name}}</h1>
    <h2 class="name">{{count1}}</h2>
    <h3 class="name">{{state.count3}}</h3>
    <h4 class="name">{{count3}}</h4>
    <HelloWorld msg="Hello Vue 3 + Vite" />
    <Child :title="childTitle" />
    <button @click="changeTitle">change</button>
    <Count :count="childCount" @add="addCount" />
    <div>
      {{text}}
      <input v-model="text" />
    </div>
  </div>
</template>

<script  lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import Child from '@/components/Child.vue';
import Count from '@/components/Count.vue';
// import { getdate } from './services/index.js';
import { getdate } from '@/services/index.js';
console.log('getdate: ', getdate);
import style from './assets/style.module.css';
import {
  onMounted,
  ref,
  reactive,
  toRefs,
  h,
  unref,
  toRef,
  customRef,
  computed,
  watchEffect,
  shallowRef,
  isReactive,
  triggerRef,
  readonly, //只读的，watcheffect可以监查到
  watch,
} from 'vue';
function useDebouncedRef(value, delay = 200) {
  let timeout;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
}

enum Gender {
  Male,
  Female,
}
export default {
  name: 'App',
  components: {
    HelloWorld,
    Child,
    Count,
  },
  // data() {//vue3.0没有data函数了
  //   return {
  //   };
  // },
  setup(props, ctx) {
    console.log('ctx-app: ', ctx);
    const count1 = ref(1);
    //如果const test=ref({a:1,b:2})会把里面的变成reactive响应的.
    //获取就是test.value.a
    console.log('count1: ', count1);
    const state = reactive({
      count2: 2,
      count3: 3,
    }); //是深度转化为可相应的。

    //注意当嵌套在 reactive Object 中时，ref 才会解套。从 Array 或者 Map 等原生集合类中访问 ref 时，不会自动解套：
    const arr = reactive([ref(0)]);
    // 这里需要 .value
    console.log('arr', arr[0].value);

    const map = reactive(new Map([['foo', ref(0)]]));
    // 这里需要 .value
    console.log('map', map.get('foo').value);
    const obj = unref(state); //这算是一个语法糖，11等同于val = isRef(val) ? val.value : val
    // toRef 包裹的内容和源对象相关联。
    const item = reactive({
      name: '张三',
      age: 20,
    });
    const nameref = toRef(item, 'name');
    nameref.value = '李四';
    console.log('item.name: ', item.name);
    item.name = '王五';
    console.log('nameref: ', nameref.value);
    //当使用shallowRef时如果改变了值，就会变成非reactive的数据,会使watchEffect捕获不到，所以要用triggerRef重新包一下。
    const info2 = shallowRef({
      name: '张三',
    });
    info2.value = {
      name: '李四',
    };
    console.log('info2', isReactive(info2));
    triggerRef(info2);
    console.log('info2', isReactive(info2));
    const childTitle = ref('子组件标题初始化');
    const watchValue = ref(0);
    const changeTitle = () => {
      childTitle.value = '子组件标题变化';
      watchValue.value++;
    };

    //依赖收集会监听数据改变从而触发
    watch(
      () => {
        //return 的就是监听的指定的数据，如果是多个数据就用数组包裹[a,b]
        return watchValue.value;
      },
      (curvalue, oldvalue, onInvalidate) => {
        //如果是多个就是([cura,curb],[olda,oldb])
        console.log('curvalue,oldvalue: ', curvalue, oldvalue);
        onInvalidate(() => {
          console.log('执行watch的onInvalidate函数');
        });
      }
    );

    watchEffect(
      async (onInvalidate) => {
        console.log('watchEffect-childTitle', childTitle.value);
        const data = await getdate();

        onInvalidate(() => {
          console.log(
            'onInvalidate is triggered,当再次触发时会先执行这个函数里的东西，然后执行依赖的值部分'
          );
        });
      }
      // {
      // flush: 'sync',//同步执行
      // }
    );
    //当被调用时会卸载停止
    // const stop = watchEffect(() => {
    //   console.log('watchEffect-childTitle', childTitle.value);
    // });
    // stop();

    const watchchildTitle = computed(() => '监听' + childTitle.value);
    console.log('watchchildTitle: ', watchchildTitle.value); //并不能给watchchildTitle.value进行赋值操作，如果需要则需要在函数中用get(),set()进行相关设置
    const testWatch = computed({
      get() {
        return '触发' + childTitle.value;
      },
      set(value) {
        console.log('value: ', value);
        console.log('修改' + childTitle.value);
      },
    });
    console.log('testWatch: ', testWatch.value);
    testWatch.value = '变更';

    const childCount = ref(0);
    onMounted(async () => {
      const data = await getdate();
      console.log(data);
    });
    const addCount = (num) => {
      console.log('num: ', num);
      childCount.value++;
    };
    const text = useDebouncedRef('', 500);
    return {
      style,
      name: 'dali', //静态的不需要是响应式的,
      count1,
      state,
      ...toRefs(state),
      childTitle,
      childCount,
      addCount,
      changeTitle,
      text,
    };
    // return () => h('h2', [count1.value, state.count2, '测试值']); //可以用render函数，返回
  },

  mounted() {
    console.log(Gender.Female);
  },
};
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>


<style >
#app {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.name {
  color: green;
}
</style>
