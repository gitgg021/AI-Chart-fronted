export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },

  {
    path: '/user',
    layout: false,
    routes: [{ name: '注册', path: '/user/register', component: './User/Register' }],
  },

  {
    path: '/',
    redirect: '/add_chart_async_mq',
  },
  {
    path: '/add_chart_async_mq',
    name: '智能分析',
    icon: 'barChart',
    component: './AddChartAsyncMq',
  },
  {
    path: '/my_chart',
    name: '我的图表',
    icon: 'pieChart',
    component: './MyChart',
  },
/*  {
    path: '/add_chart',
    name: '智能分析(同步)',
    icon: 'fundOutlined',
    component: './AddChart',
  },*/
/*  {
    path: '/add_chart_async',
    name: '智能分析(线程池异步)',
    icon: 'barChart',
    component: './AddChartAsync',
  },*/


  {
    path: '/viewChartData/:id',
    icon: 'checkCircle',
    component: './ViewChartData',
    name: '查看图表',
    hideInMenu: true,
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
    ],
  },

  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
