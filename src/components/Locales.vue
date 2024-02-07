<!-- <template>
  <Icon v-if="icon" :name="UserLocale.icon" @click="showPicker = true" size="0.5rem" />
  <Popup v-model:show="showPicker" closeable teleport=".Provider" position="bottom" @close="ClosePicker">
    <div class="p-3 ft-3">{{ t('component.locale') }}</div>
    <Cell size="large" v-for="(item, index) in LocalesList" :key="index" :title="item.label">
      <template #icon>
        <Icon :name="item.icon" class="m-r-2" size="0.6rem" />
      </template>
      <template #right-icon>
        <Switch :model-value="item.checked" @change="SelectLocale(item)" size="25" />
      </template>
    </Cell>
    <div class="m-2">
      <Button @click="showPicker = false" block type="danger">{{ t('common.cancelText') }}</Button>
    </div>
  </Popup>
</template>

<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLocale } from '/@/locales/useLocale';
  import { Popup, Cell, Switch, Icon, Button } from 'vant';
  import { ref, onMounted, watchEffect, computed } from 'vue';
  import { useSystemStoreWithOut } from '/@/stores/modules/SystemConfig';

  const props = defineProps({
    // 是否显示语言切换
    show: {
      type: Boolean,
      default: false,
    },
    // 是否显示图标按钮
    icon: {
      type: Boolean,
      default: true,
    },
  });

  const emit = defineEmits(['handle']);

  const { t } = useI18n();

  // store
  const SystemStore = useSystemStoreWithOut();

  const { changeLocale } = useLocale();

  // 监听
  watchEffect(() => {
    if (props.show) {
      showPicker.value = true;
    }
  });

  // 是否显示
  const showPicker = ref<boolean>(false);

  // 默认语言
  const UserLocale: any = computed(() => {
    return SystemStore.getLocaleInfo;
  });

  // 语言列表
  const LocalesList = ref<Array<any>>([]);

  const Locales: any = computed(() => {
    return SystemStore.getLangLocaleList;
  });

  // 切换语言
  const SelectLocale = (item: any): void => {

    setLocaleDataChecked(item.locale);

    // 切换语言
    SystemStore.setLocaleInfo(item);

    // 修改框架语言
    changeLocale(item.locale);

    // 关闭
    ClosePicker();

    // 刷新页面
    setTimeout(() => {
      location.reload();
    }, 100);
  };

  // 回调函数
  const ClosePicker = (): void => {
    // 关闭Picker
    showPicker.value = false;
    emit('handle', false);
  };

  // 设置对应的选中状态
  const setLocaleDataChecked = (locale: string): void => {
    LocalesList.value = Locales.value.map((k: any) => {
      if (k.locale === locale) {
        k.checked = true;
      } else {
        k.checked = false;
      }
      
      return k;
    });
  };

  onMounted((): void => {
    // 初始化显示
    setLocaleDataChecked(SystemStore.getLocaleInfo.locale);
  });
</script>

<style lang="less" scoped>
&:deep(.van-cell) {
  align-items: center;
}
</style> -->
