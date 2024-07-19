<template><el-dialog :title="title" v-model="dialogVisible" width="30%" :before-close="close">
    <strong>请输入类目名称：</strong>
    <el-input v-model="name" placeholder="请输入内容"></el-input>
    <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
    </span>
</el-dialog></template>

<script setup>
import api from '@/api';
import { ref, watch } from 'vue';

const emit = defineEmits(['updateViews'])
const props = defineProps(['input', 'cid'])
const dialogVisible = ref(false)
const title = ref('')
const name = ref('')
const id = ref('')

watch(() => props.input, (val) => {
    console.log('监听器======val', val);
    name.value = val.name
    id.value = val.id
})

//确定按钮
const submit = () => {
    if (title.value === '修改分类名称') {
        updateCategory(name.value, id.value)
    } else if (title.value === '新增一级分类名称') {
        insertCategory(name.value)
    } else {
        insertItemCategory(name.value, props.cid)
    }

    dialogVisible.value = false

    name.value = ''

    emit('updateViews')
}


//新增类目------
const insertItemCategory = async (name, cid) => {
    let res = await api.insertItemCategory({ name, cid })
    console.log('新增---', res.data);
    // if (res.data.status == 200) {
    // this.$message({
    //     message: '恭喜你，新增成功',
    //     type: 'success'
    // });
    // } else {
    // this.$message.error('错了哦，新增失败')
    // }
}

//修改名称----id name-----
const updateCategory = async (name, id) => {
    let res = await api.updateCategory({ name, id })
    console.log('修改-----', res.data);
    if (res.data.status == 200) {
        // this.$message({
        //     message: '恭喜你，修改成功',
        //     type: 'success'
        // });
    } else {
        // this.$message.error('错了哦，修改失败')
    }
}

//一级新增-----
const insertCategory = async (name) => {
    let res = await api.insertCategory(name)
    console.log('一级分类名称新增----', res.data);
    if (res.data.status == 200) {
        // this.$message({
        //     message: '恭喜你，新增成功',
        //     type: 'success'
        // });
    } else {
        // this.$message.error('错了哦，新增失败')
    }
}

//取消
const close = () => {
    dialogVisible.value = false
    name.value = ''
}

//暴露属性
defineExpose(
    {
        dialogVisible,
        title
    }
)

</script>

<style lang="less" scoped>
.title {
    margin-bottom: 10px;
    font-weight: bold;
}
</style>
