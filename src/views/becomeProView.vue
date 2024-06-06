<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { NGi, NGrid, NSpin } from 'naive-ui';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
const userStore = useUserStore();
const oredrStore = useOrderStore();
const show = ref(false);
const mealList = reactive([
    {
        product_name: "Monthly",
        product_id: "mateLink.paypal.month.pro.plan", // 产品ID
        rawPrice: 19.99, // 金额大小
        currencyCode: "USD", // 金额类别
        pay_platform: "paypal_sub", //订阅平台 一定要是这个
        active: true,
        popular: false,
        months:1
    }, {
        product_name: "Yearly",
        product_id: "mateLink.paypal.year.pro.plan", // 产品ID
        rawPrice: 5.83, // 金额大小
        currencyCode: "USD", // 金额类别
        pay_platform: "paypal_sub", //订阅平台 一定要是这个
        active: false,
        popular: true,
        months:12
    }
])
const active = ref(mealList[0])
const choosePlan = (item: any, i: number) => {
    mealList.forEach((item: any) => {
        item.active = false;
    });
    mealList[i].active = true;
    active.value = item;
};
const paypal = async () => {
    show.value = true;
    const data: any = await oredrStore.getProPay({
        product_id: active.value.product_id, // 产品ID
        rawPrice: active.value.rawPrice * active.value.months, // 金额大小
        currencyCode: "USD", // 金额类别
        pay_platform: "paypal_sub", //订阅平台 一定要是这
        is_web: true
    });
    show.value = false;
    if (data.code == 200 && data.data.approve_url != '') {
        console.log(data.data.approval_url)
        window.location.href = data.data.approval_url;
    }
};
</script>

<template>
    <div class="becomePro">
        <div class="proCont">
            <NSpin :show="show">
                <div class="proContLeft">
                    <p class="title">
                        <img src="@/assets/images/title_bg.svg" alt="" />
                        <span>Choose your Plan</span>
                    </p>
                    <p class="desc">You can cancel anytime, privacy in bank statement</p>
                    <div class="mealList">
                        <div v-for="(item, i) in mealList" :class="item.active ? 'mealCont active' : 'mealCont'"
                            @click="choosePlan(item, i)">
                            <p class="productName">{{ item.product_name }}</p>
                            <p class="productPrice"><span>${{ item.rawPrice }}</span> / month</p>
                            <p class="tips" v-if="item.popular">Popular</p>
                        </div>
                    </div>
                    <p class="btn" @click="paypal">Subscribe</p>
                </div>
            </NSpin>
            <div class="proContRight">
                <p class="title">Pro Benefits</p>
                <div class="benefitsList">
                    <p>
                        <img src="@/assets/images/tick_icon.svg" alt="" />
                        <span>Get <span class="label">2000</span> <img src="@/assets/images/gold_icon.svg" alt="" />
                            at
                            once</span>
                    </p>
                    <p>
                        <img src="@/assets/images/tick_icon.svg" alt="" />
                        <span>Get <span class="label">680</span> <img src="@/assets/images/gold_icon.svg" alt="" />
                            by
                            X2 daily bonus</span>
                    </p>
                    <p>
                        <img src="@/assets/images/tick_icon.svg" alt="" />
                        <span>Advanced Pictures Unlocked</span>
                    </p>
                    <p>
                        <img src="@/assets/images/tick_icon.svg" alt="" />
                        <span>All Messages Unblocked</span>
                    </p>
                    <p>
                        <img src="@/assets/images/tick_icon.svg" alt="" />
                        <span>Listen to Voice Messages</span>
                    </p>
                    <p>
                        <img src="@/assets/images/tick_icon.svg" alt="" />
                        <span>Intimate Date and Group Chat</span>
                    </p>
                    <p>
                        <img src="@/assets/images/tick_icon.svg" alt="" />
                        <span>Remove Ads </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.becomePro {
    width: 100%;
    height: 100%;
    background: #13102b;
    overflow: hidden;

    .proCont {
        width: 960px;
        height: 600px;
        margin: 142px auto 0;
        display: flex;

        .proContLeft {
            color: #fff;
            width: 590px;

            .title {
                position: relative;
                margin-bottom: 40px;

                img {
                    position: absolute;
                    top: 75%;
                    left: 50%;
                    transform: translateX(-50%);
                }

                span {
                    font-size: 54px;
                    font-weight: 700;
                    position: relative;
                    z-index: 1;
                    text-align: center;
                    display: inline-block;
                    width: 100%;
                }
            }

            .desc {
                font-size: 24px;
                line-height: 34px;
                font-weight: 600;
            }

            .mealList {
                .mealCont {
                    width: 500px;
                    height: 155px;
                    box-sizing: border-box;
                    padding: 16px 32px;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    margin-top: 24px;
                    cursor: pointer;
                    position: relative;

                    .productName {
                        font-size: 30px;
                        font-weight: 700;
                        color: #FF8C39;
                    }

                    .productPrice {
                        line-height: 70px;
                        font-size: 30px;
                        font-weight: 700;
                        color: #AAA6A1;

                        span {
                            font-size: 50px;
                            font-weight: 600;
                            color: #fff;
                        }
                    }

                    .tips {
                        width: 94px;
                        height: 34px;
                        border-radius: 12px;
                        box-sizing: border-box;
                        background: linear-gradient(135.85deg, #FFCC00 37.93%, #EB34C3 99.56%);
                        text-align: center;
                        color: #fff;
                        font-size: 18px;
                        font-weight: 600;
                        line-height: 34px;
                        position: absolute;
                        top: -10px;
                        right: 20px;
                    }
                }

                .active {
                    background: linear-gradient(114.24deg, rgba(255, 181, 36, 0.1) 16.28%, rgba(255, 140, 57, 0.1) 94.9%);
                    border: 2px solid #FFCC00;
                }
            }

            .btn {
                width: 500px;
                height: 68px;
                border-radius: 24px;
                background: linear-gradient(114.24deg, #FFB524 16.28%, #FF8C39 94.9%);
                margin-top: 32px;
                font-size: 24px;
                font-weight: 700;
                text-align: center;
                line-height: 68px;
                color: #000;
                cursor: pointer;
            }
        }

        .proContRight {
            margin-top: 183px;
            flex: 1;

            .title {
                color: #FFB524;
                font-size: 36px;
                font-weight: 700;
                padding-left: 36px;
            }

            .benefitsList {
                p {
                    height: 30px;
                    color: #fff;
                    margin-top: 17px;
                    display: flex;
                    align-items: center;

                    img {
                        margin-right: 4px;
                    }

                    span {
                        font-size: 18px;
                        font-weight: 600;

                        img {
                            margin-right: 0;
                        }
                    }

                    .label {
                        color: #D62F86;
                    }
                }
            }
        }
    }
}
@media screen and (max-width: 768px) {
    .becomePro {
        .proCont {
            width: 100%;
            height: auto;
            padding: 0 0.29rem;
            margin: 0;
            display: block;
            .proContLeft{
                width: 100%;
                .title{
                    margin-bottom: 0.1rem;
                    img{
                        width: 60%;
                    }
                    span{
                        font-size: 0.35rem;
                    }
                }
                .desc{
                    font-size: 0.16rem;
                    line-height: 0.22rem;
                }
                .mealList{
                    display: flex;
                    justify-content: space-between;
                    .mealCont{
                        width: 1.58rem;
                        padding: 0.1rem 0 0.1rem 0.2rem;
                        margin-top: 0.21rem;
                        .productName{
                            font-size: 0.2rem;
                        }
                        .productPrice{
                            font-size: 0.2rem;
                            line-height: 1;
                            span{
                                font-size: 0.33rem;
                            line-height: 0.48rem;
                            }
                        }
                        .tips{
                            width: 0.6rem;
                            height: 0.22rem;
                            border-radius: 0.08rem;
                            font-size: 0.12rem;
                            line-height: 0.22rem;
                            right: 0;
                            top: -0.12rem;
                        }
                    }
                }
                .btn{
                    width: 100%;
                    height: 0.45rem;
                    border-radius: 0.22rem;
                    margin-top: 0.2rem;
                    font-size: 0.16rem;
                    line-height: 0.45rem;
                }
            }
            .proContRight{
                margin-top: 0.2rem;
                width: 100%;
                .title{
                    font-size: 0.36rem;
                    padding-left: 0.38rem;

                }
                .benefitsList{
                    p{
                        margin-top: 0.12rem;
                        height: 0.3rem;
                        img{
                            width: 0.24rem;
                        }
                        span{
                            font-size: 0.18rem;
                        }
                    }
                }
            }
        }
    }
    
}
</style>