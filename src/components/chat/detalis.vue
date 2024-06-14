<script lang="ts" setup>
import { NCarousel } from 'naive-ui';
import { useRouter } from 'vue-router';
const router = useRouter();
import { useChatStore } from '@/stores/chat';
import { getCurrentInstance, watch } from 'vue';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const app = getCurrentInstance();
const sensors = app?.appContext.config.globalProperties.$sensors;
const ChatStore = useChatStore();
const emit = defineEmits(['changePosition']);
const prevM = () => {
    emit('changePosition', 100);
};
watch(
    () => ChatStore.aiInfo,
    () => {
        if (ChatStore.aiInfo) {
            if (ChatStore.aiInfo.name) {
                sensors.track('h5_chat_page_view', {
                    entrance_source: 'AI详情页',
                    ai_name: ChatStore.aiInfo.name,
                    ai_id: ChatStore.aiInfo.ai_uid,
                });
            }
        }
    },
    { immediate: true }
);


const showPhoto = (): void => {
    ChatStore.isPopupPhoto = true;
};
</script>

<template>
    <div class="banner" v-if="ChatStore.aiInfo">
        <img src="@/assets/images/prev_icon.svg" class="prevM" @click="prevM" />
        <div class="mask" v-if="userStore.userInfo?.vip_info.vip_type == 0" @click="router.push('/becomePro')">
            <div class="btn" v-if="userStore.userInfo?.vip_info.vip_type == 0">Pro Unlock</div>
        </div>
        <NCarousel show-arrow v-if="ChatStore.aiInfo.posters">
            <img v-for="item in ChatStore.aiInfo.posters" :key="item" class="carousel-img" :src="item" />
            <template #arrow="{ prev, next }">
                <div class="custom-arrow" v-if="ChatStore.aiInfo.posters.length > 1" flex-between-center>
                    <img square-34 m-l-12 c-p class="prev" @click="prev" src="@/assets/images/arrow.webp" />
                    <img square-34 m-r-12 c-p class="next" @click="next" src="@/assets/images/arrow.webp" />
                </div>
            </template>
            <template #dots="{ total, currentIndex, to }">
                <ul class="custom-dots" center>
                    <li v-for="index of total" :key="index" :class="{ ['is-active']: currentIndex === index - 1 }"
                        @click="to(index - 1)" />
                </ul>
            </template>
        </NCarousel>
    </div>
    <div class="details" w-100p h-280 position-absolute bottom-0 left-0>
        <div p-y-20 p-x-15>
            <div color-fff fs-22 font-weight-bold flex-between-center m-b-10>
                {{ ChatStore.aiInfo.ai_name }}
                <p flex-end-center>
                    <img square-18 src="@/assets/images/hot.webp" /><span color-fff fs-16 m-l-4>{{ ChatStore.aiInfo.heat
                        }}</span>
                </p>
            </div>

            <div class="tag" flex-flex-start-center flex-wrap>
                <span v-for="item in ChatStore.aiInfo.tags" :key="item" fs-12 p-x-12 p-y-6>{{ item }}</span>
                <span v-for="item in ChatStore.aiInfo.common_tags" :key="item" fs-12 p-x-12 p-y-6>{{ item.tag_name }}</span>
            </div>
            <div color-fff fs-24 line-height-32>introduce</div>
            <div class="introduce" m-t-10 fs-14 line-height-24>
                {{ ChatStore.aiInfo.ai_desc }}
            </div>
        </div>
        <div class="photoBtn" @click="showPhoto">{{ ChatStore.aiInfo.ai_name }}'s Gallery</div>
    </div>
    <!-- </div> -->
</template>

<style lang="less" scoped>
.banner {
    height: calc(100vh - 280px);
    .prevM{
        display: none;
    }

    .mask {
        width: 100%;
        height: calc(100vh - 280px);
        position: absolute;
        background: rgba(255, 255, 255, 0.5);
        left: 0;
        top: 0;
        z-index: 3;
        backdrop-filter: blur(20px);

        .btn {

            position: absolute;
            top: 46%;
            left: 50%;
            width: 100%;
            margin-left: -90px;
            width: 180px;
            height: 60px;
            border-radius: 60px;
            border: 1px solid #FFAD28;
            text-align: center;
            font-size: 28px;
            cursor: pointer;
            color: #FFA635;
            line-height: 56px;
            background: rgba(0, 0, 0, 0.2);
        }
    }
}

.carousel-img {
    width: 100%;
    object-fit: cover;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.details {
    background: url(@/assets/images/detalis_bg.webp) no-repeat;
    background-size: 100% 100%;
    z-index: 5;

    .photoBtn {
        width: 377px;
        height: 68px;
        background: linear-gradient(114.24deg, #FFB524 16.28%, #FF8C39 94.9%);
        font-family: Poppins;
        font-size: 20px;
        font-weight: 700;
        line-height: 30px;
        text-align: center;
        line-height: 68px;
        border-radius: 24px;
        margin: 0 auto;
        cursor: pointer;
    }
}

.tag {
    span {
        border-radius: 30px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        color: rgba(255, 255, 255, 0.75);
        margin-bottom: 6px;
        margin-right: 6px;
    }
}

.introduce {
    color: rgba(255, 255, 255, 0.8);
}

.custom-arrow {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    z-index: 2;

    .next {
        transform: scaleX(-1) scaleY(-1);

        &:hover {
            opacity: 0.5;
        }
    }


    .prev {
        &:hover {
            opacity: 0.5;
        }
    }
}

.custom-dots {
    position: absolute;
    left: 0;
    bottom: 80px;
    width: 100%;

    li {
        width: 8px;
        height: 8px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        margin: 0 3px;

        &::marker {
            content: '';
        }
    }

    .is-active {
        background: rgba(255, 255, 255, 1);
    }
}
@media screen and (max-width: 768px){
    .banner{
        .prevM{
            display: block;
            position: absolute;
            top: 0.14rem;
            left: 0.08rem;
            z-index: 10;
        }
    }
}
</style>
