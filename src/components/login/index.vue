<script lang="ts" setup>
import { ref, getCurrentInstance, watch } from 'vue';
import { GoogleSignInButton, type CredentialResponse } from 'vue3-google-signin';
import { useRouter } from 'vue-router';
import { NModal, useMessage, NSpin } from 'naive-ui';
import { useUserStore } from '@/stores/user';
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
            sensors.track('h5_login_page_view', {
                entrance_source: '首页登录',
            });
        }
    },
    { immediate: true }
);

const handleClick = () => {
    userStore.isPopupLogin = false;
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
    });
};

const faceLogin = () => {
    sensors.track('h5_loginpop_click', {
        node_name: 'Facebook',
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
        "clientId": "742137325913-j6tn2dk96v128bl7ocuf1j633nmkih8r.apps.googleusercontent.com",
        "client_id": "742137325913-j6tn2dk96v128bl7ocuf1j633nmkih8r.apps.googleusercontent.com",
        "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY3NGRiYmE4ZmFlZTY5YWNhZTFiYzFiZTE5MDQ1MzY3OGY0NzI4MDMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3NDIxMzczMjU5MTMtajZ0bjJkazk2djEyOGJsN29jdWYxajYzM25ta2loOHIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3NDIxMzczMjU5MTMtajZ0bjJkazk2djEyOGJsN29jdWYxajYzM25ta2loOHIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTIwNTU5ODIzNTUyODAxNjkyNTQiLCJlbWFpbCI6IjczNzgxNTg3MEBxcS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNzE3NTcxNDQ5LCJuYW1lIjoiVW5jbGUgV2FuZyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLb3lZTWRHcXNoQ2ZnMVh6RVFOZlpiWTdxVE4wR0VKWkdXVF9hZm1MMWQ3OXkyS1E9czk2LWMiLCJnaXZlbl9uYW1lIjoiVW5jbGUiLCJmYW1pbHlfbmFtZSI6IldhbmciLCJpYXQiOjE3MTc1NzE3NDksImV4cCI6MTcxNzU3NTM0OSwianRpIjoiNTBiN2NjOWYzZmU3MjFmNWZkNDU4MWRiNjU2ZmIwODExOTRjMDliMSJ9.XNhN3170Ad_Iw3hE-agVTk0-_Y2TzMpKQyS8SyofazasUq0hmKbqfcTGwasA56SUQKxYebtYbZfKylj0CFOoIw5stqpi2ROYUSft6HUoTV6QMISD5McfRfJqqT_jv5jPiWtn6XcA9fsatFLS7ovuxFcwyxO1YZ0Tk4mG2z7OKVs6nXstYd90_h3GxOG0HZUcr2lXOSfjkwjevfWzxVf0dfDm-ahz6C-TEvq_QZ-ZdnuT6nYc6yKD-wq6gKtDHDoUMHFx8mjO_4GuCyMrLn2htXOw1ApvOsppAMrMJLOUetEgKNWwi6IQDnc3M-gWYR6FEdQw2-H6hBojSitYwGMifA",
        "select_by": "btn",
        "login_type": "google",
        "seed": 1717571750783,
        "apikey": "apikey_47gd4km58q7ef19to",
        "sign": "3BD3B8DA9215FD9DA8339A2FCD7AF3A4",
        bind_source: 1,
        ref_name: 'testname_01'
    };
    const data: any = await userStore.getUserInfo(params);
    show.value = false;
    if (data.code === 200) {
        message.success('Login success');
        router.push(`/`);
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
    });
};
</script>

<template>
    <div class="login">
        <NModal v-model:show="userStore.isPopupLogin" :on-after-leave="handleClick">
            <div>
                <p color-fff fs-34 font-weight-bold text-center> Welcome Back! </p>
                <p color-fff fs-24 m-b-20 text-center> Sign in to your account </p>
                <NSpin :show="show">
                    <div w-456 h-286 bg-313255 border-radius-22 center>
                        <div>
                            <p w-350 h-50 bg-ffffff border-radius-12 m-b-20 fs-15 color-333333 center c-p
                                position-relative @click="googleLogin">
                                <img square-22 m-r-12 src="@/assets/images/google.webp" />Sign in with Google
                                <GoogleSignInButton position-absolute left-80 top-5 h-100p op0 w-100p
                                    @success="handleLoginSuccess" @error="handleLoginError" />
                            </p>
                            <p w-350 h-50 bg-ffffff border-radius-12 m-b-20 fs-15 color-333333 center c-p
                                @click="faceLogin">
                                <img square-22 m-r-12 src="@/assets/images/facebook.webp" />Sign in with Facebook
                            </p>
                            <p v-if="VITE_USER_NODE_ENV == 'dev'" w-350 h-50 bg-ffffff border-radius-12 m-b-20 fs-15
                                color-333333 center c-p @click="loginUser"> 模拟登陆1 </p>
                            <p w-329 color-coolGray fs-13 len-18 text-center>
                                By continuing，you agree to our <a
                                    href="https://cdn-mate.matelink.com/web/agreement-en.html" target="_blank"
                                    color-8C80FF>User Agreement</a> and
                                <a href="https://cdn-mate.matelink.com/web/service-en.html" target="_blank"
                                    color-8C80FF>Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </NSpin>
            </div>
        </NModal>
    </div>
</template>

<style lang="less"></style>
