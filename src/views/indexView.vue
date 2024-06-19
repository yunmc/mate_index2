<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from 'vue';
import { NImage, NSpin } from 'naive-ui';
import { useUserStore } from '@/stores/user';
import { useHomeStore } from '@/stores/home';
import { useChatStore } from '@/stores/chat';
import { useRouter } from 'vue-router';
import { getUrlParams, getHashUrlParams } from '@/utils/common';
import { getBanner } from '@/api/home/index';
const router = useRouter();
const userStore = useUserStore();
const homeStore = useHomeStore();
const ChatStore = useChatStore();
const app = getCurrentInstance();
const sensors = app?.appContext.config.globalProperties.$sensors;

const bannerInfo = ref({} as any);
const _getBanner = async () => {
    const params = {
        channel_name: getHashUrlParams('ref')
    };
    const data: any = await getBanner(params);
    if (data.code === 200) {
        bannerInfo.value = data.data;
    }
};
const toDetails = (item: any, type: number) => {
    //记录当前滚动条位置
    // if (!userStore.Token) {
    //     userStore.isPopupLogin = true;
    // } else if (item) {
    if (type == 1) {
        sensors.track('h5_banner_click', {
            from_our_platform: 'ponrh.ai',
            ref_name: 'pornh.ai:' + getHashUrlParams('ref')
        });
        sensors.track('h5_chat_page_view', {
            entrance_source: 'banner',
            ai_name: item.name,
            ai_id: item.ai_uid,
            is_login: userStore.Token ? '是' : '否',
            from_our_platform: 'ponrh.ai',
            ref_name: 'pornh.ai:' + getHashUrlParams('ref')
        });
    } else {
        sensors.track('h5_chat_page_view', {
            entrance_source: '角色',
            ai_name: item.name,
            ai_id: item.ai_uid,
            is_login: userStore.Token ? '是' : '否',
            from_our_platform: 'ponrh.ai',
            ref_name: 'pornh.ai:' + getHashUrlParams('ref')
        });
    }
    ChatStore.setAiInfo(item);
    sensors.track('h5_AI_node_click', {
        node_name: 'AI聊天',
        ai_name: item.name,
        ai_id: item.ai_uid,
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
    setTimeout(() => {
        router.push(`/chat`);
        sensors.track('h5_AI_node_click', {
            node_name: 'AI详情',
            ai_name: item.name,
            ai_id: item.ai_uid,
            from_our_platform: 'ponrh.ai',
            ref_name: 'pornh.ai:' + getHashUrlParams('ref')
        });
    }, 300);
    // }
};
const gotoDevin = () => {
    const devin = homeStore.list.find((item: any) => item.ai_uid === 'ai_user_f9f55d887c3c453ebf4b00f7');
    if (!devin) return;
    toDetails(devin, 2);
};

onMounted(() => {
    console.log(getHashUrlParams('ref'), 'getHashUrlParams')
    _getBanner()
    if (homeStore.list.length < 1) {
        homeStore.getList();
    }
    if (getUrlParams('type')) {
        userStore.payType = true;
    }
    sensors.track('h5_homepage_view', {
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
    var scrollPosition = localStorage.getItem('scrollPosition');
    setTimeout(() => {
        if (scrollPosition) {
            mainRef.value.scrollTop = scrollPosition;
        }
    }, 100);
});
const mainRef = ref(null);
const handleScroll = (event: any) => {
    const scrollHeight = event.target.scrollHeight;
    const scrollTop = event.target.scrollTop;
    const clientHeight = event.target.clientHeight;
    localStorage.setItem('scrollPosition', event.target.scrollTop);
    if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (!homeStore.loading && !homeStore.finish) {
            homeStore.page++;
            homeStore.getList();
        }
    }
};
const audio = ref();
const audioUrl = ref('https://cdn-mate.matelink.com/audio/source/audio_cf355ab59d2044d9bbf91e348a.mp3');
const onMouseenter = (item: any) => {
    // console.log('11111111');
    item.enterShow = true;
    item.leaveShow = false;
    audioUrl.value = item.voice_introduct;
    if (audio.value) {
        audio.value.load();
        audio.value.play();
    }
    if (video$ref.value[`video#${item.name}`]) {
        const $video = video$ref.value[`video#${item.name}`];
        // @todo：mouseenter 事件仍然会提示需要用户交互才能进行播放。
    }
};
const onMouseleave = (item: any) => {
    item.enterShow = false;
    item.leaveShow = true;
    if (audio.value.play) {
        audio.value.pause();
    }
    audioUrl.value = '';
};
const video$ref = ref({} as any);
const handle$ref = (e, item) => {
    if (!e) return;
    video$ref.value[`video#${item.name}`] = e;
};
const url = 'https://yinhehh.oss-cn-beijing.aliyuncs.com/upload/2K/A%E4%BC%A4%E5%BF%83%E7%A6%BB%E5%BC%80%201-46%201-38%201-40.mp4';
</script>

<template>
    <div p-t-20 m-a p-b-20 h-100p overflow-auto class="main" ref="mainRef" @scroll="handleScroll">
        <audio control ref="audio" loop>
            <source :src="audioUrl" type="audio/mpeg" />
        </audio>
        <div max-w-1380 m-a>
            <img v-if="!getHashUrlParams('ref')" src="@/assets/images/banner.png" w-100p m-b-40 c-p class="banner"
                @click="gotoDevin()" />
            <img v-else :src="bannerInfo.banner_url" w-100p m-b-40 c-p class="banner"
                @click="toDetails(bannerInfo, 1)" />
            <div d-grid justify-content-space-between style="grid-template-columns: repeat(auto-fill, 262px)"
                class="listBox">
                <div v-for="item in homeStore.list" :key="item.name">
                    <div :class="[item.enterShow ? 'animate__pulse__diy' : '', item.leaveShow ? 'animate__subse__diy' : '', 'boxplus']"
                        @mouseenter="onMouseenter(item)" @mouseleave="onMouseleave(item)" transition-ease-in-out w-262
                        h-420 border-radius-20 overflow-hidden position-relative m-b-18 c-p @click="toDetails(item, 2)">
                        <div position-absolute w-76 h-34 r-18 t-18 fs-14 center color-fff class="chat"> Chat <img m-l-3
                                square-12 src="@/assets/images/fly.webp" /> </div>
                        <!-- 视频 -->
                        <video-player v-if="item.introduce_video" class="c-video-player" :ref="e => handle$ref(e, item)"
                            :width="262" :height="420" :src="item.introduce_video" :poster="item.introduce_video_cover"
                            :autoplay="true" :muted="true" :loop="true" />
                        <!-- 图片 -->
                        <NImage v-else-if="item.introduce_image" width="262" height="420" preview-disabled
                            object-fit="cover" :src="item.introduce_image" />
                        <div class="bg" position-absolute w-100p left-0 p-b-16 bottom-0 p-x-15 color-ffffff>
                            <img class="play" w-62 src="@/assets/images/paly.webp" />
                            <div fs-21 font-weight-bold m-b-12 line-height-20 class="title">
                                {{ item.name }}
                            </div>
                            <div fs-12 len-16 m-b-10 class="moment">
                                {{ item.ai_desc ? item.ai_desc : item.introduce }}
                            </div>
                            <div flex-flex-start-center flex-wrap>
                                <p v-for="t in item.tags" :key="t" p-x-8 p-y-4 fs-10 center m-r-4 m-t-4 class="tab_bg">
                                    {{ t }}
                                </p>
                                <p v-for="t in item.common_tags" :key="t" p-x-8 p-y-4 fs-10 center m-r-4 m-t-4 class="tab_bg">
                                    {{ t.tag_name }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div center m-y-10 v-if="homeStore.loading">
                <NSpin size="medium" />
            </div>
            <div v-if="homeStore.finish" center m-y-10 color-fff> -.- </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.tab_bg {
    background: rgba(255, 255, 255, 0.16);
    border-radius: 12px;
}

.bg {
    background: linear-gradient(180deg, rgba(53, 37, 75, 0) 0%, rgba(64, 42, 39, 1) 80%);
}

.virtualListInst {
    display: grid;
    grid-template-columns: repeat(auto-fill, 262px);
}

.main {
    scroll-behavior: smooth;

    .banner {
        height: 418px;
    }
}

.boxplus {
    border: solid 1px #FFB524;

    .chat {
        background: linear-gradient(113deg, #8d2cff 7%, #ee2f5d 50%, #ff27d0 100%);
        backdrop-filter: blur(7.5px);
        border-radius: 16.5px;
        font-weight: bold;
        opacity: 0;
    }

    .play {
        display: none;
    }

    &:hover .chat {
        opacity: 1;
    }

    &:hover .play {
        display: block;
    }
}

@-webkit-keyframes pulses {
    from {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }

    to {
        -webkit-transform: scale3d(1.05, 1.05, 1.05);
        transform: scale3d(1.05, 1.05, 1.05);
    }
}

@keyframes pulses {
    from {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }

    to {
        -webkit-transform: scale3d(1.05, 1.05, 1.05);
        transform: scale3d(1.05, 1.05, 1.05);
    }
}

@-webkit-keyframes subses {
    from {
        -webkit-transform: scale3d(105%, 105%, 105%);
        transform: scale3d(105%, 105%, 105%);
    }

    to {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
}

@keyframes subses {
    from {
        -webkit-transform: scale3d(105%, 105%, 105%);
        transform: scale3d(105%, 105%, 105%);
    }

    to {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
}

.animate__pulse__diy {
    -webkit-animation-name: pulses;
    animation-name: pulses;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
    animation: pulses 0.3s;
    animation-fill-mode: both;
    border: 1px solid #FFB524 !important;
}

.animate__subse__diy {
    -webkit-animation-name: subses;
    animation-name: subses;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
    animation: subses 0.4s;
    animation-fill-mode: both;
    border: solid 1px #FFB524;
}

.moment {
    display: -webkit-box;
    /* WebKit内核浏览器支持 */
    -webkit-line-clamp: 3;
    /* 显示三行 */
    -webkit-box-orient: vertical;
    /* 垂直方向展示 */
    overflow: hidden;
    /* 超出部分隐藏 */
    text-overflow: ellipsis;
    /* 显示省略号 */
}

.c-video-player {
    ::v-deep img {
        object-fit: cover;
    }

    ::v-deep video {
        object-fit: cover;
    }
}

@media screen and (max-width: 768px) {
    .main {
        padding: 0.05rem 0.08rem;

        .banner {
            width: 100%;
            height: 1.72rem;
            margin-bottom: 0.08rem;
        }
        .title{
            font-size: 0.15rem;
            margin-bottom: 0.07rem;
        }
        .moment{
            font-size: 0.1rem;
            line-height: 0.12rem;
        }

        .listBox {
            grid-template-columns: repeat(auto-fill, 1.83rem) !important;
        }

        .boxplus {
            width: 1.83rem;
            height: 2.93rem;
        }
    }
}
</style>
