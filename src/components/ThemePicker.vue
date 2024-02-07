<template>
  <Popup v-model:show="showPicker" teleport=".Provider" position="bottom" @close="ClosePicker">
    <!-- 主题色 -->
    <!-- <Cell v-for="(item, index) in APP_PRESET_COLOR_LIST" :key="index" @click="setThemeColor(item)">
      <template #title>
        <div :style="{ width: '100px', height: '25px', background: item.value }"></div>
      </template>
      <template #right-icon>
        <Icon v-if="getThemeColor === item.value" :color="item.value" name="success" :size="25" />
      </template>
    </Cell> -->
    <!-- 主题模式 -->
    <Cell :title="t('sys.darkMode.mode')">
      <template #right-icon>
        <Switch v-model="DarkMode" @change="ChangeDarkMode" size="25" />
      </template>
    </Cell>
    <!-- 网站灰色模式，用于可能悼念的日期开启 -->
    <Cell :title="t('common.grayMode')">
      <template #right-icon>
        <Switch v-model="grayMode" @change="ChangeGrayMode" size="25" />
      </template>
    </Cell>
    <!-- 色弱模式 -->
    <Cell :title="t('common.colorWeak')">
      <template #right-icon>
        <Switch v-model="colorWeak" @change="ChangeColorWeak" size="25" />
      </template>
    </Cell>
  </Popup>
</template>

<script lang="ts" setup>
  import { Popup, Cell, Switch } from 'vant';
  import { ThemeEnum } from '/@/enums/appEnum';
  import { useI18n } from '/@/hooks/web/useI18n';
  // import { ColorType } from '/@/settings/projectSetting';
  // import { getThemeVars } from '/@/logics/theme/getThemeVars';
  import { ref, computed, onBeforeMount, watchEffect } from 'vue';
  import { useSystemStoreWithOut } from '/@/stores/modules/SystemConfig';

  // store
  const SystemStore = useSystemStoreWithOut();

  // i18n
  const { t } = useI18n();

  // 是否显示
  const showPicker = ref<boolean>(false);

  // 主题模式
  const DarkMode = ref<boolean>(false);

  // 网站灰色模式
  const grayMode = computed(() => {
    return SystemStore.getGrayMode;
  });

  // 色弱模式
  const colorWeak = computed(() => {
    return SystemStore.getColorWeak;
  });

  const props = defineProps({
    // 是否显示picker
    showPicker: {
      type: Boolean,
      default: false,
    },
  });

  // 监听
  watchEffect(() => {
    if (props.showPicker) {
      showPicker.value = true;
    } else {
      showPicker.value = false;
    }
  });

  const emit = defineEmits(['handlePicker']);

  // // 当前主题
  // const getThemeColor = computed(() => {
  //   return SystemStore.getThemeColor;
  // });

  // // 切换主题色
  // const setThemeColor = (Color: ColorType): void => {
  //   SystemStore.setThemeColor(Color.value);
  //   // 获取主题变量
  //   const themeVars = getThemeVars(Color.value);
  //   // 修改主题变量配置
  //   SystemStore.setThemeVars(themeVars);
  //   ClosePicker();
  // };

  // 修改主题模式
  const ChangeDarkMode = (): void => {
    SystemStore.setDarkMode(DarkMode.value ? ThemeEnum.DARK : ThemeEnum.LIGHT);
    ClosePicker();
  };

  // 修改灰色模式
  const ChangeGrayMode = (): void => {
    SystemStore.setGrayMode(!grayMode.value);
    ClosePicker();
  };

  // 色弱模式
  const ChangeColorWeak = (): void => {
    SystemStore.setColorWeak(!colorWeak.value);
    ClosePicker();
  };

  // 回调函数
  const ClosePicker = (): void => {
    // 关闭Picker
    emit('handlePicker', false);
    setTimeout(() => {
      location.reload();
    }, 300);
  };

  onBeforeMount((): void => {
    DarkMode.value = SystemStore.getDarkMode === ThemeEnum.DARK;
  });
</script>

<style lang="less" scoped></style>
