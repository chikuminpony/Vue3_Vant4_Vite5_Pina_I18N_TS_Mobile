import { store } from '/@/stores';
import { defineStore } from 'pinia';
import { deepMerge } from '/@/utils';
import pkg from '../../../package.json';
import { ThemeEnum } from '/@/enums/appEnum';
import { setVantLocales } from '/@/locales/VantLocale';
import { localeSetting } from '/@/settings/localeSetting';
import type { LocaleSetting, ProjectConfig } from '/#/config';
import { updateGrayMode } from '/@/logics/theme/updateGrayMode';
import { updateColorWeak } from '/@/logics/theme/updateColorWeak';
import { APP_PRESET_COLOR_LIST } from '/@/settings/projectSetting';

const lsLocaleSetting = localeSetting as LocaleSetting;

// State类型控制
interface SystemState {
  // 国际化语言
  localInfo: LocaleSetting;
  // 项目配置
  projectConfig: ProjectConfig | object;
  // UI库主题变量配置
  themeVars: object;
  // App版本信息
  AppClient: any;
}

// 导出系统配置
export const useSystemStore = defineStore({
  id: 'System',
  state: (): SystemState => ({
    // 国际化语言
    localInfo: lsLocaleSetting,
    // 项目配置
    projectConfig: {},
    // UI库主题变量配置
    themeVars: {},
    // App版本信息
    AppClient: {},
  }),
  // getters
  getters: {
    // 获取主题模式
    getDarkMode(): ThemeEnum.LIGHT | ThemeEnum.DARK {
      return (this.projectConfig as ProjectConfig).themeDark || ThemeEnum.LIGHT;
    },

    // 获取主题颜色
    getThemeColor(): string {
      return (
        (this.projectConfig as ProjectConfig).themeColor ||
        (APP_PRESET_COLOR_LIST[0] as unknown as string)
      );
    },

    // 获取当前语言
    getLocaleInfo(): LocaleSetting {
      return this.localInfo || localeSetting;
    },

    // 获取UI库主题变量配置
    getThemeVars(): any {
      return this.themeVars || {};
    },

    // 获取色弱模式状态
    getColorWeak(): boolean {
      return (this.projectConfig as ProjectConfig).colorWeak || false;
    },

    // 获取灰色模式状态
    getGrayMode(): boolean {
      return (this.projectConfig as ProjectConfig).grayMode || false;
    },

    // 获取APP版本信息
    getSystemAppClient(): any {
      return this.AppClient || {};
    },
  },
  // actions
  actions: {
    // 修改主题模式
    setDarkMode(payload: ThemeEnum): void {
      (this.projectConfig as ProjectConfig).themeDark = payload;
    },

    // 保存语言
    setLocaleInfo(payload: Partial<LocaleSetting>): void {
      this.localInfo = { ...this.localInfo, ...payload };
      // 切换UI库语言
      setVantLocales(this.localInfo.locale);
    },

    // 保存基础配置数据
    setProjectConfig(payload: DeepPartial<ProjectConfig>): void {
      this.projectConfig = deepMerge(this.projectConfig || {}, payload);
    },

    // 更新UI库主题变量配置
    setThemeVars(payload: Object): void {
      this.themeVars = payload;
    },

    // 修改主题色
    setThemeColor(payload: string): void {
      (this.projectConfig as ProjectConfig).themeColor = payload;
    },

    // 网站灰色模式
    setGrayMode(payload: boolean): void {
      (this.projectConfig as ProjectConfig).grayMode = payload;
      updateGrayMode(payload);
    },

    // 色弱模式
    setColorWeak(payload: boolean): void {
      (this.projectConfig as ProjectConfig).colorWeak = payload;
      updateColorWeak(payload);
    },

    // 获取当前环境配置
    setAppClient(): void {
      // 检测当前是否为Apple MobileConfig证书APP
      const System: any = {
        // 系统名称
        mode: 'H5',
        // 系统版本
        version: null,
        // 系统语言
        locale: null,
        // 厂商
        vendor: null,
        // APP版本号
        app_version: pkg.version,
        // 是否为APP
        isAppClient: false,
      };

      // 如果是证书App
      if (location.host.includes('Apple')) {
        // 系统名称
        System.mode = 'Apple';

        // 系统版本
        System.version = mui.os.version;

        // 系统语言
        System.locale = navigator.language;

        // 厂商
        System.vendor = 'Apple';

        // APP版本号
        System.app_version = pkg.version;

        // 是否为APP
        System.isAppClient = false;
      }
      
      // APP环境
      mui.plusReady((plus: any) => {
        // 系统名称
        System.mode = plus.os.name;

        // 系统版本
        System.version = plus.os.version;

        // 系统语言
        System.locale = plus.os.language;

        // 厂商
        System.vendor = plus.os.vendor;

        // APP版本号
        System.app_version = plus.runtime.version;

        // 是否为APP
        System.isAppClient = true;
      });

      // 保存
      this.AppClient = System;
    },
  },
  persist: {
    key: pkg.name + '_System',
    storage: localStorage
  }
});

// Need to be used outside the setup
export function useSystemStoreWithOut() {
  return useSystemStore(store);
}
