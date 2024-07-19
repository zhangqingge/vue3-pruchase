<template>
<div>
    <!-- <Breadcrumb></Breadcrumb> -->
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
            <el-button size="small" type="warning" @click="orderCollect">订单汇总</el-button>
            <el-button size="small" type="warning" @click="download">导出</el-button>
        </div>
    </div>
    <!-- 表格区域 -->
    <div class="content">
        <el-table id="table" :data="tableData" border style="width: 100%" header-cell-class-name="active-header"
            cell-class-name="table-center" @select="select">
            <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
            <el-table-column prop="code" label="订单编号" width="180">
                <template #default="scope">
                    <span @click="OrderDesc(scope.row)" style="color: blue; cursor: pointer;">{{ scope.row.code
                        }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="ordername" label="下单人"></el-table-column>
            <el-table-column prop="company" label="所属单位"></el-table-column>
            <el-table-column prop="phone" label="联系电话"></el-table-column>
            <el-table-column prop="yudingTime" label="预定时间">
                <template #default="scope">
                    <span>
                        {{ dayjs(scope.row.yudingTime).format('YYYY-MM-DD') }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="price" label="订单总价格"></el-table-column>
            <el-table-column prop="huizongStatus" label="汇总状态">
                <template #default="scope">
                    <span v-if="scope.row.huizongStatus == 1">未汇总</span>
                    <span v-else>已汇总</span>
                </template>
            </el-table-column>

        </el-table>

        <!-- 分页 -->
        <Pagination :total="total" :pageSize="pageSize" @CurrentChange="CurrentChange"></Pagination>
    </div>

    <!-- 抽屉组件 -->
    <el-drawer title="订单详情" v-model="drawer" :direction="direction" :size="size">
        <orderDesc></orderDesc>
    </el-drawer>
</div>
</template>

<script setup>
import Pagination from '@/components/Pagination'
import api from '@/api';
import orderDesc from './orderDesc.vue'
import dayjs from 'dayjs'
import { reactive, ref, onMounted } from 'vue';
//导出excel
import * as XLXS from 'xlsx'
import FileSaver from "file-saver"

const name = ref('生鲜采购')
const drawer = ref(false)
const size = ref('')
const direction = ref('rtl')
const selectIds = ref([])
const tableData = ref([])
const total = ref(10)
const pageSize = ref(1)
const formInline = reactive({
    user: '',
    region: ''
})


onMounted(() => {
    let width = document.documentElement.clientWidth
    console.log('width', width);
    size.value = width - 200 - 10 + 'px'
})

dayjs
//导出表格
const download = () => {
    const wb = XLXS.utils.table_to_book(document.getElementById("table"), {
        raw: true
    })
    const wbout = XLXS.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
    })
    try {
        FileSaver.saveAs(new Blob([wbout], {
            //定义文件格式
            type: "application/octet-stream"
        }),
            name.value + ".xlsx"
        )

    } catch (e) {
        console.log(e);
    }
    return wbout
}

//点击进入订单详情界面------------
const OrderDesc = (row) => {
    drawer.value = true
    console.log('详情', drawer.value);
}

//选择勾选内容-------------------
const select = (selection) => {
    let arr = []
    selection.forEach(ele => {
        arr.push(ele.id)
    });
    selectIds.value = arr
    console.log('选择-----', selectIds.value);
}

//订单汇总
const orderCollect = () => {
    if (selectIds.value.length > 1) {
        let ids = selectIds.value.join(',')
        getchangeStatus(ids)
    } else {

    }
}

//禁用按钮--------------
const selectable = (row, index) => {
    if (row.huizongStatus == 2) {
        return false
    } else {
        return true
    }
}

//获取分页的页码-----------------
const CurrentChange = (page) => {

    getorderList(page)
    console.log('page', page);
}

//获取订单列表-----------------------
const getorderList = async (page) => {
    let res = await api.orderList({ page })
    console.log('订单列表----', res.data);
    if (res.data.status === 200) {
        tableData.value = res.data.data
        //页码
        pageSize.value = res.data.pageSize
        total.value = res.data.total
    } else {
        console.log('请求失败');
        tableData.value = []
        pageSize.value = 0
        total.value = 1
    }
}
getorderList()

//订单汇总接口-----------
const getchangeStatus = async (ids) => {
    let res = await api.changeStatus({ ids })
    console.log('订单汇总接口-----', res.data);
    if (res.data.status === 200) {
        api.orderList()
    } else {

    }
}

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

.export-excel-wrapper {
    display: inline-block;
    margin-left: 10px;

    button {
        padding-left: 30px;
        padding-right: 30px;
    }
}
</style>