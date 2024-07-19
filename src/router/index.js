import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/views/Layout'
import Login from '@/views/Login'
//() => import('../views/AboutView.vue')
import Home from '@/views/Home'
//产品
const Goods = () => import('@/views/Goods')
const List = () => import('@/views/Goods/GoodsList.vue')
const Category = () => import('@/views/Goods/Category.vue')
const AddGoods = () => import('@/views/Goods/AddGoods.vue')

//订单
const order = () => import('@/views/Order')
const orderlist = () => import('@/views/Order/list')
const collect = () => import('@/views/Order/collect')

const routes = [

    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '/',
                name: 'home',
                component: Home,
                meta: {
                    title: "首页"
                }
            },
            {
                path: '/goods',
                component: Goods,
                meta: {
                    title: "产品管理"
                },
                children: [
                    {
                        path: 'list',
                        name: 'list',
                        component: List
                    },
                    {
                        path: 'category',
                        name: 'category',
                        component: Category
                    },
                    {
                        path: 'addGoods',
                        name: 'addGoods',
                        component: AddGoods,
                        //路由元信息
                        meta: {
                            isShow: true,
                            activeMenu: "list",
                            title: "添加商品",
                        }
                    },

                ]
            },
            {
                path: '/order',
                component: order,
                meta: {
                    title: "订单管理"
                },
                children: [
                    {
                        path: 'orderlist',
                        component: orderlist,
                        meta: {
                            title: "订单列表"
                        },
                    },
                    {
                        path: 'collect',
                        component: collect,
                        meta: {
                            title: "订单汇总"
                        },
                    },
                ]
            },
        ]
    },

    {
        path: '/login',
        name: 'login',
        component: Login
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router;