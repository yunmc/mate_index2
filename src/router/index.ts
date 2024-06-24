import { createRouter, createWebHashHistory } from 'vue-router';
import { getHashUrlParams } from '@/utils/common';

const router = createRouter({
    history: createWebHashHistory('/'),
    routes: [
        {
            path: '/',
            redirect: '/',
            component: () => import('@/layout/defaultView.vue'),
            meta: {
                title: '',
                keepAlive: true,
            },
            children: [
                {
                    path: '/',
                    component: () => import('@/views/indexView.vue'),
                    meta: {
                        title: '',
                        keepAlive: false,
                    },
                },
                {
                    path: 'chat',
                    component: () => import('@/views/chatView.vue'),
                    meta: {
                        title: '',
                        keepAlive: false,
                    },
                },
                {
                    path: 'becomePro',
                    component: () => import('@/views/becomeProView.vue'),
                    meta: {
                        title: '',
                        keepAlive: false,
                    },
                },
            ],
        },
    ],
});

router.beforeEach((to, from, next) => {
    // 获取当前 URL 的查询参数
    const currentRef = getHashUrlParams('ref');
    console.log(currentRef, 'currentRef')
    // 如果目标路由没有 ref 参数，但是当前 URL 有
    if (!to.query.ref && currentRef) {
        // 重定向到目标路由，并附加上 ref 参数
        const nextPath = {
            path: to.path,
            query: { ...to.query, ref: currentRef }, // 合并已有的查询参数
            hash: to.hash,
        };
        console.log(nextPath, 'nextPath')
        next(nextPath);
    } else {
        // 如果目标路由已经有了 ref 参数或者当前 URL 中没有这个参数，直接放行
        next();
    }
});

export default router;
