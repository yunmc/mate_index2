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
            <div w-384 p-b-20 bg-1A1E28 border-radius-20 p-x-22 overflow-hidden class="proFile">
                <div fs-21 font-weight-bold color-fff center p-t-25>
                    <!-- :src="userStore.userInfo.avatar" -->
                    <img square-54 border-radius-50p src="@/assets/images/avatar.svg"  />
                </div>
                <div fs-14 color-fff center m-t-12> UID: {{ userStore.userInfo.user_account }}</div>

                <div class="cont" m-auto m-t-20>
                    <!-- ChatStore.isPopupCoin = true -->
                    <div :class="userStore.userInfo?.vip_info.vip_type == 0 ? 'payF' : 'pay'" class="pay" c-p @click="toBecomePro" flex-between-center font-weight-bold m-b-20>
                        <div color-fff fs-15 p-l-30>
                            <p>Current Plan </p>
                            <p class="proLabelBox"><span
                                    :class="userStore.userInfo?.vip_info.vip_type == 0 ? 'proLabelF' : 'proLabel'">{{
                                        userStore.userInfo?.vip_info.vip_type == 0 ? 'Free' :
                                    userStore.userInfo?.vip_info.vip_type == 1 ? 'M Pro' : 'Y Pro' }}</span>
                                <span v-if="userStore.userInfo?.vip_info.vip_type != 0">to {{
                                    userStore.userInfo?.vip_info.expire_time}} </span>
                            </p>
                        </div>
                        <!-- <p color-fff fs-18 center p-r-30> <img square-20 m-r-4 src="@/assets/images/coin_icon.webp" />{{ userStore.userInfo.coins_balance }} </p> -->
                        <p
                            style="background: #FCCA00;border-radius: 18px;height: 36px;padding: 0 12px;line-height: 36px;margin-right: 24px;font-size: 14px;font-weight: 700;">
                            Upgrade</p>
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
                    <!-- <a href="https://app.adjust.com/17i7dbt8" target="_blank" @click="toLink('download')">
                        <div flex-between-center p-y-10 c-p>
                            <p color-ffffff fs-12 flex-start-center> <img square-15 m-r-6
                                    src="@/assets/images/Experience.webp" /> Download </p>
                            <img square-15 src="@/assets/images/arrow-right.webp" />
                        </div>
                    </a> -->
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
    border-radius: 12px;
    padding: 14px 0;
    border: 1px solid #FF9B31;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
    background: rgba(255, 181, 36, 0.1);



    .proLabelBox {
        line-height: 28px;
        margin-top: 8px;

        .proLabel {
            background: linear-gradient(135deg, #8D2CFF 7.86%, #EE2F5D 50.71%, #FF27D0 100%);
            border: 1px solid #FFA635;
            width: 70px;
            display: inline-block;
            text-align: center;
            border-radius: 14px;
            margin-right: 4px;
        }
        .proLabelF{
            color: #FFB525;

        }
    }
}
.payF{
    
    border-radius: 12px;
    padding: 14px 0;
    border: 1px solid #7C7C7C;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.1);

}

.out {
    color: rgba(255, 255, 255, 0.5);
}

@media screen and (max-width: 768px) {
    .proFile {
        width: 95% !important;
        padding: 0 0.2rem;

        .cont {
            width: 100%;

            .pay {
                width: 100%;
            }
        }

        .out {
            margin: 0.2rem 0;
        }
    }
}
</style>
