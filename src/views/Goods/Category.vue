<template>
<div class="category">
    <Breadcrumb></Breadcrumb>
    <div class="wrapper">
        <div class="title">产品类目管理</div>
        <div class="tree">
            <!-- 一级按钮 -->
            <el-button type="warning" style="margin-bottom:20px;" @click="addCategory">新增一级导航类目</el-button>
            <!-- tree内容结构 -->
            <el-tree :data="data" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false"
                :render-content="renderContent" :props="defaultProps">
            </el-tree>
        </div>
    </div>

    <!-- 弹框 -->
    <Dialog :input="input" ref="myDialog" :cid="cid" @updateViews="updateViews"></Dialog>
</div>
</template>

<script setup>

import { ref } from 'vue'
import api from '@/api';
import Dialog from './Dialog.vue';

import {
    Plus,
    Delete,
    EditPen,
} from '@element-plus/icons-vue'

let id = 1000
//定义弹框ref
const myDialog = ref()

const cid = ref('')
const input = ref({})
const data = ref([])


//更新视图
const updateViews = () => {
    itemCategory()
}

//新增一级目录-------------------------------------
const addCategory = () => {
    myDialog.value.dialogVisible = true
    myDialog.value.title = '新增一级分类名称'
}

//新增子类------------------------------------
const append = (data) => {
    console.log('新增-----myDialog.dialogVisible--', myDialog.value.dialogVisible);
    myDialog.value.dialogVisible = true
    myDialog.value.title = `新增${data.name}子级分类`
    cid.value = data.cid
}

//删除  
const remove = (node, data) => {
    console.log('删除');
    deleteContentCategoryById(data.id)

}

//修改
const update = (node, data) => {
    input.value = { name: data.name, id: data.id }
    console.log('修改', data, input);
    myDialog.value.dialogVisible = true
    myDialog.value.title = '修改分类名称'

}

//树节点的内容区渲染
// const renderContent = (h, { node, data, store }) => {
//     // console.log('树节点的内容区的渲染------', node, data);
//     return (
//         <span class="custom-tree-node">
//             <span class='name'>{data.name}</span>
//             {
//                 data.type == 1 ? <span>
//                     <el-button class='mini' onClick={() => append(data)} icon="Plus">新增</el-button>
//                     <el-button class='mini' onClick={() => update(node, data)} icon="EditPen">修改</el-button>
//                     <el-button class='mini' type="danger" onClick={() => remove(node, data)} icon="Delete">删除</el-button>
//                 </span> : <span>
//                     <el-button class='mini' onClick={() => update(node, data)} icon="EditPen">修改</el-button>
//                     <el-button class='mini' type="danger" onClick={() => remove(node, data)} icon="Delete">删除</el-button>
//                 </span>}

//         </span>);
// }

const renderContent = (h, { node, data, store }) => {
    return h(
        'span',
        {
            class: 'custom-tree-node',
        },
        h('span', { class: 'name' }, data.name),
        h(
            'span',
            null,
            h(
                'a',
                {
                    style: 'margin-left: 8px; color:skyblue;',
                    onClick: () => append(data),
                },
                '新增 '
            ),
            h(
                'a',
                {
                    style: 'margin-left: 8px; color:skyblue;',
                    onClick: () => update(node, data),
                },
                '修改 '
            ),
            h(
                'a',
                {
                    style: 'margin-left: 8px; color:red;',
                    onClick: () => remove(node, data),
                },
                '删除'
            )
        )
    )
}

//删除接口------
const deleteContentCategoryById = async (id) => {
    let res = await api.deleteContentCategoryById({ id })
    console.log('删除接口-----', res.data);
    if (res.data.status == 200) {
        itemCategory()
    }
}

//请求tree数据
const itemCategory = async () => {
    let res = await api.itemCategory()
    console.log('获取类目列表展示----', res.data.result);
    let result = res.data.result
    //获取一级目录
    let arr = [], arr2 = []
    result.forEach(ele => {
        if (ele.type === 1) {
            ele.children = []
            arr.push(ele)
        } else {
            arr2.push(ele)
        }
    })
    console.log(arr, arr2);

    arr.forEach(ele => {
        arr2.forEach(item => {
            if (ele.cid === item.type) {
                ele.children.push(item)
            }
        })
    })
    console.log(arr);
    data.value = arr
}
itemCategory()


</script>

<style lang="less" scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.category {
    margin: 10px;
}

.wrapper {
    padding: 10px;
    margin-top: 10px;
    background: #fff;

    .title {
        background: #f6f6f6;
        height: 50px;
        line-height: 50px;
        font-weight: bold;
        padding-left: 10px;
    }

    .tree {
        margin: 10px;

        /deep/ .mini {
            padding: 4px 10px;
            font-size: 14px;
        }

        /deep/ .el-tree-node__content {
            margin-bottom: 10px;
        }
    }

    /deep/ .name {
        width: 300px;
        display: inline-block;
    }
}
</style>