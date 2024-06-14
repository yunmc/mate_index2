<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { NModal, useMessage, NInput } from 'naive-ui';
import { useUserStore } from '@/stores/user';
import { contactUs } from '@/api/order/index';
const userStore = useUserStore();
const message = useMessage();

const handleClick = () => {
    userStore.isPopupContactUs = false;
};
const submit = async (): Promise<any> => {
    console.log('submit',btnStatus);
    if(!btnStatus.value){
        return
    }
    const params = {
        feedback_description: form.desc,
        email: form.email
    };
    const data: any = await contactUs(params);

    if (data.code === 200) {
        message.success('submit success');
        userStore.isPopupContactUs = false;
        form.email = '';
        form.desc = '';
    } else {
    }
};
const form = reactive({
    email: '',
    desc: ''
});
const btnStatus = ref(false);
//监听输入框，所有输入框都有值时，按钮才可以点击

watch(
    () => form,
    () => {
        if (form.email && form.desc) {
            btnStatus.value = true;
        } else {
            btnStatus.value = false;
        }
        console.log('form', btnStatus.value);
    },
    { deep: true }
);
</script>

<template>
    <div>
        <NModal v-model:show="userStore.isPopupContactUs" :on-after-leave="handleClick">
            <div class="contactUs">
                <img src="@/assets/images/close_icon.svg" square-24 class="close" @click="handleClick" />
                <p class="title">Contact us </p>
                <p class="tips">Write your message here.</p>
                <p class="i-title" m-b-6>Your email</p>
                <NInput placeholder="Enter your email address" type="text" class="text"
                    v-model:value="form.email" />
                <p class="i-title" m-b-6>Description</p>
                <NInput placeholder="Describe your problem" type="textarea" class="textarea"
                    v-model:value="form.desc" />
                <p @click="submit" class="btn" :class="btnStatus ? 'can' : 'cant'">Send</p>
            </div>
        </NModal>
    </div>
</template>

<style lang="less" scoped>
.contactUs {
    width: 384px;
    background: #1A1E28;
    border-radius: 16px;
    padding: 30px 24px 48px;
    position: relative;
    .close{
        position: absolute;
        right: 15px;
        top: 15px;
        cursor: pointer;
    }
    .title {
        color: #fff;
        font-size: 24px;
        font-weight: 600;
    }

    .tips {
        font-size: 14px;
        color: #A1A1AA;
    }

    .i-title {
        font-size: 14px;
        color: #fff;
        margin-top: 24px;
    }
    .text{
        height: 48px;
        border: 1px;
        background: #1A1E28;
        :deep(.n-input__input-el){
            height: 48px;
            color: #fff;
        }
    }
    .textarea{
        height: 100px;
        border: 1px;
        background: #1A1E28;
        color: #fff;
        :deep(.n-input-wrapper){
            resize: none;
        }
        :deep(textarea){
            color: #fff;
        }
    }
    .btn{
        width: 336px;
        height: 40px;
        border-radius: 12px;
        text-align: center;
        cursor: pointer;
        line-height: 40px;
        margin-top: 16px;
    }
    .can{
        background: linear-gradient(114.24deg, #FFB524 16.28%, #FF8C39 94.9%);
        color: #222222;
        cursor: pointer;
        font-weight: 700;
        
    }
    .cant{
        background: #27272A;
        color: #A3A2A2;
        cursor: no-drop;
    }
}
</style>
