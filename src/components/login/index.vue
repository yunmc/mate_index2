<script lang="ts" setup>
import { ref, getCurrentInstance, watch } from 'vue';
import { GoogleSignInButton, type CredentialResponse } from 'vue3-google-signin';
import { useRouter } from 'vue-router';
import { NModal, useMessage, NSpin } from 'naive-ui';
import { useUserStore } from '@/stores/user';
import { getHashUrlParams } from '@/utils/common';
// import { getUrlParams, GenerateKey } from '@/utils/common';
const { VITE_USER_NODE_ENV } = import.meta.env;
const userStore = useUserStore();
const router = useRouter();
const show = ref(false);
const message = useMessage();
const app = getCurrentInstance();
const sensors = app?.appContext.config.globalProperties.$sensors;

watch(
    () => userStore.isPopupLogin,
    () => {
        if (userStore.isPopupLogin) {
            let path = null;
            switch (router.currentRoute.value.path) {
                case '/':
                    path = '首页';
                    break;
                case '/chat':
                    path = '聊天页';
                    break;
                case '/becomePro':
                    path = '会员页';
                    break;
                default:
                    path = '其他页';
                    break;
            }
            sensors.track('h5_login_page_view', {
                entrance_source: path,
                from_our_platform: 'ponrh.ai',
                ref_name: 'pornh.ai:' + getHashUrlParams('ref')
            });
        }
    },
    { immediate: true }
);

const handleClick = () => {
    userStore.isPopupLogin = false;
    userStore.popupLoginTitle = 'Sign in';
};
// handle success event
const handleLoginSuccess = (response: CredentialResponse) => {
    login(response, 'google', 'Google');
};

// handle an error event
const handleLoginError = () => {
    console.error('Login failed');
    loginPlatform('Google', false, '第三方调取失败', '');
};

const googleLogin = () => {
    show.value = true;
    sensors.track('h5_loginpop_click', {
        node_name: 'Google',
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
};

const faceLogin = () => {
    sensors.track('h5_loginpop_click', {
        node_name: 'Facebook',
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
    // @ts-ignore
    // eslint-disable-next-line no-undef
    FB.getLoginStatus(function (response) {
        if (response.status !== 'connected') {
            // 未登录，fb会让用户登录
            // @ts-ignore
            // eslint-disable-next-line no-undef
            FB.login(res => {
                if (res.status === 'connected') {
                    login(response.authResponse, 'meta', 'Facebook');
                    // Logged into your webpage and Facebook.
                } else {
                    // loginPlatform('Facebook', false, '第三方调取失败', '');
                    // The person is not logged into your webpage or we are unable to tell.
                }
            });
        } else {
            login(response.authResponse, 'meta', 'Facebook');
        }
    });
};

const loginUser = async (): Promise<any> => {
    show.value = true;
    const params = {
        "clientId": "865493212580-9c83sstcubj35jid46s6i9mej6udsct0.apps.googleusercontent.com",
    "client_id": "865493212580-9c83sstcubj35jid46s6i9mej6udsct0.apps.googleusercontent.com",
    "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjNkNTgwZjBhZjdhY2U2OThhMGNlZTdmMjMwYmNhNTk0ZGM2ZGJiNTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4NjU0OTMyMTI1ODAtOWM4M3NzdGN1YmozNWppZDQ2czZpOW1lajZ1ZHNjdDAuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NjU0OTMyMTI1ODAtOWM4M3NzdGN1YmozNWppZDQ2czZpOW1lajZ1ZHNjdDAuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTIwNTU5ODIzNTUyODAxNjkyNTQiLCJlbWFpbCI6IjczNzgxNTg3MEBxcS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNzE4ODk3NjQ4LCJuYW1lIjoiVW5jbGUgV2FuZyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLb3lZTWRHcXNoQ2ZnMVh6RVFOZlpiWTdxVE4wR0VKWkdXVF9hZm1MMWQ3OXkyS1E9czk2LWMiLCJnaXZlbl9uYW1lIjoiVW5jbGUiLCJmYW1pbHlfbmFtZSI6IldhbmciLCJpYXQiOjE3MTg4OTc5NDgsImV4cCI6MTcxODkwMTU0OCwianRpIjoiYjc0YmNjZWRmZTI4NDQyNzMwNTc5MjA1YzkyNzM4NzA2YWJiMTkzZiJ9.EYG619IVEk55USRxXOhOGDiHpxLigbbKsXRnGzwxbZVY5UdjVeR2o2XEGHJS66MrsF6V8ZWRHNMFC5E3XwZQAk4yebXrjOu_iPaYF3LKofq2UU_96juWR_WnfqkW3leSzc9hUhafCOViifLbsrQdXwhY4bt7yaP5_X85GUYxCD8AV3l3MUJRReJmDxNFGSQBQ-FfTog27IEuEx5mUX7-Sai9SNLOemRnESCeOGeSwrQKdbAaKQL2KybhZEp_Avc_FtdL2WvyLjTpsSuXHHAUDzqYbD3Zw77yF5qUfyKiqeZNnqEc2fDj7YEkIERXTtB17vPDVp_MOhGfG3O26E1QSw",
    "select_by": "btn",
    "login_type": "google",
    "seed": 1718897949869,
    "apikey": "apikey_snijdpokfjf6hqh25",
    "sign": "43049F05767EEEDFC4B6F6F72BCEF0F8",
        bind_source: 1,
        ref_name: getHashUrlParams('ref')
    };
    const data: any = await userStore.getUserInfo(params);
    show.value = false;
    if (data.code === 200) {
        message.success('Login success');
        // router.push(`/`);
    } else {
        message.error(data.msg);
    }
};
const login = async (response: any, type: any, platform: any) => {
    show.value = true;
    console.log('(response: any, type: any, platform: any', response, type, platform);
    const param = response;
    param.login_type = type;
    const data: any = await userStore.getUserInfo(param);
    show.value = false;
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
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
};
</script>

<template>
    <div class="login">
        <NModal v-model:show="userStore.isPopupLogin" :on-after-leave="handleClick">
            <div>
                <NSpin :show="show">
                    <div w-384 bg-1A1E28 p-y-30 border-radius-22 center position-relative>
                        <img src="@/assets/images/close_icon.svg" position-absolute r-15 c-p t-15 square-24
                            class="close" @click="handleClick" />
                        <div>
                            <p color-fff fs-24 font-weight-bold> Welcome Back! </p>
                            <p color-fff fs-14 m-b-20 color-A1A1AA> Sign in to your account </p>
                            <p h-40 bg-ffffff border-radius-12 m-b-20 fs-15 color-333333 center c-p position-relative
                                @click="googleLogin">
                                <img square-22 m-r-12 src="@/assets/images/google.webp" />Sign in with Google
                                <GoogleSignInButton position-absolute left-80 top-5 h-100p op0 w-100p
                                    @success="handleLoginSuccess" @error="handleLoginError" />
                            </p>
                            <p h-40 bg-ffffff border-radius-12 m-b-20 fs-15 color-333333 center c-p @click="faceLogin">
                                <img square-22 m-r-12 src="@/assets/images/facebook.webp" />Sign in with Facebook
                            </p>
                            <p v-if="VITE_USER_NODE_ENV == 'dev'" h-40 bg-ffffff border-radius-12 m-b-20 fs-15
                                color-333333 center c-p @click="loginUser"> 模拟登陆1 </p>
                            <!-- <p color-ffffff fs-14 text-center m-b-12>Don't have an account？<span c-p color-8C80FF>Sign
                                    up</span></p> -->
                            <p color-coolGray fs-12 len-18 text-center>
                                By continuing，you agree to our <a
                                    href="https://cdn-mate.matelink.com/web/agreement-en.html" target="_blank"
                                    color-8C80FF style="border-bottom: 1px solid #8C80FF;">User Agreement</a> and<br>
                                <a href="https://cdn-mate.matelink.com/web/service-en.html" target="_blank" color-8C80FF
                                    style="border-bottom: 1px solid #8C80FF;">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </NSpin>
            </div>
        </NModal>
    </div>
</template>

<style lang="less"></style>
