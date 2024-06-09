<script lang="ts" setup>
import { inject,getCurrentInstance } from 'vue';
import PopupProfile from '../components/popup/proFile.vue';
import Login from '../components/login/index.vue';
import { useMessage } from 'naive-ui';
import { useUserStore } from '@/stores/user';
import { useOneTap, type CredentialResponse } from "vue3-google-signin";

const message = useMessage();
const app = getCurrentInstance();
const sensors = app?.appContext.config.globalProperties.$sensors;
const isMobile = app?.appContext.config.globalProperties.$isMobile;
const { isReady, login } = useOneTap({
  disableAutomaticPrompt: true,
  onSuccess: (response: CredentialResponse) => {
    googleLogin(response, 'google', 'Google');
  },
  onError: () => console.error("Error with One Tap Login"),
  // options
});
const userStore = useUserStore();

const googleLogin = async (response: any, type: any, platform: any) => {
    const param = response;
    param.login_type = type;
    const data: any = await userStore.getUserInfo(param);
    if (data.code == 200) {
        message.success('Login success');
        loginPlatform(platform, true, '', true);
    } else {
        message.error('Login error');
        loginPlatform(platform, false, data.msg, '');
    }
};

const loginPlatform = (platform: any, is_success: any, fail_reason: any, is_first_log: any) => {
    console.log('xxx', platform, is_success, fail_reason, is_first_log);
    sensors.track('h5_LoginPlatformClick', {
        platform_name: platform,
        is_success: is_success,
        fail_reason: fail_reason,
        is_first_log: is_first_log == '' ? false : true,
    });
};
const popupLogin = (): void => {
    userStore.isPopupLogin = true;
};
const isClicked = inject('isClicked')
</script>

<template>
    <header h-64 bg-131313 class="header">
        <div h-64 flex-between-center style="width: 100%;">
            <img src="@/assets/images/siler_icon.svg" square-48 m-r-24 c-p @click="isClicked = !isClicked" class="siler_icon" />
            <RouterLink to="/">
                <div color="#fff" fs-25 font-italic font-weight-bold flex-left-center c-p class="bannerBox"> <img square-40 m-r-12
                        src="@/assets/images/logo.webp" /> MateLink </div>
            </RouterLink>
            <div v-if="!userStore.Token" flex-end-center class="userBox">
                <span w-90 h-32 color="#FFFFFF" center border-FFB524 bg-FFB524 border-solid border-1 border-radius-8
                    fs-14 m-r-8 c-p @click="popupLogin">Register</span>
                <span w-90 h-32 color="#FFB524" center border-1 border-solid border-FFB524 border-radius-8 fs-14 c-p
                    @click="popupLogin" @mouseenter="() => login()">Login</span>
            </div>
            <div class="userBox" v-else>
                <div class="user" h-60 color-ffffff fs-15 flex-end-center c-p position-relative>
                    <div :class="userStore.userInfo?.vip_info.vip_type != 0 ? 'avatarBox vipBg' : 'avatarBox bg'">
                        <img src="@/assets/images/avatar.svg" class="avatar" />
                        <span class="vip_info">{{ userStore.userInfo?.vip_info.vip_type == 0 ? 'Free' :
                            userStore.userInfo?.vip_info.vip_type == 1 ? 'M Pro' : 'Y Pro' }}</span>
                    </div>
                    <!-- <img square-33 m-r-12 border-radius-50p :src="userStore.userInfo.avatar" /> {{
                        userStore.userInfo.user_account }} -->
                    <img square-15 m-l-5 src="@/assets/images/arrow_button.webp" />
                    <div class="person" w-130 position-absolute bg-232325 top-60 z-10 border-radius-12>
                        <p fs-14 center c-p @click="userStore.isPopupInfo = true">
                            <img src="@/assets/images/user_icon.svg" />
                            <span>Profile</span>
                        </p>
                        <p fs-14 center c-p @click="userStore.logOut()">
                            <img src="@/assets/images/signOut_icon.svg" />
                            <span>Logout</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <Login />
    <PopupProfile />
</template>

<style lang="less" scoped>
.user {
    .person {
        display: none;
    }

    &:hover .person {
        display: block;
    }
}

.header {
    border-bottom: 1px solid #363636;
    box-shadow: 0px 1px 2px 0px #0000000D;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    box-sizing: border-box;
    .userBox{
        margin-left: auto;
    }
    .user {
        .avatarBox {
            width: 92px;
            height: 38px;
            padding: 3px 4px;
            box-sizing: border-box;
            border-radius: 19px;
            display: flex;
            align-items: center;

            .avatar {
                display: block;
                width: 30px;
                height: 30px;
                margin-right: 2px;
            }

            .vip_info {
                font-family: DingTalk JinBuTi;
                font-size: 17px;
            }
        }

        .vipBg {
            background: linear-gradient(135deg, #8D2CFF 7.86%, #EE2F5D 50.71%, #FF27D0 100%);
            border: 2px solid #FFA635;
        }

        .bg {
            border: 2px solid rgba(255, 255, 255, 0.1);
            background: linear-gradient(114.24deg, rgba(255, 181, 36, 0.1) 16.28%, rgba(255, 140, 57, 0.1) 94.9%);
        }

        .person {
            border: 1px solid rgba(255, 255, 255, 0.1);
            overflow: hidden;

            p {
                text-align: center;
                line-height: 40px;
                display: flex;
                align-items: center;
                justify-content: start;

                img {
                    width: 20px;
                    margin-right: 8px;
                    margin-left: 12px;
                }

                span {
                    color: #969696;
                    font-size: 14px;
                    font-weight: 600;
                }
            }

            p:first-child {
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
        }


    }
}
@media screen and (max-width: 768px) {
    .header {
        padding: 0.11rem 0.05rem;
        border: none;
        .siler_icon{
            margin-right: 0;
        }
        .bannerBox{
            font-size: 0.2rem;
            img{
                width: 0.24rem;
                height: 0.24rem;
                margin-right: 0.05rem;
            }
        }
    }
    
}
</style>
