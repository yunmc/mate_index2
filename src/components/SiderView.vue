<script lang="ts" setup>
import { ref, watch, inject, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Contact from '../components/contactUs/index.vue';
import { getHashUrlParams } from '@/utils/common';
const type = ref(0);
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const app = getCurrentInstance();
const sensors = app?.appContext.config.globalProperties.$sensors;
watch(
    route,
    to => {
        if (to.path === '/') type.value = 0;
        if (to.path === '/chat') type.value = 1;
        if (to.path === '/becomePro') type.value = 2;
    },
    { flush: 'pre', immediate: true, deep: true }
);
const contactUs = () => {
    sensors.track('h5_homepage_click', {
        node_name: '联系我们',
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
    if (!userStore.Token) {
        userStore.isPopupLogin = true;
    } else {
        userStore.isPopupContactUs = true;
    }
};
const toBecomePro = () => {
    sensors.track('h5_homepage_click', {
        node_name: '会员频道',
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
    if (!userStore.Token) {
        userStore.isPopupLogin = true;
    } else {
        sensors.track('h5_pro_page_view', {
            entrance_source: '频道点击',
            from_our_platform: 'ponrh.ai',
            ref_name: 'pornh.ai:' + getHashUrlParams('ref')
        });
        router.push('/becomePro');
    }
};
const toHome = () => {
    sensors.track('h5_homepage_click', {
        node_name: '首页',
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
    router.push('/');
};
const toChat = () => {
    sensors.track('h5_homepage_click', {
        node_name: '聊天频道',
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
    router.push('/chat');
};
const isClicked = inject('isClicked')
const windowOpen = (node_name:string,url: string) => {
    sensors.track('h5_homepage_click', {
        node_name: node_name,
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
    window.open(url);
};
</script>

<template>
    <div class="siderView" h-100p w-100p bg-131313>
        <div p-30 w-100p>
            <p flex-flex-start-center h-48 w-100p border-1 border-solid border-414267 color-FFFFFF fs-12
                border-radius-10 c-p m-b-16
                :style="{ opacity: type === 0 ? '1' : '0.5', width: isClicked ? '48px' : '100%', overflow: isClicked ? 'hidden' : 'initial', transition: 'all 0.5s' }"
                @click="toHome">
                <img src="@/assets/images/home_icon.svg" m-l-12 m-r-10 square-24 /> Home
            </p>
            <p flex-flex-start-center h-48 w-100p border-1 border-414267 border-solid color-FFFFFF fs-12
                border-radius-10 c-p m-b-16
                :style="{ opacity: type === 1 ? '1' : '0.5', width: isClicked ? '48px' : '100%', overflow: isClicked ? 'hidden' : 'initial', transition: 'all 0.5s' }"
                @click="toChat">
                <img src="@/assets/images/chat_icon.svg" m-l-12 m-r-10 square-24 /> Chat
            </p>
            <p flex-flex-start-center h-48 w-100p border-1 border-414267 border-solid color-FFFFFF fs-12
                border-radius-10 c-p m-b-16
                :style="{ opacity: type === 2 ? '1' : '0.5', width: isClicked ? '48px' : '100%', overflow: isClicked ? 'hidden' : 'initial', transition: 'all 0.5s' }"
                @click="toBecomePro">
                <img src="@/assets/images/pro_icon.svg" m-l-12 m-r-10 square-24 /> Become Pro
            </p>
            <p flex-flex-start-center h-48 w-100p border-1 border-414267 border-solid color-FFFFFF fs-12
                border-radius-10 c-p m-b-16
                :style="{ opacity: type === 3 ? '1' : '0.5', width: isClicked ? '48px' : '100%', overflow: isClicked ? 'hidden' : 'initial', transition: 'all 0.5s' }"
                @click="contactUs">
                <img src="@/assets/images/chat_icon.svg" m-l-12 m-r-10 square-24 /> Contact Us
            </p>
        </div>
        <div class="menu-bottom" p-30>
            <p @click="windowOpen('Discord','https://discord.gg/txKxnFeBdt')" flex-flex-start-center h-48 w-100p border-1
                border-414267 border-solid color-FFFFFF fs-12 border-radius-10 c-p m-b-16
                :style="{ width: isClicked ? '48px' : '100%', overflow: isClicked ? 'hidden' : 'initial', transition: 'all 0.5s' }">
                <img src="@/assets/images/discord_icon.svg" m-l-12 m-r-10 square-24 />Discord
            </p>
            <!-- <p flex-flex-start-center h-48 w-100p border-1 border-414267 border-solid color-FFFFFF fs-12
                border-radius-10 c-p m-b-16 :style="{ width: isClicked ? '48px' : '100%', overflow: isClicked ? 'hidden' : 'initial', transition: 'all 0.5s' }"><img src="@/assets/images/tikTok_icon.svg" m-l-12 m-r-10 square-24 />Tik Tok
            </p>
            <p flex-flex-start-center h-48 w-100p border-1 border-414267 border-solid color-FFFFFF fs-12
                border-radius-10 c-p m-b-16 :style="{ width: isClicked ? '48px' : '100%', overflow: isClicked ? 'hidden' : 'initial', transition: 'all 0.5s' }"><img src="@/assets/images/Instagram_icon.svg" m-l-12 m-r-10
                    square-24 />Instagram</p> -->
            <p @click="windowOpen('X','https://x.com/Matelink280248')" flex-flex-start-center h-48 w-100p border-1
                border-414267 border-solid color-FFFFFF fs-12 border-radius-10 c-p m-b-16
                :style="{ width: isClicked ? '48px' : '100%', overflow: isClicked ? 'hidden' : 'initial', transition: 'all 0.5s' }">
                <img src="@/assets/images/Facebook_icon.svg" m-l-12 m-r-10 square-24 />Facebook
            </p>
        </div>
    </div>
    <Contact />
</template>
<style lang="less" scoped>
.siderView {
    border-right: 1px solid #363636;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .menu-bottom {
        align-self: flex-end;
        border-top: 1px solid #363636;
        width: 100%;
    }
}
</style>
