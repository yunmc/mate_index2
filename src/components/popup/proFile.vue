<script lang="ts" setup>
import { NModal } from 'naive-ui';
import { useRouter } from 'vue-router';
import { useChatStore } from '@/stores/chat';
import { useUserStore } from '@/stores/user';
import { getCurrentInstance, watch } from 'vue';
import { getHashUrlParams } from '@/utils/common';

const app = getCurrentInstance();
const router = useRouter();
const sensors = app?.appContext.config.globalProperties.$sensors;
const userStore = useUserStore();
const ChatStore = useChatStore();

watch(
    () => userStore.isPopupInfo,
    () => {
        if (userStore.isPopupInfo) {
            sensors.track('h5_user_profile_view', {
                from_our_platform: 'ponrh.ai',
                ref_name: 'pornh.ai:' + getHashUrlParams('ref')
            });
        }
    },
    { immediate: true }
);
const handleClick = () => {
    userStore.isPopupInfo = false;
};

const toLink = (name: any) => {
    sensors.track('h5_user_profile_click', {
        node_name: name,
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
};
const logOut = () => {
    sensors.track('h5_user_profile_click', {
        node_name: '退出',
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
    userStore.logOut();
    userStore.isPopupInfo = false;
    router.push('/');
};
const toBecomePro = () => {
    sensors.track('h5_user_profile_click', {
        node_name: '升级',
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });

    sensors.track('h5_pro_page_view', {
        entrance_source: '个人页弹窗',
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
    userStore.isPopupInfo = false;
    router.push('/becomePro');
};
</script>

<template>
    <div>
        <NModal v-model:show="userStore.isPopupInfo" :on-after-leave="handleClick">
            <div w-525 p-b-20 bg-313255 border-radius-20 overflow-hidden>
                <div fs-21 font-weight-bold color-fff center p-t-25>
                    <img square-54 border-radius-50p :src="userStore.userInfo.avatar" />
                </div>
                <div fs-14 color-fff center m-t-12> UID: {{ userStore.userInfo.user_account }} </div>

                <div w-425 m-auto m-t-20>
                    <!-- ChatStore.isPopupCoin = true -->
                    <div class="pay" c-p @click="toBecomePro" w-425 h-66 flex-between-center font-weight-bold m-b-20>
                        <p color-fff fs-15 p-l-30>Current Plan {{ userStore.userInfo?.vip_info.vip_type == 0 ? 'Free' :
                            userStore.userInfo?.vip_info.vip_type == 1 ? 'M Pro' : 'Y Pro' }}</p>
                        <!-- <p color-fff fs-18 center p-r-30> <img square-20 m-r-4 src="@/assets/images/coin_icon.webp" />{{ userStore.userInfo.coins_balance }} </p> -->
                        <p
                            style="background: #FCCA00;border-radius: 8px;height: 32px;padding: 0 20px;line-height: 32px;margin-right: 20px">
                            Change Plan</p>
                    </div>
                    <a href="https://cdn-mate.matelink.com/web/agreement-en.html" @click="toLink('User terms')"
                        target="_blank">
                        <div flex-between-center p-y-10 c-p>
                            <p color-ffffff fs-12 flex-start-center> <img square-15 m-r-6
                                    src="@/assets/images/user_terms.webp" /> User terms </p>
                            <img square-15 src="@/assets/images/arrow-right.webp" />
                        </div>
                    </a>
                    <a href="https://cdn-mate.matelink.com/web/service-en.html" @click="toLink('Privacy terms ')"
                        target="_blank">
                        <div flex-between-center p-y-10 c-p>
                            <p color-ffffff fs-12 flex-start-center> <img square-15 m-r-6
                                    src="@/assets/images/Invite.webp" /> Privacy terms </p>
                            <img square-15 src="@/assets/images/arrow-right.webp" />
                        </div>
                    </a>
                    <a href="https://app.adjust.com/17i7dbt8" target="_blank" @click="toLink('download')">
                        <div flex-between-center p-y-10 c-p>
                            <p color-ffffff fs-12 flex-start-center> <img square-15 m-r-6
                                    src="@/assets/images/Experience.webp" /> Download </p>
                            <img square-15 src="@/assets/images/arrow-right.webp" />
                        </div>
                    </a>
                </div>

                <div class="out" m-t-20 text-center>
                    <span c-p @click="logOut">Sign out</span>
                </div>
            </div>
        </NModal>
    </div>
</template>

<style lang="less" scoped>
.btn {
    width: 280px;
    height: 54px;
    background: url(@/assets/images/btn.webp) no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    margin-top: 40px;
    text-align: center;
    line-height: 54px;
    cursor: pointer;
}

.pay {
    background: linear-gradient(90deg, #6b3aff 0%, #bc36dd 100%);
    border-radius: 12px;
}

.out {
    color: rgba(255, 255, 255, 0.5);
}
</style>
