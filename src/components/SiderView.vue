<script lang="ts" setup>
import { ref, watch,inject } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Contact from '../components/contactUs/index.vue';
const type = ref(0);
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
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
    if (!userStore.Token) {
        userStore.isPopupLogin = true;
    } else {
        userStore.isPopupContactUs = true;
    }
};
const toBecomePro = () => {
    if (!userStore.Token) {
        userStore.isPopupLogin = true;
    } else {
        router.push('/becomePro');
    }
};
const isClicked = inject('isClicked')
</script>

<template>
    <div class="siderView" h-100p w-100p bg-131313>
        <div p-30 w-100p>
            <RouterLink to="/">
                <p flex-flex-start-center h-48 w-100p border-1 border-solid border-414267 color-FFFFFF fs-12
                    border-radius-10 c-p m-b-16 :style="{ opacity: type === 0 ? '1' : '0.5', width: isClicked ? '48px' : '100%', overflow: isClicked ? 'hidden' : 'initial', transition: 'all 0.5s' }">
                    <img src="@/assets/images/home_icon.svg" m-l-12 m-r-10 square-24 /> Home
                </p>
            </RouterLink>
            <RouterLink to="chat">
                <p flex-flex-start-center h-48 w-100p border-1 border-414267 border-solid color-FFFFFF fs-12
                    border-radius-10 c-p m-b-16 :style="{ opacity: type === 1 ? '1' : '0.5', width: isClicked ? '48px' : '100%', overflow: isClicked ? 'hidden' : 'initial', transition: 'all 0.5s' }">
                    <img src="@/assets/images/chat_icon.svg" m-l-12 m-r-10 square-24 /> Chat
                </p>
            </RouterLink>
            <p flex-flex-start-center h-48 w-100p border-1 border-414267 border-solid color-FFFFFF fs-12
                border-radius-10 c-p m-b-16 :style="{ opacity: type === 2 ? '1' : '0.5', width: isClicked ? '48px' : '100%', overflow: isClicked ? 'hidden' : 'initial', transition: 'all 0.5s' }" @click="toBecomePro">
                <img src="@/assets/images/pro_icon.svg" m-l-12 m-r-10 square-24 /> Become Pro
            </p>
            <p flex-flex-start-center h-48 w-100p border-1 border-414267 border-solid color-FFFFFF fs-12
                border-radius-10 c-p m-b-16 :style="{ opacity: type === 3 ? '1' : '0.5', width: isClicked ? '48px' : '100%', overflow: isClicked ? 'hidden' : 'initial', transition: 'all 0.5s' }" @click="contactUs">
                <img src="@/assets/images/chat_icon.svg" m-l-12 m-r-10 square-24 /> Contact Us
            </p>
        </div>
        <div class="menu-bottom" p-30>
            <p flex-flex-start-center h-48 w-100p border-1 border-414267 border-solid color-FFFFFF fs-12
                border-radius-10 c-p m-b-16 :style="{ width: isClicked ? '48px' : '100%', overflow: isClicked ? 'hidden' : 'initial', transition: 'all 0.5s' }"><img src="@/assets/images/discord_icon.svg" m-l-12 m-r-10
                    square-24 />Discord</p>
            <p flex-flex-start-center h-48 w-100p border-1 border-414267 border-solid color-FFFFFF fs-12
                border-radius-10 c-p m-b-16 :style="{ width: isClicked ? '48px' : '100%', overflow: isClicked ? 'hidden' : 'initial', transition: 'all 0.5s' }"><img src="@/assets/images/tikTok_icon.svg" m-l-12 m-r-10 square-24 />Tik Tok
            </p>
            <p flex-flex-start-center h-48 w-100p border-1 border-414267 border-solid color-FFFFFF fs-12
                border-radius-10 c-p m-b-16 :style="{ width: isClicked ? '48px' : '100%', overflow: isClicked ? 'hidden' : 'initial', transition: 'all 0.5s' }"><img src="@/assets/images/Instagram_icon.svg" m-l-12 m-r-10
                    square-24 />Instagram</p>
            <p flex-flex-start-center h-48 w-100p border-1 border-414267 border-solid color-FFFFFF fs-12
                border-radius-10 c-p m-b-16 :style="{ width: isClicked ? '48px' : '100%', overflow: isClicked ? 'hidden' : 'initial', transition: 'all 0.5s' }"><img src="@/assets/images/Facebook_icon.svg" m-l-12 m-r-10
                    square-24 />Facebook</p>
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
