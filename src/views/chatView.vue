<script setup lang="ts">
import { onMounted, ref, provide,watch } from 'vue';
import { NGi, NGrid, NSpin } from 'naive-ui';
import { useChatStore } from '@/stores/chat';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const ChatStore = useChatStore();
import ChatPeople from '../components/chat/people.vue';
import ChatDialogue from '../components/chat/dialogue.vue';
import ChatDetalis from '../components/chat/detalis.vue';
import ChatNull from '../components/chat/null.vue';
import TencentIM from '@/utils/Im';
import ChatPhotoAlbum from '../components/chat/photoAlbum.vue';
ChatStore.chatList = [];
ChatStore.isSend = 0;
const mainPosition = ref(0);
const changePosition = (position: number) => {
    mainPosition.value = position;
    console.log(position, 'position')
};
onMounted(async () => {
    if (userStore.Token != '') {
        await ChatStore.getInitChat();
        await ChatStore.getInitIm();
        ChatStore.chatIm = await new TencentIM({
            sdkAppId: ChatStore.sdkAppId,
            userId: userStore.userInfo.uid,
            userSig: ChatStore.init.userSig,
        });
    }
});

watch(
    () => mainPosition,
    () => {
        console.log(mainPosition.value, 'mainPosition')
    },
    { immediate: true }
);

</script>

<template>
    <NGrid h-100p overflow-hidden x-gap="0" :cols="24" class="chatGrid" :style="{left:'-'+ mainPosition +'%'}">
        <NGi :span="6" style="background: #1A1A1A; height: 100%; position: relative" class="chatPeople">
            <ChatPeople @changePosition="changePosition" />
        </NGi>

        <template
            v-if="userStore.Token != '' && (ChatStore.aiList != '' || !ChatStore.isAI) && ChatStore.aiInfo.ai_uid">
            <NGi :span="11" class="chatDialogue">
                <div class="light-green"
                    style="background: #131313; height: 100%; position: relative; overflow: scroll">
                    <ChatDialogue @changePosition="changePosition" />
                </div>
            </NGi>
            <NGi :span="7" class="chatDetalis">
                <div class="light-green" style="background: #18143c; height: 100%; position: relative">
                    <ChatDetalis @changePosition="changePosition" />
                </div>
            </NGi>
        </template>
        <template v-else>
            <NGi :span="18">
                <ChatNull />
            </NGi>
        </template>
    </NGrid>
    <NSpin v-if="ChatStore.isLoadAi && ChatStore.aiList != ''" position-absolute left-0 top-0 w-100p h-100p z-6>
    </NSpin>
    <ChatPhotoAlbum />
</template>

<style lang="less" scoped>
@media screen and (max-width: 768px) {
    .chatGrid {
        display: block !important;
        position: relative;
        left: 0;
        width: 300% !important;
        //动画
        transition: left 0.5s;

        .chatPeople,
        .chatDialogue,
        .chatDetalis {
            width: 100vw;
            height: 100%;
            float: left;
        }
    }

}
</style>