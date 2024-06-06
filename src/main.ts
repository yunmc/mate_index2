import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'virtual:uno.css';
import App from './App.vue';
import router from './router';
import piniaPersist from 'pinia-plugin-persist';
import GoogleSignInPlugin from 'vue3-google-signin';
import { senSorsInit } from '@/utils/sensors';
import './assets/main.css';
import '@/utils/fb';

import VideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function setRem() {
    const designWidth = 390;
    const clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
    document.documentElement.style.fontSize = (clientWidth / designWidth) * 100 + 'px';
}

setRem();
window.onresize = setRem;

const { VITE_GOOGLE_ID = '' } = import.meta.env;
const app = createApp(App);
app.config.globalProperties.$sensors = senSorsInit();
app.config.globalProperties.$isMobile = isMobile;
const pinia = createPinia();
pinia.use(piniaPersist);
app.use(pinia);
app.use(router);
try {
    app.use(GoogleSignInPlugin, {
        clientId: VITE_GOOGLE_ID,
    });
} catch (e) {
    console.log(e);
}
app.use(VideoPlayer)
app.mount('#app');
