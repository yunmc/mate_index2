<script lang="ts" setup>
import { ref, nextTick, watch, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
import { NConfigProvider, NImage, NInput, useMessage, NSpin, NScrollbar, NModal } from 'naive-ui';
import { useChatStore } from '@/stores/chat';
import { randomRange } from '@/utils/common';
import { useUserStore } from '@/stores/user';
import { verifySend, getMsgPlayer } from '@/api/chat';
import { getHashUrlParams } from '@/utils/common';
const app = getCurrentInstance();
const sensors = app?.appContext.config.globalProperties.$sensors;
const userStore = useUserStore();
const ChatStore = useChatStore();
const message = ref('');
const useMsg = useMessage();
const iskey = ref(false);
const emit = defineEmits(['changePosition']);
const next = () => {
    emit('changePosition', 200);
};
const prev = () => {
    emit('changePosition', 0);
};
const props = defineProps({
    changeStatus: {
    type: Number
  }
});
watch(() => props.changeStatus, (newValue) => {
    message.value = '';
});
const openApp = async (item: any) => {

    sensors.track('h5_AI_function_click', {
        node_name: '语音消息',
        ai_name: ChatStore.aiInfo.name,
        entrance_source: '消息列表',
        ai_id: ChatStore.aiInfo.ai_uid,
        is_login: userStore.Token ? '是' : '否',
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
    // if (name != '') {
    //     sensors.track('h5_AI_function_click', {
    //         node_name: name,
    //         ai_name: ChatStore.aiInfo.name,
    //         ai_id: ChatStore.aiInfo.ai_uid,
    //     });
    //     sensors.track('h5_download_pop', {
    //         entrance_source: name,
    //     });
    // } else {
    //     sensors.track('h5_AI_chat_msg_voice', {
    //         ai_name: ChatStore.aiInfo.name,
    //         ai_id: ChatStore.aiInfo.ai_uid,
    //     });
    //     sensors.track('h5_download_pop', {
    //         entrance_source: 'chat',
    //     });
    // }
    // if (name != 'Selfie') {
    //     ChatStore.isPopupDl = true;
    // }
    if (userStore.userInfo?.vip_info.vip_type == 0) {
        sensors.track('h5_voice_pop_view', {
            from_our_platform: 'ponrh.ai',
            ref_name: 'pornh.ai:' + getHashUrlParams('ref')
        });
        // router.push('/becomePro');
        voiceDialog.value = true;
    } else {

        const params = {
            msg_id: item.content.data.extra.messageId
        };
        const data: any = await getMsgPlayer(params);
        // data.data.url = 'https://cdn-mate.flyai.com/results/cd28fc18cc25753d2a748fc5bc5cbdfb.mp3'
        if (data.code == 200) {
            const audio = new Audio(data.data.url);
            audio.play();
        } else {
            useMsg.error(data.msg);
        }
    }
};
watch(
    () => ChatStore.chatList,
    () => {
        if (!ChatStore.isScroll) {
            return false;
        }
        nextTick(() => {
            handleScrollToPosition();
        });
    },
    { deep: true }
);
const loadRequest = ref(false);
const loadSend = ref(false);
const sendMessage = async () => {
    const params = {
        ai_uid: ChatStore.aiInfo.ai_uid
    };
    const data: any = await verifySend(params);
    // data.data.wake_up_in = 0
    // userStore.userInfo.vip_info.vip_type = 1
    if (data.data.wake_up_in > 0) {
        if(userStore.userInfo.vip_info.vip_type == 0){
            sensors.track('h5_msg_pro_limit', {
                from_our_platform: 'ponrh.ai',
                ref_name: 'pornh.ai:' + getHashUrlParams('ref')
            });
        }
        interdictDialog.value = true;
        sensors.track('h5_msg_limit_view', {
            from_our_platform: 'ponrh.ai',
            ref_name: 'pornh.ai:' + getHashUrlParams('ref')
        });
        return;
    }
    if (message.value != '' && ChatStore.isSend == 0) {
        loadSend.value = true;
        const params = {
            targetId: ChatStore.aiInfo?.ai_uid,
            content: {
                content: message.value,
                extra: {
                    messageId: randomRange(10),
                    dataType: 'text',
                    data: {
                        context: message.value,
                    },
                },
            },
        };
        ChatStore.isSend = 1;
        const response: any = await ChatStore.getChatV3(params);
        loadSend.value = false;
        if (response.code == 200) {
            ChatStore.chatList.push({
                content: {
                    data: {
                        targetId: ChatStore.aiInfo?.ai_uid,
                        content: {
                            content: message.value,
                        },
                        extra: {
                            messageId: randomRange(10),
                            dataType: 'text',
                            data: {
                                context: message.value,
                            },
                        },
                    },
                    description: '',
                    extension: '',
                },
                to: ChatStore.aiInfo?.ai_uid,
            });
            ChatStore.chatIm.sendToAiText({
                targetId: ChatStore.aiInfo?.ai_uid,
                content: {
                    content: message.value,
                },
                extra: {
                    messageId: randomRange(10),
                    dataType: 'text',
                    data: {
                        context: message.value,
                    },
                },
            });
            message.value = '';
            ChatStore.isSend = 2;
        }
    }
};

const unlockImage = async (item: any, index: any) => {
    loadRequest.value = true;
    ChatStore.isScroll = false;
    const response: any = await ChatStore.getUnlockImage(item, index);
    loadRequest.value = false;
    if (response.code != 200) {
        if (response.code == 1011) {
            //余额不足
            ChatStore.isPopupCoin = true;
        } else {
            useMsg.error(response.msg);
        }
    }
    nextTick(() => {
        ChatStore.isScroll = false;
    });
};

const chatLike = async (item: any, index: any, type: any) => {
    loadRequest.value = true;
    const response: any = await ChatStore.getChatLike(item, index, type);
    loadRequest.value = false;
    if (response.code != 200) {
        useMsg.error(response.msg);
    }
    nextTick(() => {
        ChatStore.isScroll = false;
    });
};

const sendSelfie = async () => {
    loadRequest.value = true;
    const response: any = await ChatStore.getSendSelfie();
    loadRequest.value = false;
    if (response.code != 200) {
        // response.code = 1011;
        if (response.code == 1011) {
            //余额不足
            ChatStore.isPopupCoin = true;
        } else {
            useMsg.error(response.msg);
        }
    }
    nextTick(() => {
        ChatStore.isScroll = false;
    });
};
const NScrollbarRef = ref();
const handleScrollToPosition = () => {
    NScrollbarRef.value?.scrollBy({ top: 10000 });
};
document.addEventListener('keydown', function (event) {
    if (event.keyCode === 13 && iskey.value) {
        sendMessage();
    }
});
const darkThemeOverrides = {
    common: {
        primaryColor: '#8650D0',
        primaryColorHover: '#8650D0',
    },
};
const chatBurialPoint = (name: string) => {
    sensors.track('h5_AI_function_click', {
        node_name: name,
        ai_name: ChatStore.aiInfo.name,
        entrance_source: '消息列表',
        ai_id: ChatStore.aiInfo.ai_uid,
        is_login: userStore.Token ? '是' : '否',
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
};


const interdictDialog = ref(false);
const voiceDialog = ref(false);
const handleClick = () => {
    interdictDialog.value = false;
    voiceDialog.value = false;
};
const jump = () => {
    sensors.track('h5_msg_limit_click', {
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
    sensors.track('h5_pro_page_view', {
        from_our_platform: 'ponrh.ai',
        entrance_source: '消息上限弹窗',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
    router.push('/becomePro');
};
const toBecomePro = () => {

    sensors.track('h5_pro_page_view', {
        from_our_platform: 'ponrh.ai',
        entrance_source: '语音弹窗',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
    sensors.track('h5_voice_pop_click', {
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
    router.push('/becomePro');
};
</script>

<template>
    <NModal v-model:show="voiceDialog" :on-after-leave="handleClick">
        <div class="interdictDialog">
            <img src="@/assets/images/interdictDialogBg.png" />
            <img src="@/assets/images/close_icon.svg" square-24 class="close" @click="handleClick" />
            <div class="cont">
                <p class="title">Upgrade to unlock Character Voice Messages</p>
                <p class="desc">Hurry up, Upgrade Pro now to listen to your character’s voices</p>
                <p class="btn" @click="toBecomePro">Get voice messages</p>
            </div>
        </div>
    </NModal>
    <NModal v-model:show="interdictDialog" :on-after-leave="handleClick">
        <div class="interdictDialog">
            <img src="@/assets/images/interdictDialogBg.png" />
            <img src="@/assets/images/close_icon.svg" square-24 class="close" @click="handleClick" />
            <div class="cont" v-if="userStore.userInfo?.vip_info.vip_type == 0">
                <p class="title">You ran out of messages</p>
                <p class="desc">Looks like you've ran out of messages. Upgrade Pro now to get more messages!</p>
                <p class="btn" @click="jump">Get more messages</p>
            </div>
            <div class="cont" v-else>
                <p class="title">There are 1000 messages/day. The limit has been reached today. Please come back
                    tomorrow.</p>
                <p class="btn" @click="handleClick">Confirm</p>
            </div>
        </div>
    </NModal>
    <div h-100p position-absolute w-100p>
        <div class="top" h-80 font-weight-bold fs-20 color-ffffff flex-flex-start-center position-absolute z-10
            bg-131313 w-100p left-0 top-0>
            <img src="@/assets/images/prev_icon.svg" class="prev" @click="prev" />
            <img square-45 border-radius-50p m-l-15 m-r-12 :src="ChatStore.aiInfo.avatar" @click="next" />
            <span @click="next">{{ ChatStore.aiInfo.ai_name }}</span>
        </div>
        <NScrollbar ref="NScrollbarRef" h-100p>
            <div class="main" p-x-15>
                <div class="tips"> All chats and related services are Al-generated, and some may incur charges. Please
                    ensure sufficient balance.</div>
                <template v-for="(item, index) in ChatStore.chatList" :key="index">
                    <div m-t-24 color-ffffff op50 text-center w-100p> {{ item.time }} </div>
                    <template v-if="item.to == userStore.userInfo.uid">
                        <div class="dialogue"
                            v-if="item.content.data.extra.dataType == 'text' || item.content.data.extra.dataType == 'audio'">
                            <div style="display: flex;justify-content: space-between;width: 100%;">
                                <span v-if="item.content.data.extra.dataType == 'text'">{{
                                    item.content.data.extra.data.context }}</span>
                                <span v-else>{{ item.content.data.extra.data.audioContext }}</span>
                                <img class="video" square-32 v-if="item.content.data.extra.dataType == 'audio'"
                                    @click="openApp(item)" src="@/assets/images/voice.svg" />
                                <!-- {{item.content.data.extra}} -->
                            </div>
                            <!-- <p class="icon" v-if="item.content.data.extra.data.is_like">
                                <img c-p v-if="item.content.data.extra.data.is_like == 'dislike'" src="@/assets/images/chat_icon_2.webp" />
                                <img c-p v-else src="@/assets/images/chat_icon_1.webp" />
                            </p>
                            <div class="icon" v-else>
                                <img v-if="index == ChatStore.chatList.length - 1" @click="chatLike(item, index, 'dislike')" src="@/assets/images/chat_icon_2.webp" />
                                <img v-if="index == ChatStore.chatList.length - 1" @click="chatLike(item, index, 'like')" src="@/assets/images/chat_icon_1.webp" />
                            </div> -->
                        </div>
                        <div class="imgPrice flex" v-else-if="item.content.data.extra.dataType == 'image'">
                            <div class="coin" v-if="item.content.data.extra.data.price == 0">
                                <NImage class="nimage" width="150" height="230"
                                    :src="item.content.data.extra.data.url" />
                            </div>
                            <div v-else>
                                <NImage class="nimage" width="150" height="230"
                                    v-if="item.content.data.extra.data.pay_url"
                                    :src="item.content.data.extra.data.pay_url" @click="chatBurialPoint('消息图')" />
                                <NImage class="nimage" width="150" height="230" preview-disabled v-else
                                    :src="item.content.data.extra.data.url" />
                                <!-- !item.content.data.extra.data.is_unlock -->
                                <div class="buy" v-if="userStore.userInfo?.vip_info.vip_type == 0"
                                    @click.stop="router.push('/becomePro')">
                                    <!-- unlockImage(item, index) -->
                                    <div center>
                                        <p class="dithering" center
                                            style="padding: 0 30px; color: #FF9C31;border: 1px solid #FF9C31;">
                                            Pro
                                            <!-- {{ item.content.data.extra.data.price }}
                                            <img square-18 m-l-3 src="@/assets/images/coin.webp" />  -->
                                        </p>
                                    </div>
                                    Subcribe Pro to Unlock More Pics
                                </div>
                                <!-- <p class="icon" v-if="item.content.data.extra.data.is_like">
                                    <img c-p v-if="item.content.data.extra.data.is_like == 'dislike'" src="@/assets/images/chat_icon_2.webp" />
                                    <img c-p v-else src="@/assets/images/chat_icon_1.webp" />
                                </p>
                                <div class="icon" v-else>
                                    <img v-if="index == ChatStore.chatList.length - 1" @click="chatLike(item, index, 'dislike')" src="@/assets/images/chat_icon_2.webp" />
                                    <img v-if="index == ChatStore.chatList.length - 1" @click="chatLike(item, index, 'like')" src="@/assets/images/chat_icon_1.webp" />
                                </div> -->
                            </div>
                        </div>
                    </template>
                    <div v-else class="reply">
                        <span> {{ item.content.data.extra.data.context }} </span>
                    </div>
                </template>
                <!--  -->
                <div class="dialogue flex dialogue_login" v-if="ChatStore.isSend == 2">
                    <div class="content">
                        <div class="text">
                            <img width="30" src="@/assets/images/loading.gif" />
                        </div>
                    </div>
                </div>
            </div>
        </NScrollbar>
    </div>
    <div class="send" position-absolute left-0 bottom-0 w-100p p-b-25 bg-131313 p-10 z-10>
        <!-- <div d-flex m-b-10>
            <img @click="sendSelfie(), openApp('Selfie')" h-26 m-r-5 c-p src="@/assets/images/fig_icon_1.webp" />
            <img v-if="ChatStore.aiInfo.generate_photo_btn" h-26 m-r-5 c-p src="@/assets/images/fig_icon_2.webp" @click="openApp('Generate Photo')" />
            <img v-if="ChatStore.aiInfo.role_play_btn" h-26 m-r-5 c-p src="@/assets/images/fig_icon_3.webp" @click="openApp('Role Play')" />
            <img v-if="ChatStore.aiInfo.private_date_btn" h-26 m-r-5 c-p src="@/assets/images/fig_icon_4.webp" @click="openApp('Date')" />
        </div> -->
        <div position-relative>
            <NConfigProvider preflight-style-disabled w-90p>
                <NInput placeholder="Say something…" type="textarea" class="textarea" v-model:value="message" :autosize="{
                    minRows: 1,
                    maxRows: 5,
                }" :theme-overrides="darkThemeOverrides" @blur="iskey = false" @focus="iskey = true"
                    onkeydown="if(event.keyCode==13)return false;" />
            </NConfigProvider>
            <n-spin v-if="loadSend" class="send_message" square-48 position-absolute r-10 top-50p size="small" />
            <img v-else class="send_message" square-48 @click="sendMessage()" c-p position-absolute r-10 top-50p
                src="@/assets/images/send.svg" />
        </div>
    </div>
    <div v-if="loadRequest" position-absolute top-50p left-50p>
        <NSpin size="large" />
    </div>
</template>

<style lang="less">
.send {
    .n-input__border {
        border: 0 !important;
    }

    .n-input .n-input-wrapper {
        padding-left: 0 !important;
        padding-right: 25px !important;
    }

    .n-input__textarea-el {
        // background: rgba(74, 81, 105, 0.5) !important;
        color: #fff !important;
    }

    .n-input:not(.n-input--disabled).n-input--focus {
        background: none !important;
    }
}
</style>
<style lang="less" scoped>
.interdictDialog {
    width: 384px;
    background: linear-gradient(180deg, rgba(9, 9, 11, 0) 3.29%, #1A1E28 22.14%);
    border-radius: 16px;
    position: relative;

    .close {
        position: absolute;
        right: 15px;
        top: 200px;
        cursor: pointer;
    }

    .cont {
        padding: 0 24px;

        .title {
            font-size: 24px;
            font-weight: 600;
            line-height: 28px;
            text-align: left;
            color: #fff;
            margin-bottom: 6px;
        }

        .desc {
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            color: #A1A1AA;
        }

        .btn {
            height: 40px;
            border-radius: 12px;
            cursor: pointer;
            background: linear-gradient(114.24deg, #FFB524 16.28%, #FF8C39 94.9%);
            text-align: center;
            line-height: 40px;
            font-size: 14px;
            font-weight: 700;
            margin: 30px 0 48px 0;

        }
    }
}

@keyframes dithering {
    0% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-10px);
    }

    50% {
        transform: translateX(10px);
    }

    75% {
        transform: translateX(-10px);
    }

    100% {
        transform: translateX(0);
    }
}

.dithering {

    animation: dithering 0.5s ease-in-out;
}

.textarea {
    width: 100%;
    background: rgba(74, 81, 105, 0.5);
    border-radius: 18px;
    // height: 36px;
    color: #ffffff;
    line-height: 18px;
    padding: 0 15px;
    min-height: 48px;
}

.input {
    background: rgba(74, 81, 105, 0.5);
    border: 1px solid rgba(74, 81, 105, 0.5);
    color: #ffffff;

    :hover {
        background: rgba(74, 81, 105, 0.5);
        border: 1px solid rgba(74, 81, 105, 0.5);
    }
}

.dialogue {
    padding: 12px;
    border-radius: 18px;
    // background: radial-gradient(28% 141% at 111% 79%, #dc48a6 0%, #8650d0 50%);
    background: linear-gradient(271.2deg, #ED41B3 2.78%, #C95400 103.47%);
    color: #ffffff;
    font-size: 15px;
    max-width: 360px;
    margin-top: 18px;
    line-height: 22px;
    margin-bottom: 10px;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .video {
        display: inline-block;
        margin-right: 0;
        vertical-align: top;
        margin-top: 2px;
        cursor: pointer;
        margin-left: 10px;
    }

    span {
        font-size: 15px;
        line-height: 22px;
    }
}

.reply {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 18px;

    span {
        background: #202020;
        border-radius: 18px;
        padding: 12px;
        color: #ffffff;
        line-height: 22px;
        font-size: 16px;
        max-width: 300px;
        word-wrap: break-word;
        word-break: normal;
    }
}

.imgPrice {
    width: 150px;
    height: 230px;
    border-radius: 12px;
    color: #ffffff;
    justify-content: center;
    align-items: center;
    position: relative;
    border-radius: 12px;

    // overflow: hidden;
    .nimage {
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 12px;
    }

    .buy {
        z-index: 1;
        position: relative;
        width: 120px;
        text-align: center;
        cursor: pointer;

        p {
            background: rgba(255, 255, 255, 0.4);
            border-radius: 16px;
            padding: 3px 6px;
            margin-bottom: 6px;
        }
    }
}

.icon {
    position: absolute;
    right: -80px;
    bottom: 2px;
    width: 70px;

    img {
        width: 24px;
        margin-right: 5px;
        cursor: pointer;
    }
}

.dialogue_login {
    width: auto;
    display: inline-block;
    padding: 8px 12px;

    .content {
        img {
            display: block;
        }
    }
}

.top {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    .prev {
        display: none;
    }
}

.main {
    padding-top: 85px;
    padding-bottom: 130px;
}

.tips {
    color: #afafaf;
    font-size: 15px;
    width: 400px;
    margin: 0 auto;
    text-align: center;
    margin-top: 24px;
    margin-bottom: 18px;
}

.send_message {
    margin-top: -24px;
}

@media screen and (max-width: 768px) {
    .top {
        height: 0.58rem;
        background: #2A2A2A;

        .prev {
            display: block;
        }
    }
}
</style>
