<template>
<div>
    <el-upload v-model:file-list="props.fileList" :action="uploadUrl" list-type="picture-card"
        :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess">
        <el-icon>
            <Plus />
        </el-icon>
    </el-upload>

    <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
// import type { UploadProps, UploadUserFile } from 'element-plus'
import { host, uploadUrl } from '@/api/base';

const props = defineProps(['fileList'])
const emit = defineEmits(['sendImg'])

//数据结构；[{name:'',url:''}]
// const fileList = ref([])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview = (uploadFile) => {
    // dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}

//上传成功
const handleSuccess = (response, file, fileList) => {
    console.log('成功', response, file, fileList);

    let url = response.url.slice(7)
    let imgUrl = host + '/' + url;
    console.log('url', imgUrl);

    emit('sendImg', imgUrl)
}

</script>

<style lang="less" scoped></style>