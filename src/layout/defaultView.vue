<script setup lang="ts">
import { NDialogProvider, NLayout, NLayoutContent, NLayoutHeader, NLayoutSider, NMessageProvider } from 'naive-ui';
import HeaderView from '../components/HeaderView.vue';
import SiderView from '../components/SiderView.vue';

import PopupDownload from '../components/popup/downLoad.vue';
import PopupPayType from '../components/popup/payType.vue';
import PopupMateCoin from '../components/popup/mateCoin.vue';
import PopupClause from '../components/popup/clause.vue';
import { ref, provide, getCurrentInstance, watch } from 'vue';
import { useRoute } from 'vue-router';
const app = getCurrentInstance();
const isMobile = app?.appContext.config.globalProperties.$isMobile;
const isClicked = isMobile ? ref(true) : ref(false);

const route = useRoute();
provide('isClicked', isClicked)

watch(
    () => route,
    () => {
        // isClicked.value = true;
    },
    { deep: true }
);
</script>

<template>
    <NDialogProvider>
        <NMessageProvider>
            <NLayout position="absolute">
                <NLayoutHeader style="height: 64px">
                    <HeaderView />
                </NLayoutHeader>
                <NLayout has-sider position="absolute" style="top: 64px; bottom: 0">
                    <NLayoutSider class="sider"
                        :class="isClicked && isMobile ? 'retractionM' : isClicked && !isMobile ? 'retraction' : ''">
                        <SiderView />
                    </NLayoutSider>
                    <NLayoutContent style="background: #131313">
                        <router-view v-slot="{ Component }">
                            <keep-alive>
                                <component :is="Component" v-if="$route.meta.keepAlive" />
                            </keep-alive>
                            <component :is="Component" v-if="!$route.meta.keepAlive" />
                        </router-view>
                    </NLayoutContent>
                </NLayout>
            </NLayout>
        </NMessageProvider>
    </NDialogProvider>
    <PopupDownload />
    <PopupPayType />
    <PopupMateCoin />
    <PopupClause />
</template>

<style lang="less">
.sider {
    width: 272px !important;
    transition: all 0.5s;
    overflow: hidden;

    .n-layout-sider-scroll-container {
        width: 100% !important;
        min-width: auto !important;
    }
}

.retraction {
    width: 100px !important;
}

@media screen and (max-width: 768px) {
    .sider {
        width: 2.2rem !important;
        position: fixed;
        left: 0;
        top: 64px;
        height: calc(100% - 64px);
        z-index: 20;
    }

    .retractionM {
        width: 0 !important;
    }

}
</style>
