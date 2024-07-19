<template>
    <div>
        <el-pagination 
            v-model:current-page="currentPage" 
            v-model:page-size="props.pageSize"
            layout="total,  prev, pager, next, jumper" 
            :total="props.total"
            @current-change="handleCurrentChange" 
            />
    </div>
</template>

<script setup>
import { ref } from 'vue'

//props接收变量----setup简写
const props = defineProps(['total','pageSize'])

//传递给父组件事件
const emit= defineEmits(['getCurrentPage'])

const currentPage = ref(1)
// const pageSize = ref(1)
// const total = ref(10)

const handleCurrentChange = (val) => {
    console.log(`current page: ${val}`)
    emit('getCurrentPage',val)
}
</script>

<style></style>