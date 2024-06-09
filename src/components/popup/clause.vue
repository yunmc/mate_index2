<script lang="ts" setup>
    import { ref } from 'vue';
    let isConsent = ref(localStorage.getItem('consent'));
    const Consent = () => {
        localStorage.setItem('consent', 'true');
        isConsent.value = 'true';
    };
</script>

<template>
    <div class="clause" v-if="!isConsent">
        <div class="container">
            <img src="@/assets/images/age.svg" alt="" />
            <div class="cont">
                <p class="title">This site is for adults only! It contains only Al-generated adult content.</p>
                <p class="textCont">By entering this website, you confirm that you are 18 years old or more. By using the site, you agree to our Terms of Service. Our privacy policy details how we collect and use your data. We use cookies for basic analytics and spam detection. All content on this website are Al-generated! Any generations that resemble real people are purely coincidental. Terms and Conditions</p>
            </div>
            <div class="btn" @click="Consent">Confirm</div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.clause{
    position: fixed;
    width: 100%;
    height: 144px;
    left: 0;
    bottom: 0;
    z-index: 10;
    background: linear-gradient(271.2deg, #ED41B3 2.78%, #C95400 103.47%);
    .container{
        width: 1548px;
        margin: 10px auto;
        height: 124px;
        display: flex;
        align-items: center;
        img{
            margin-right: 9px;
            height: 100%;
        }
        .cont{
            color: #fff;
            flex: 1;
            margin-right: 280px;
            .title{
                font-size: 20px;
                font-weight: 900;
                margin-bottom: 10px
            }
            .textCont{
                font-size: 12px;
                line-height: 16px;
                font-weight: 500;
            }
        }
        .btn{
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
</style>
