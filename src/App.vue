<template>
  <ConfigProvider class="Provider" :theme="ThemeMode" :theme-vars="ThemeVars">
    <RouterView v-slot="{ Component }">
      <KeepAlive>
        <Component :is="Component" v-if="$route.meta.keepAlive" />
      </KeepAlive>
      <Component :is="Component" v-if="!$route.meta.keepAlive" />
    </RouterView>
  </ConfigProvider>
</template>

<script setup lang="ts">
  import VConsole from 'vconsole';
  import { ConfigProvider } from 'vant';
  import { RouterView } from 'vue-router';
  import { onBeforeMount, computed } from 'vue';
  import { useLocale } from '/@/locales/useLocale';
  import { useSystemStoreWithOut } from './stores/modules/SystemConfig';

  const { changeLocale } = useLocale();

  const SystemStore = useSystemStoreWithOut();

  // 当前主题模式
  const ThemeMode = computed(() => {
    return SystemStore.getDarkMode;
  });

  // 主题变量配置
  const ThemeVars = computed(() => {
    return SystemStore.getThemeVars;
  });

  // 是否显示Vconsole
  const isShowConsole = (): void => {
    if (import.meta.env.DEV) {
      new VConsole();
    }
  };

  // 写入信息
  // const setWebSiteContent = (data: any): void => {
  //   document.title = data.website_name;
  //   // 插入角标
  //   var Link = document.createElement('link');
  //   Link.rel = 'icon';
  //   Link.href = data.website_favicon;
  //   document.getElementsByTagName('head')[0].appendChild(Link);

  //   // 插入简介
  //   setMeta('description', data.website_description);

  //   // 插入关键词
  //   setMeta('keywords', data.website_keywords);
  // };

  // // 写入meta
  // const setMeta = (name: string, content: string): void => {
  //   var oMeta = document.createElement('meta');
  //   oMeta.name = name;
  //   oMeta.content = content;
  //   document.getElementsByTagName('head')[0].appendChild(oMeta);
  // };

  onBeforeMount((): void => {
    isShowConsole();

    // 初始化语言为英语
    changeLocale('zh_CN');
  });
</script>
