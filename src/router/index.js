import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/layout/Layout.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/typicalCity',
        component: Layout,
        meta: {
            title: "典型城市",
        },
        children: [
            {
                path: 'filterCondition',
                name: 'FilterCondition',
                component: () => import("@/views/typicalCity/FilterCondition.vue"),
                meta: {
                    icon: 'map',
                    title: '筛选',
                }
            }, {
                path: 'schemeList',
                name: 'SchemeList',
                component: () => import("@/views/typicalCity/SchemeList.vue"),
                meta: {
                    icon: '',
                    title: '方案列表'
                }
            }, {
                path: 'schemeDetailStep',
                name: 'SchemeDetailStep',
                component: () => import("@/views/typicalCity/SchemeDetailStep.vue"),
                meta: {
                    icon: '',
                    title: '方案步骤'
                }
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router
