<template>
<div>
    <div class="list-header">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="产品名称">
                <el-input v-model="formInline.name" placeholder="产品名称" />
            </el-form-item>
            <el-form-item label="产品类型">
                <el-select v-model="formInline.region" placeholder="产品类型">
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
        <br>
        <el-button type="warning" :icon="Plus" @click="addGoods">添加商品</el-button>
        <el-button type="danger" :icon="Delete" @click="deleteAllSelected">删除商品</el-button>
    </div>

    <!-- 表格展示 -->
    <div class="wrapper">
        <el-table :data="tableData" style="width: 100%" border header-cell-class-name="active-header"
            cell-class-name="table-center" @select="selectHandle" @select-all="selectHandle">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="id" label="商品编号" width="120">
            </el-table-column>
            <el-table-column prop="title" label="商品名称" width="180" show-overflow-tooltip>
                <!-- <template slot-scope="scope">
                        <span style="color:blue; cursor: pointer;" @click="handleLook(scope.$index, scope.row)">{{
                            scope.row.title }}</span>
                    </template> -->
            </el-table-column>
            <el-table-column prop="price" label="商品价格" width="120">
            </el-table-column>
            <el-table-column prop="category" label="商品类目" width="140">
            </el-table-column>
            <el-table-column prop="create_time" label="添加时间" width="180" show-overflow-tooltip>
                <!-- <template slot-scope="scope">
                        <span>{{ moment(scope.row.create_time).format('YYYY-MM-DD HH:mm:ss') }}</span>
                    </template> -->
            </el-table-column>
            <el-table-column prop="sellPoint" label="商品卖点" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="descs" label="商品描述" show-overflow-tooltip>
                <!-- <template slot-scope="scope">
                        <span>{{ removeHTMLTag(scope.row.descs) }}</span> -->
                <!-- <div v-html="scope.row.descs"></div> -->
                <!-- </template> -->
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button size="small" :icon="EditPen" type="primary" @click="handleEdit(scope.$index, scope.row)">
                        编辑
                    </el-button>
                    <el-button size="small" :icon="Delete" type="danger" @click="handleDelete(scope.$index, scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <!-- 分页器 -->
    <Pagination :total="total" :pageSize="pageSize" @getCurrentPage="getCurrentPage"></Pagination>
</div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { EditPen, Delete, Plus } from '@element-plus/icons-vue'
import api from '@/api/index';
import dayjs from 'dayjs';
import { removeHTMLTag } from '@/utils/utils';
import Pagination from '@/components/Pagination.vue';
import { useRouter } from 'vue-router';
import { useGoodsStore } from '@/store/Goods';

//仓库
const goods = useGoodsStore()

//路由配置
const router = useRouter()
//搜索数据
const formInline = reactive({
    name: '',
    region: '',
})

//分页数据变量
const total = ref(0)
const pageSize = ref(0)

//表格数据
const tableData = ref([])

const dataArr = ref({})

//存储选择的ids
const ids = ref([])

//查询
const onSubmit = async () => {
    console.log('查询---submit!', formInline.name)
    let res = await api.search({
        search: formInline.name
    })
    console.log('查询结果', res.data);
    if (res.data.status === 200) {
        let arr = res.data.result
        dataArr.value = arr
        tableData.value = arr.slice(0.8)
        total.value = res.data.result.length
        pageSize.value = 8
    } else {
        tableData.value = []
        total.value = 0
        pageSize.value = 0
    }
}

//选择框
const selectHandle = (val) => {
    let arr = []
    val.forEach(ele => {
        arr.push(ele.id)
    })
    ids.value = arr
    console.log('选择框', arr);
}

//编辑
/*
    1. 点击编辑按钮  获取当前的row这一行的数据信息
    2，跳转到编辑组件（添加商品组件同一个组件）数据传递和title 
    3. pinia  存储  数据传递和title 
    
    4. 获取pinia里而的数据  更新最新的当前行的数据
    
*/
const handleEdit = (index, row) => {
    console.log('编辑---', row);
    goods.changeTitle('编辑')
    goods.changeRowData(row)
    router.push('/goods/addgoods')
}

//删除-----------
const handleDelete = async (index, row) => {
    console.log('删除---row', row);
    let res = await api.deleteItemById({
        id: row.id
    })
    console.log('删除---', res.data);
    if (res.data.status === 200) {
        ElMessage({
            message: 'Congrats, this is a success message.',
            type: 'success',
        })
        //更新视图
        projectList(1)
    }
}

//批量删除---
const deleteAllSelected = async (index, row) => {
    let res = await api.batchDelete({
        ids: ids.value
    })
    console.log('批量删除----', row);
    console.log('批量删除---', res.data);
    if (res.data.status === 200) {
        //更新视图
        projectList(1)
    }
}

//获取产品列表
const projectList = async (page) => {
    let res = await api.projectList({ page })
    console.log('获取产品列表', res.data);
    //处理数据
    let arr = res.data.data
    arr.forEach(ele => {
        ele.create_time = dayjs(ele.create_time).format('YYYY-MM-DD HH:mm:ss')
        ele.descs = removeHTMLTag(ele.descs)
    });
    tableData.value = res.data.data

    total.value = res.data.total
    pageSize.value = res.data.pageSize
}

//进入页面获取产品信息列表--
projectList(1)

//点击分页
const getCurrentPage = (val) => {
    console.log('点击分页', val);
    projectList(val)
}

//点击添加商品----
const addGoods = () => {
    goods.changeTitle('添加')
    router.push('/goods/addgoods')
}

</script>


<style lang="less" scoped>
.list-header {
    border: 1px solid #eee;
    padding: 10px;
    border-radius: 6pxs;
}

.el-form-item {
    margin-bottom: 0;
}

.wrapper {
    margin-top: 20px;
    margin-bottom: 20px;
}
</style>