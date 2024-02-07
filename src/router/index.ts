import type { App } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';
import { useUserStoreWithOut } from '/@/stores/modules/UserConfig';

// 获取所有视图文件
const RouterModules = import.meta.glob('../views/**/*.vue');

// 路由树
const routes: Array<RouteRecordRaw | any> = [];

// 自动注册路由
Object.keys(RouterModules).map((Name: any) => {
  
  // 截取路由地址
  const RouterReplace = Name.split('/');

  // 获取路由名称
  const RouterName = RouterReplace[RouterReplace.length - 1].replace('.vue', '');

  // 路由地址
  let RouterPath = RouterName;

  // 如果是Home首页
  if (RouterName === 'home') {
    RouterPath = '/';
  } else if (RouterName === 'EmptyView') {
    // 空页面
    RouterPath = '/:pathMath(.*)';
  } else {
    RouterPath = `/${RouterPath}`;
  }

  routes.push({
    path: RouterPath,
    name: RouterName,
    component: RouterModules[Name],
  });
});

// 创建路由
export const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes
});

// 注册路由
export const setupRouter = (app: App): void => {
  app.use(router);
};

// 路由守卫
router.beforeEach((_to, _from) => {
  const UserStore = useUserStoreWithOut();
  const route = routes.filter((k: any) => k.name === _to.name)[0];
  // 验证是否登录
  if (UserStore.getToken) {
    return true;
  } else {
    // 校验要去的页面
    if ((route && route.isLogin) ?? false) {
      router.push('/Login');
    } else {
      return true;
    }
  }
});
