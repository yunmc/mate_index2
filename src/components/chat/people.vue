<script lang="ts" setup>
import { nextTick, onMounted, getCurrentInstance,watch } from 'vue';
import { NImage, useMessage } from 'naive-ui';
import { useChatStore } from '@/stores/chat';
import { useUserStore } from '@/stores/user';
import { getHashUrlParams } from '@/utils/common';
import delAi from '../popup/delAi.vue';
import { useRouter } from 'vue-router';
const app = getCurrentInstance();
const sensors = app?.appContext.config.globalProperties.$sensors;
const isMobile = app?.appContext.config.globalProperties.$isMobile;
const router = useRouter();

const userStore = useUserStore();
const emit = defineEmits(['changePosition']);
const ChatStore = useChatStore();
const useMsg = useMessage();
const setAiUser = async (item: any) => {
    sensors.track('h5_AI_function_click', {
        entrance_source: '切换AI角色',
        ai_name: ChatStore.aiInfo.name,
        ai_id: ChatStore.aiInfo.ai_uid,
        entrance_source: '消息列表',
        is_login: userStore.Token ? '是' : '否',
        from_our_platform: 'ponrh.ai',
        ref_name: 'pornh.ai:' + getHashUrlParams('ref')
    });
    emit('changePosition', 100)
    ChatStore.chatList = [];
    ChatStore.isSend = 0;
    ChatStore.isScroll = true;
    ChatStore.isLoadAi = true;
    const response: any = await ChatStore.getCoreInfo(item.userProfile.userID);
    ChatStore.isLoadAi = false;
    if (response.code == 200) {
        ChatStore.chatIm.getMessageRead();
    } else {
        useMsg.error(response.msg);
    }
};
const deleteConver = (item: any, index: any) => {
    console.log('item', item);
    ChatStore.delAiInfo = item;
    ChatStore.delAiInfo.index = index;
    ChatStore.isPopupAi = true;
    // ChatStore.chatIm.deleteConversation(item.conversationID, index);
};

onMounted(async () => {
    // setTimeout(() => {
    // console.log('ChatStore.aiInfo.ai_uid', ChatStore.aiInfo.ai_uid);
    // console.log('ChatStore.aiList', ChatStore.aiList);
    // }, 2000);
    // nextTick(() => {
        
        // if (!ChatStore.aiInfo.ai_uid && ChatStore.aiList != '') {
        //     setAiUser(ChatStore.aiList[0]);
        // }
    // });
});

watch(() => ChatStore.bannerAssign, (newValue) => {
    console.log('ChatStore.aiInfo.ai_uid', ChatStore.aiInfo.ai_uid);
    console.log('ChatStore.aiList', ChatStore.aiList);
    nextTick(() => {
        if (!ChatStore.aiInfo.ai_uid && ChatStore.aiList != '') {
            setAiUser(ChatStore.aiList[0]);
        }
    });
});
const offset = [-15, 5] as const;

const prev = () => {
    router.push({ path: '/' });
};
</script>

<template>
    <div class="goHome" v-if="isMobile">
        <img src="@/assets/images/prev_icon.svg" class="prev" @click="prev" />
        <span>Chat</span>
    </div>
    <div p-x-12 min-w-250 p-t-33 h-100p overflow-auto flex-column class="MBox">
        <div color-fff fs-20 font-weight-bold v-if="!isMobile"> Chat</div>
        <div h-54 m-b-10 flex-flex-start-center c-p
            class="border current" v-if="Object.keys(ChatStore.aiInfo).length !== 0 && !userStore.Token">
            <NImage width="37" height="37" m-x-8 border-radius-50p preview-disabled object-fit="cover"
                :src="ChatStore.aiInfo.avatar" />
            <div w-100p m-r-8>
                <p line-height-18 flex-between-center>
                    <span color-FFF fs-14>{{ ChatStore.aiInfo.name }}</span>
                    <span fs-10>{{}}</span>
                </p>
                <p line-height-18 flex-between-center>
                    <!-- <span class="overflow" fs-12>{{ item.lastMessage.content11111 }}</span> -->
                </p>
            </div>
        </div>
        <p color-B5B1FF op30 fs-15 v-else-if="ChatStore.aiList == '' && ChatStore.isAI"> It's empty
        </p>

        <div v-else m-t-13 class="peopleBox">
            <div v-if="!ChatStore.isAI" h-54 m-b-10 flex-flex-start-center c-p
                :class="!ChatStore.isAI ? 'border current' : 'border'">
                <NImage width="37" height="37" m-x-8 border-radius-50p preview-disabled object-fit="cover"
                    :src="ChatStore.aiInfo.avatar" />
                <div w-100p m-r-8>
                    <p line-height-18 flex-between-center>
                        <span color-FFF fs-14>{{ ChatStore.aiInfo.name }}</span>
                        <span fs-10>{{}}</span>
                    </p>
                    <p line-height-18 flex-between-center>
                        <!-- <span class="overflow" fs-12>{{ item.lastMessage.content222 }}</span> -->
                    </p>
                </div>
            </div>
            <div v-for="(item, index) in ChatStore.aiList" :key="index"
                :class="item.userProfile.userID === ChatStore.aiInfo.ai_uid ? 'border current' : 'border'" h-54 m-b-10
                flex-flex-start-center c-p @click="setAiUser(item)">
                <!-- <NAvatar round m-x-8 :size="37" object-fit="contain" :src="item.userProfile.avatar" /> -->
                <!-- <NBadge :value="item.unreadCount" :offset="offset" :max="9"> -->
                <NImage width="37" height="37" m-x-8 border-radius-50p preview-disabled object-fit="cover"
                    :src="item.userProfile.avatar" />
                <!-- </NBadge> -->
                <div w-100p m-r-8>
                    <p line-height-18 flex-between-center>
                        <span color-FFF fs-14>{{ item.userProfile.nick }}</span>
                        <span fs-10>{{ item.lastMessage.lastTime }}</span>
                    </p>
                    <p line-height-18 flex-between-center>
                        <span class="overflow" fs-12>{{ typeof item.lastMessage.content == 'string' ?
                            item.lastMessage.content : item.lastMessage.content.content }}</span>
                        <span v-if="item.userProfile.userID != ChatStore.aiInfo.ai_uid"
                            @click.stop="deleteConver(item, index)"><img square-12 border-radius-50p
                                src="@/assets/images/delete.webp" /></span>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <delAi></delAi>
</template>

<style lang="less" scoped>
.border {
    border: solid 1px transparent;
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.6);
    background: #2B2B2B;

}

.current {
    background-image: linear-gradient(#2C1C3A, #3B1C32), linear-gradient(102deg, #8d2cff 7%, #ee2f5d 50%, #ff27d0 100%);
    background-origin: border-box;
    background-clip: content-box, border-box;
}

.overflow {
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.peopleBox{
    max-height: 800px;
    overflow: auto
}
//修改滚动条样式
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #2E323E;
}
//滚动条拖动条
::-webkit-scrollbar-thumb {
    background-color: #C1C1C1;
    border-radius: 10px;
}

@media screen and (max-width: 768px){
    .goHome{
        background: rgba(255, 255, 255, 0.1);
        height: 0.58rem;
        display: flex;
        align-items: center;
        font-size: 0.14rem;
        color: #fff;
    }
    .MBox{
        padding-top: 0.04rem;
    }
}
</style>
