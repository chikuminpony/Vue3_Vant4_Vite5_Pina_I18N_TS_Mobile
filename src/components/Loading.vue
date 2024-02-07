<template>
  <Loading v-if="isLoading" class="loading background" color="#1989fa" vertical>LOADING...</Loading>
</template>

<script lang="ts" setup>
  import { Loading } from 'vant';
  import { ref, onBeforeMount } from 'vue';

  // 加载状态
  const isLoading = ref<boolean>(true);

  // 定时器
  const Interval = ref<any>(null);

  // 秒数
  const Minutes = ref<number>(0);

  // 启动定时器
  const StartLoading = (): void => {
    Interval.value = setInterval(() => {
      // 如果超过10秒Loding未关闭
      if (Minutes.value === 10 && isLoading.value) {
        isLoading.value = false;
        clearInterval(Interval.value);
        Interval.value = null;
      } else {
        Minutes.value = Minutes.value + 1;
      }
    }, 1000);
  };

  // 初始化
  onBeforeMount((): void => {
    StartLoading();
  });
</script>

<style lang="less" scoped>
  .loading {
    text-align: center;
    padding-top: 100%;
    position: fixed;
    width: -webkit-fill-available;
    z-index: 2000;
    height: 100%;
    top: 0;
  }
</style>