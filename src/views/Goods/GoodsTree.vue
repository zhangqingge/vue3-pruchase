<template>
<div>
    <el-tree :props="props" :load="loadNode" lazy show-checkbox @node-click="clickHandle" />
</div>
</template>

<script setup>
import api from '@/api/index';
const emit = defineEmits(['sendTreeData'])
const props = {
    label: 'name',
    children: 'zones',
    isLeaf: 'leaf',
}

//进入组件---动态默认加载的tree的方法---点击tree还会执行这个函数
const loadNode = async (node, resolve) => {
    if (node.level === 0) {
        let result = await selectItemCategoryByParentId(1)
        return resolve(result)
    }
    if (node.level >= 1) {
        let result = await selectItemCategoryByParentId(node.data.cid)
        return resolve(result)
    }
}

// 请求tree数据类目结构--------------------------
const selectItemCategoryByParentId = async (type) => {
    let res = await api.selectItemCategoryByParentId({ type })
    // console.log('tree数据类目结构-------', res.data);
    if (res.data.status === 200) {
        return res.data.result
    } else {
        return []
    }
}

//点击tree发送数据
const clickHandle = (data, node) => {
    // console.log('data',data,'node',node);
    emit('sendTreeData', data)
}
</script>

<style lang="less" scoped></style>