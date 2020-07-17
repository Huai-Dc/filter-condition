import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/layout/Layout.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/typicalCity',
        component: Layout,
        meta:{
            title: "典型城市",
        },
        children: [
            {
                path: 'filterCondition',
                name: 'FilterCondition',
                component: () => import("@/views/typicalCity/FilterCondition.vue"),
                meta: {
                    icon: 'map',
                    title: '基础地图',
                }
            }
        ]
    }
]

const router = new VueRouter({
  routes
})

export default router
