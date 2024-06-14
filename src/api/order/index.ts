import http from '@/api';

// 获取用户ai列表
export const priceList = () => {
    return http.post(`pay/pay/price_list`);
};

export const createOrder = (params: any) => {
    return http.post(`pay/pay/create_order`, params);
};

export const payPay = (params: any) => {
    return http.post(`pay/pay`, params);
};

export const payPaySuccess = (params: any) => {
    return http.post(`h5/paypal/success`, params);
};

export const payPayCancel = (params: any) => {
    return http.post(`h5/paypal/cancel`, params);
};

export const contactUs = (params: any) => {
    return http.post(`/base/index/app_feedback`, params);
};
export const proPay = (params: any) => {
    return http.post(`/pay/subscribe/create_order`, params);
};
export const proPaySuccess = (params: any) => {
    return http.post(`/h5/paypal/sub_success`, params);
};

export const proPayCancel = (params: any) => {
    return http.post(`/h5/paypal/sub_cancel`, params);
};
