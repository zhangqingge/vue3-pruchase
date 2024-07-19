<template>
<div>
    <Breadcrumb></Breadcrumb>
    <!-- 顶部区域 -->
    <div class="header">
        <div class="form">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="订单编号">
                    <el-input v-model="formInline.name" size="small" placeholder="产品名称"></el-input>
                </el-form-item>
                <el-form-item label="预定时间">
                    <el-date-picker v-model="formInline.date" size="small" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="group">
            <el-button size="small" type="warning">导出</el-button>
        </div>
    </div>
    <!-- 表格区域 -->
    <div class="content">
        <el-table :data="tableData" border style="width: 100%" header-cell-class-name="active-header"
            cell-class-name="table-center">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="orderNum" label="汇总单编号">
                <template #default="scope">
                    <span @click="OrderDesc(scope.row)" style="color: blue; cursor: pointer;">
                        {{ scope.row.orderNum }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="operator" label="汇总人">
            </el-table-column>
            <el-table-column prop="phone" label="联系电话">
            </el-table-column>
            <el-table-column prop="yudingTime" label="汇总时间">
                <template #default="scope">
                    <span>{{ dayjs(scope.row.yudingTime).format('YYYY-MM-DD') }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="汇总单总价格">
            </el-table-column>
            <el-table-column prop="huizongStatus" label="操作">
                <template #default="scope">
                    <el-button size="mini" @click="handleEdit(scope.row)" type="danger">撤销汇总</el-button>
                </template>
            </el-table-column>

        </el-table>

        <!-- 分页 -->
        <Pagination :total="total" :pageSize="pageSize" @CurrentChange="CurrentChange"></Pagination>
    </div>
</div>
</template>

<script setup>
import Pagination from '@/components/Pagination.vue'
import api from '@/api';
import dayjs from 'dayjs'
import { ref, reactive } from 'vue';

const selectIds = ref([])
const tableData = ref([])
const total = ref(10)
const pageSize = ref(1)
const formInline = reactive({
    user: '',
    region: ''
})

dayjs

//撤销汇总---------
const handleEdit = (row) => {
    //获取当前行的id    row.id
    console.log('撤销操作');
    api.cancel({ id: row.id }).then(res => {
        console.log('撤销汇总-----------', res.data);
        if (res.data.status === 200) {
            //更新视图
            getCollectList()
        }
    })
}

//点击进入订单详情---
const OrderDesc = (row) => {
    // drawer.value = true
    console.log('点击进入订单详情-');
}

//选择table----
const selectChange = (selection) => {
    let arr = []
    selection.forEach(ele => {
        arr.push(ele.id)
    });
    selectIds.value = arr
    console.log('选择table---ids---', selectIds.value);
}

//获取分页-----------------
const CurrentChange = (page) => {
    console.log('分页', page);
    api.orderList(page)
}

//获取汇总清单列表--------------
const getCollectList = async (page) => {
    let res = await api.collect({ page })
    console.log('汇总清单列表----', res.data);
    if (res.data.status == 200) {
        tableData.value = res.data.data
        total.value = res.data.total
        pageSize.value = res.data.pageSize
    } else {
        console.log('请求失败');
        tableData.value = []
        total.value = 0
        pageSize.value = 1
    }
}

getCollectList()

</script>

<style lang="less" scoped>
.header {
    background: #fff;
    margin-bottom: 20px;
    padding: 10px;

    .el-form-item {
        padding: 16px;
    }

    .group {
        border: 1px solid #eee;
        padding: 8px;
    }
}

.content {
    background: #fff;

    /deep/ .active-header {
        color: #333;
        text-align: center;
    }

    /deep/ .table-center {
        text-align: center;
    }

    .pagination {
        padding: 10px;
    }
}
</style>