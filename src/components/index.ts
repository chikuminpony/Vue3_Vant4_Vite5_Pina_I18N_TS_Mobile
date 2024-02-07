import { withInstall } from '/@/utils';

// 折线图
import AppEcharts from './ECharts.vue';

// 加载
import AppLoading from './Loading.vue';

// 多语言
import AppLocale from './Locales.vue';

// 数字滚动
import AppCountTo from './CountTo.vue';

// 切换主题
import AppThemePicker from './ThemePicker.vue';

export const ECharts = withInstall(AppEcharts);
export const Loading = withInstall(AppLoading);
export const Locales = withInstall(AppLocale);
export const CountTo = withInstall(AppCountTo);
export const ThemePicker = withInstall(AppThemePicker);