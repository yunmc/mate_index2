<script lang="ts" setup>
import { ref, getCurrentInstance, watch } from 'vue';
import { NModal, useMessage, NSpin, NImage } from 'naive-ui';
import { getPhotoList } from '@/api/chat/index';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { getHashUrlParams } from '@/utils/common';
const router = useRouter();
const userStore = useUserStore();
const show = ref(false);
const message = useMessage();
const app = getCurrentInstance();
const isMobile = app?.appContext.config.globalProperties.$isMobile;
const sensors = app?.appContext.config.globalProperties.$sensors;


import { useChatStore } from '@/stores/chat';
const ChatStore = useChatStore();

const handleClick = () => {
    ChatStore.isPopupPhoto = false;
};
const prev = () => {
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
const jump = () => {
    if (userStore.userInfo?.vip_info.vip_type == 0) {
        router.push('/becomePro');
        ChatStore.isPopupPhoto = false;
    }
};
watch(
    () => ChatStore.isPopupPhoto,
    () => {
        if (ChatStore.isPopupPhoto) {
            _getPhotoList();
            sensors.track('h5_gallery_view', {
                photo_num: photoList.value.length,
                from_our_platform: 'ponrh.ai',
                ref_name: 'pornh.ai:' + getHashUrlParams('ref')
            });
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
                                <div v-for="(item, i) in photoList" class="nImageBox">
                                    <n-image width="100%" :src="item.pic_url" @click="jump" />
                                    <div class="btn" v-if="userStore.userInfo?.vip_info.vip_type == 0" @click="jump">Pro
                                    </div>
                                </div>
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

            .nImageBox {
                position: relative;

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

            i {
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

                i {
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
