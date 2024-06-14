<script lang="ts" setup>
import { ref, getCurrentInstance, watch } from 'vue';
import { NModal, useMessage, NSpin, NImage } from 'naive-ui';
import { getPhotoList } from '@/api/chat/index';
const show = ref(false);
const message = useMessage();
const app = getCurrentInstance();
const isMobile = app?.appContext.config.globalProperties.$isMobile;


import { useChatStore } from '@/stores/chat';
const ChatStore = useChatStore();

const handleClick = () => {
    ChatStore.isPopupPhoto = false;
};
const prev = () => {
    console.log(1)
    ChatStore.isPopupPhoto = false;
};
const photoList = ref([]);
const _getPhotoList = async () => {
    const param = {
        page: 1,
        page_size: 20,
        ai_uid: ChatStore.aiInfo.ai_uid,
        sort: 'Earliest'
    };
    const res: any = await getPhotoList(param);
    photoList.value = res.data;
};
watch(
    () => ChatStore.isPopupPhoto,
    () => {
        if (ChatStore.isPopupPhoto) {
            _getPhotoList();
        }
    },
    { immediate: true }
);
</script>

<template>

    <!-- <div color-ffffff>{{ChatStore.aiInfo.ai_uid}}</div> -->
    <div class="photoAlbum" v-if="!isMobile">
        <NModal v-model:show="ChatStore.isPopupPhoto" :on-after-leave="handleClick">
            <NSpin :show="show">
                <div class="photoDialog">
                    <div class="name">{{ ChatStore.aiInfo.ai_name }}'s Gallery</div>
                    <div class="cont" v-if="photoList.length > 0">
                        <n-image-group show-toolbar-tooltip>
                            <n-space class="picBox">
                                <n-image v-for="(item, i) in photoList" width="100%" :src="item.pic_url" />
                                <i></i>
                                <i></i>
                            </n-space>
                        </n-image-group>
                    </div>
                    <div class="cont empty" v-else>Empty photo album</div>
                </div>
            </NSpin>
        </NModal>
    </div>
    <div class="photoAlbum" v-else>
        <div class="photoDialog_m" v-if="ChatStore.isPopupPhoto">
            <div class="name">
                <img src="@/assets/images/prev_icon.svg" class="prev" @click="prev" />
                {{ ChatStore.aiInfo.ai_name }}'s Gallery
            </div>
            <div class="cont" v-if="photoList.length > 0">
                <n-image-group show-toolbar-tooltip>
                    <n-space class="picBox">
                        <n-image v-for="(item, i) in photoList" width="100%" :src="item.pic_url" />
                    </n-space>
                </n-image-group>
            </div>
            <div class="cont empty" v-else>Empty photo album </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.photoDialog {
    width: 1300px;
    min-height: 620px;
    background: #1A1E28;
    border: 1px solid hsl(213, 27%, 21%);
    border-radius: 24px;

    .name {
        height: 84px;
        line-height: 84px;
        padding: 0 48px;
        font-size: 16px;
        color: #fff;
        border-bottom: 1px solid #2C3241;
    }

    .cont {
        min-height: 535px;
        max-height: 600px;
        font-size: 16px;
        color: #fff;
        overflow: auto;

        &::-webkit-scrollbar {
            display: none;
        }

        .picBox {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            padding: 8px;
            box-sizing: border-box;
            justify-content: space-between;

            :deep(.n-image) {
                width: 308px;
                height: 520px;
                margin-bottom: 8px;
                border-radius: 12px;
                overflow: hidden;

                img {
                    width: 100%;
                }
            }
            i{
                width: 308px;
            }
        }
    }

    .empty {
        text-align: center;
        line-height: 535px;
    }
}

@media screen and (max-width: 768px) {
    .photoDialog_m {
        width: 100%;
        height: calc(100vh - 64px);
        background: #131313;
        position: fixed;
        top: 64px;
        left: 0;
        z-index: 22;

        .name {
            height: 0.58rem;
            background: #2A2A2A;
            color: #FFFFFF;
            font-size: 0.14rem;
            display: flex;
            align-items: center;
            padding: 0 0.16rem;
        }

        .cont {
            overflow: auto;

            &::-webkit-scrollbar {
                display: none;
            }

            .picBox {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                padding: 8px;
                box-sizing: border-box;
                justify-content: space-between;

                :deep(.n-image) {
                    width: 1.72rem;
                    height: 2.9rem;
                    margin: 0.08rem;
                    border-radius: 0.12rem;
                    overflow: hidden;

                    img {
                        width: 100%;
                    }
                }
                i{
                    width: 1.72rem;
                }
            }
        }

        .empty {
            text-align: center;
            line-height: 535px;
        }
    }
}
</style>
