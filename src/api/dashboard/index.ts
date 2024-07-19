import http from '@/api';

export const dashBoardData = (params:any) => {
    return http.post(`/h5/distribution_channel/data`,params);
};
