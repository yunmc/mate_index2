<template>
    <div class="dashboard">
        <div class="container">
            <h2 class="title">Dashboard {{ getHashUrlParams('channel_name') }}</h2>
            <div class="cont">
                <div class="statistics">
                    <NSelect v-model:value="timeFrame" :options="options" class="statisSelect"
                        @update:value="changeTime" />
                    <div class="statisList">
                        <div v-for="item in statisList" :key="item.title" class="statisItem">
                            <div class="statisItemTitle">{{ item.title }}</div>
                            <div class="statisItemNum">{{ item.value }}</div>
                        </div>
                    </div>
                </div>
                <NDataTable remote class="dashboardTable" ref="table" :columns="columns" :data="data" :loading="loading"
                    :pagination="pagination" @update:page="handlePageChange" :max-height="400" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { NSelect, NDataTable } from 'naive-ui';
import { ref, reactive,getCurrentInstance } from 'vue';
import { dashBoardData } from '@/api/dashboard/index'
import { getHashUrlParams } from '@/utils/common';
const app = getCurrentInstance();
const isMobile = app?.appContext.config.globalProperties.$isMobile;
const timeFrame = ref(7)
const loading = ref(true)

const data = ref([])

const columns = !isMobile?ref([
    {
        title: 'Date',
        key: 'data_date'
    },
    {
        title: 'Page View',
        key: 'data_pv'
    },
    {
        title: 'Unique Visitor',
        key: 'data_uv'
    },
    {
        title: 'Total Paid',
        key: 'data_revenue',
        render: (row: any) => `￥${row.data_revenue}`,
    }],
) : ref([
    {
        title: 'Date',
        key: 'data_date'
    },
    {
        title: 'PV',
        key: 'data_pv'
    },
    {
        title: 'UV',
        key: 'data_uv'
    },
    {
        title: 'Total',
        key: 'data_revenue',
        render: (row: any) => `$${row.data_revenue}`,
    },
])
const pagination = reactive({
    pageSize: 9,
    itemCount: 3,
    page: 1
})
const handlePageChange = (page: number) => {
    loading.value = true
    pagination.page = page
    fetchData()
}
const changeTime = (value: number) => {
    loading.value = true
    timeFrame.value = value
    fetchData()
}
const options = reactive([
    {
        label: 'last 7 days',
        value: 7
    },
    {
        label: 'last 30 days',
        value: 30
    },
    {
        label: "Total",
        value: 0
    },
])
const statisList = reactive([
    {
        title: 'Page View',
        value: '0'
    },
    {
        title: 'Unique Visitor',
        value: '0'
    },
    {
        title: 'Total Paid',
        value: '0'
    }
])
const fetchData = async () => {
    const params = {
        page: pagination.page,
        page_size: pagination.pageSize,
        channel_name: getHashUrlParams('channel_name'),
        channel_pwd: getHashUrlParams('channel_pwd'),
        days: timeFrame.value
    }
    const res: any = await dashBoardData(params)
    data.value = res.data.list
    statisList[0].value = res.data.total_pv
    statisList[1].value = res.data.total_uv
    statisList[2].value = '$' + res.data.total_revenue
    pagination.itemCount = res.data.total
    loading.value = false
    console.log(res)
}
fetchData()
</script>

<style lang="less" scoped>
:deep(.n-scrollbar) {
    background: none !important;
}

.dashboard {
    width: 100%;
    height: 100vh;
    background: red;
    background: url(@/assets/images/dashboard_bg.png) no-repeat center center #131313;
    overflow: hidden;

    .container {
        width: 1300px;
        margin: 50px auto 0;

        .title {
            font-size: 28px;
            color: #fff;
            line-height: 40px;
            margin-bottom: 21px;
        }

        .cont {
            width: 100%;
            height: 780px;
            background: #1A1E28;
            border: 1px solid #273444;
            border-radius: 24px;

            .statistics {
                padding: 32px 48px;

                :deep(.n-select) {
                    width: 140px;

                    .n-base-selection-input__content {
                        color: #fff;
                    }

                    .n-base-selection-label {
                        background: none;
                        border: none !important;
                    }

                    .n-base-selection {
                        border: none !important;
                        border-radius: 24px;
                    }

                    .n-base-selection__border {
                        border: 1px solid #273444;
                    }

                    .n-base-selection__state-border {
                        border: none !important;
                    }

                }

                .statisList {
                    display: flex;
                    margin-top: 24px;

                    .statisItem {
                        width: 320px;
                        height: 112px;
                        background: #232B3C;
                        border: 1px solid #273444;
                        border-radius: 24px;
                        padding: 14px 24px;
                        box-sizing: border-box;
                        margin-right: 12px;

                        .statisItemTitle {
                            font-size: 18px;
                            color: #CECECE;
                            line-height: 24px;
                            padding-bottom: 12px;
                            border-bottom: 1px solid #A3A3A333;
                        }

                        .statisItemNum {
                            font-size: 28px;
                            color: #fff;
                            line-height: 40px;
                            font-weight: 700;
                            margin-top: 8px;
                        }
                    }
                }
            }

            :deep(.dashboardTable) {

                .n-data-table-wrapper {
                    border: none;
                }

                .n-data-table-td,
                .n-data-table-th {
                    background: #1A1E28;
                    border-bottom: 1px solid #191F29;
                    color: #fff;
                    font-size: 14px;
                    padding-left: 48px;
                }

                .n-data-table-th {
                    background: #232B3C;
                    font-size: 16px;
                    font-weight: 800;
                }

                .n-data-table__pagination {
                    justify-content: center;
                }

                .n-pagination-item.n-pagination-item--button {
                    border: none;
                    background: none;

                    .n-base-icon {
                        color: #fff;
                        font-size: 20px;
                    }
                }

                .n-pagination-item {
                    color: #fff;
                    border: none;
                    width: 40px;
                    height: 40px;
                    background: none;
                }

                .n-pagination-item:not(.n-pagination-item--disabled).n-pagination-item--active {
                    background: #151515;
                    color: #fff;
                    border-radius: 50%;
                    color: #F0A227;
                }
            }
        }
    }
}

@media screen and (max-width: 768px) {
    .dashboard {
        width: 100%;
        overflow: auto;
        //背景从上到下#201743，#171423，#261E3C渐变
        background: linear-gradient(180deg, #201743 0%, #171423 50%, #261E3C 100%);
        padding: 0.1rem 0.13rem;

        .container {
            width: 100%;
            margin: 0;

            .title {
                font-size: 0.28rem;
                line-height: 0.4rem;
                margin-bottom: 0.12rem;
                font-weight: 700;
            }

            .cont {
                height: auto;
                border-radius: 24px;
                padding-bottom: 0.2rem;

                .statistics {
                    padding: 0.32rem 0.18rem 0.2rem;

                    .statisList {
                        display: flex;
                        margin-top: 0.24rem;
                        flex-wrap: wrap;

                        .statisItem {
                            width: 100%;
                            margin-bottom: 0.12rem;
                            height: 1.12rem;
                            padding: 0.14rem 0.24rem;
                            margin-right: 0;

                            .statisItemTitle {
                                font-size: 0.18rem;
                                line-height: 0.24rem;
                                padding-bottom: 0.12rem;
                            }

                            .statisItemNum {
                                font-size: 0.28rem;
                                line-height: 0.4rem;
                                margin-top: 0.08rem;
                            }
                        }
                    }
                }

                :deep(.dashboardTable) {

                    .n-data-table-td,
                    .n-data-table-th {
                        font-size: 0.14rem;
                        padding-left: 0;
                        text-align: center;
                        padding: 0.22rem 0;
                    }

                    .n-data-table-th {
                        font-size: 0.16rem;
                    }

                }
            }
        }
    }

}
</style>
