import { defineStore } from 'pinia';
import type { UserState } from './interface';
import { userLogin, getUserCenter } from '@/api/user/index';
import { senSorsInit } from '@/utils/sensors';

export const useUserStore = defineStore({
    id: 'user',
    state: (): UserState => ({
        isModal: false,
        isPopupLogin: false,
        isPopupContactUs: false,
        isPopupInfo: false,
        popupLoginTitle: 'Sign in',
        Token: '',
        userInfo: {},
        payType: false,
        isAdult: false
    }),
    actions: {
        logOut() {
            const consentValue = localStorage.getItem('consent');
            window.localStorage.clear();
            if (consentValue !== null) {
                localStorage.setItem('consent', consentValue);
            }
            window.location.reload();
        },
        getUser() {
            return new Promise((resolve, reject) => {
                getUserCenter()
                    .then((response: any) => {
                        console.log(response, 'getUserCenter')
                        if (response.code == 200) {
                            this.userInfo.coins_balance = response.data.coins_balance;
                            this.userInfo.vip_info = response.data.vip_info;
                            resolve(response);
                        }
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            });
        },
        getUserInfo(params: any) {
            return new Promise((resolve, reject) => {
                userLogin(params)
                    .then((response: any) => {
                        if (response.code === 200) {
                            this.userInfo = response.data;
                            this.Token = response.data.apikey;

                            // senSorsInit().identify(response.data.uid, true);
                            this.isPopupLogin = false;
                            resolve(response);
                        } else {
                            resolve(response);
                        }
                        resolve(response);
                    })
                    .catch((error: any) => {
                        reject(error);
                    });
            });
        },
    },
    persist: {
        enabled: true,
        strategies: [{ storage: localStorage, paths: ['Token', 'userInfo'] }],
    },
});
