<script lang="ts" setup>
import { ref, getCurrentInstance } from 'vue';
import { useUserStore } from '@/stores/user';
import { getHashUrlParams } from '@/utils/common';
let isConsent = ref(localStorage.getItem('consent'));
const userStore = useUserStore();
const app = getCurrentInstance();
const sensors = app?.appContext.config.globalProperties.$sensors;
const Consent = () => {
    sensors.track('h5_homepage_click', {
        node_name: '满18岁确认',
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
    localStorage.setItem('consent', 'true');
    isConsent.value = 'true';
    if (!userStore.Token) {
        // userStore.isPopupLogin = true;
        
    userStore.isAdult = true;
    }
};
</script>

<template>
    <div class="clause" v-if="!isConsent">
        <div class="container">
            <img src="@/assets/images/age.svg" alt="" />
            <div class="cont">
                <p class="title">This site is for adults only! It contains only Al-generated adult content.</p>
                <p class="textCont">By entering this website, you confirm that you are 18 years old or more. By using
                    the site, you agree to our Terms of Service. Our privacy policy details how we collect and use your
                    data. We use cookies for basic analytics and spam detection. All content on this website are
                    Al-generated! Any generations that resemble real people are purely coincidental. Terms and
                    Conditions</p>
            </div>
            <div class="btn" @click="Consent">Confirm</div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.clause {
    position: fixed;
    width: 100%;
    min-height: 144px;
    left: 0;
    bottom: 0;
    z-index: 10;
    background: linear-gradient(271.2deg, #ED41B3 2.78%, #C95400 103.47%);

    .container {
        width: 1548px;
        margin: 10px auto;
        min-height: 124px;
        display: flex;
        align-items: center;

        img {
            margin-right: 9px;
            height: 100%;
        }

        .cont {
            color: #fff;
            flex: 1;
            margin-right: 14.5vw;

            .title {
                font-size: 20px;
                font-weight: 900;
                margin-bottom: 10px
            }

            .textCont {
                font-size: 12px;
                line-height: 16px;
                font-weight: 500;
            }
        }

        .btn {
            width: 177px;
            height: 48px;
            border-radius: 24px;
            background: linear-gradient(114.24deg, #FFB524 16.28%, #FF8C39 94.9%);
            font-size: 20px;
            font-weight: 700;
            color: #030303;
            text-align: center;
            line-height: 48px;
            margin-left: auto;
            cursor: pointer;
        }
    }
}
@media screen and (max-width: 768px){
    
.clause {
    min-height: auto;
    border-radius: 24px 24px 0px 0px;
    padding: 0 0.35rem;

    .container {
        width: 100%;
        display: block;

        img {
            margin: 0.22rem auto 0.1rem;
            width: 1.16rem;
            height: auto;
            display: block;
        }

        .cont {
            margin-right: 0;

            .title {
                font-size: 0.18rem;
                margin-bottom: 0.18rem;
                text-align: center;
            }

            .textCont {
                font-size: 0.11rem;
                line-height: 0.15rem;
            }
        }

        .btn {
            width: 1.87rem;
            height: 0.48rem;
            border-radius: 0.24rem;
            font-size: 0.2rem;
            line-height: 0.48rem;
            margin: 0.2rem auto;
        }
    }
}
}
</style>
