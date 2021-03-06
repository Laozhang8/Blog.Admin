import Vue from 'vue'
import Router from 'vue-router'
import Layout from './views/Layout/Layout.vue'
import store from "./store";

import Login from './views/Login.vue'
import NotFound from './views/403.vue'
import Table from './views/User/Table.vue'
import Form from './views/User/Form.vue'
import Welcome from './views/Welcome'


Vue.use(Router)


const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/', component: Welcome, name: 'Welcome',
            meta: {
                requireAuth: false
            },
            hidden: true
        },
        {
            path: '/403',
            component: NotFound,
            name: '403',
            iconCls: 'fa fa-universal-access',//图标样式class
            // hidden: true
        },
        {
            path: '/login',
            component: Login,
            name: 'login',
            iconCls: 'fa fa-address-card',//图标样式class
            meta: {
                requireHome: true // 添加该字段，表示进入这个路由是需要登录的
            }
            // hidden: true
        },
        {
            path: '/user',
            component: Layout,
            name: '用户管理',
            iconCls: 'fa fa-users',//图标样式class
            children: [
                {
                    path: '', component: Table, name: '用户',
                    meta: {
                        requireAuth: true
                    }
                },
                {
                    path: 'form', component: Form, name: 'Form',
                    meta: {
                        requireAuth: false // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: '/403',component: NotFound,name: '',
                    hidden: true
                },
            ]
        },
        {
            path: '/Permission',
            component: Layout,
            name: '权限管理',
            iconCls: 'fa fa-stethoscope',//图标样式class
            children: [
                {
                    path: 'form1', component: Form, name: 'Form',
                    meta: {
                        requireAuth: false // 添加该字段，表示进入这个路由是需要登录的
                    }
                },
                {
                    path: 'table1', component: Table, name: '用户',
                    meta: {
                        requireAuth: true
                    }
                },
                {
                    path: '/403',component: NotFound,name: '',
                    hidden: true
                },
            ]
        },
        {
            path: '*',
            hidden: true,
            redirect: {path: '/404'}
        }
    ]
})

var storeTemp = store;
router.beforeEach((to, from, next) => {

    if (!storeTemp.state.token) {
        storeTemp.commit("saveToken", window.localStorage.Token)
    }
    if (to.meta.requireAuth) {
        // 判断该路由是否需要登录权限
        var curTime = new Date()
        var expiretime = new Date(Date.parse(window.localStorage.TokenExptire))

        if (storeTemp.state.token && storeTemp.state.token != "undefined" && (curTime < expiretime && window.localStorage.TokenExptire)) {
            // 通过vuex state获取当前的token是否存在
            next();
        } else {
            next({
                path: "/login",
                query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
            });
        }
    } else {
        next();
    }
});

export default router;
