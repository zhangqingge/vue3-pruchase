<template>
<div>
    <el-row :gutter="20">
        <el-col :span="4">
            <div class="nav">
                <div class="title">产品类型列表</div>
                <div class="tree">
                    <GoodsTree @sendTreeData="sendTreeData"></GoodsTree>
                </div>
            </div>
        </el-col>
        <el-col :span="20">
            <div class="wrapper">
                <div class="my-title">商品{{ goods.title }}</div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="所属分类" prop="category">
                        <span>{{ ruleForm.category }}</span>
                    </el-form-item>
                    <el-form-item label="商品名称" prop="title">
                        <el-input v-model="ruleForm.title" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="price">
                        <el-input v-model="ruleForm.price" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="num">
                        <el-input v-model="ruleForm.num" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="商品卖点" prop="sellPoint">
                        <el-input v-model="ruleForm.sellPoint" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="上传图片" prop="image">
                        <GoodsUpload @sendImg="sendImg" :fileList="fileList"></GoodsUpload>
                    </el-form-item>
                    <el-form-item label="商品描述" prop="descs">
                        <WangEditor @sendWangEditor="sendWangEditor" ref="myEditor"></WangEditor>
                    </el-form-item>

                    <el-form-item label="首页轮播推荐" prop="isShow">
                        <el-switch v-model="ruleForm.isShow" active-color="#13ce66"
                            inactive-color="#ff4949"></el-switch>
                    </el-form-item>
                    <el-form-item label="是否推荐商品" prop="isShow">
                        <el-switch v-model="ruleForm.isShow" active-color="#13ce66"
                            inactive-color="#ff4949"></el-switch>
                    </el-form-item>
                    <el-form-item label="是否上架商品" prop="isShow">
                        <el-switch v-model="ruleForm.isShow" active-color="#13ce66"
                            inactive-color="#ff4949"></el-switch>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-show="title != '详情'" type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
                        <el-button v-show="title != '详情'" @click="resetForm(ruleFormRef)">重置</el-button>
                        <el-button @click="closePage">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<script setup>
import { nextTick, reactive, ref } from 'vue';
import GoodsTree from './GoodsTree.vue'
import GoodsUpload from './GoodsUpload.vue'
import WangEditor from './WangEditor.vue'
import api from '@/api/index'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import { useGoodsStore } from '@/store/Goods';

const goods = useGoodsStore()

const router = useRouter()

//图片容器
const fileList = ref([])
const myEditor = ref()
const ruleFormRef = ref()

//表格容器
const ruleForm = reactive({
    id: '',
    title: '',
    num: '',
    price: '',
    sellPoint: '',
    image: [],
    descs: '',
    category: '',
    cid: '',
    isShow: true,
})
const rules = reactive({
    rules: {//表单验证规则
        title: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        num: [
            { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        category: [
            { required: true, message: '请输入商品类目', trigger: 'blur' },
        ]
    }
})

//获取vuex里面数据
if (goods.title === '编辑') {
    console.log('goods.rowData---', goods.rowData);
    //goodsForm = goods.rowData
    Object.assign(ruleForm, goods.rowData)
    //获取images  fileList=[{name:'',url:''}]
    let arr = JSON.parse(goods.rowData.image)
    ruleForm.image = arr
    let img = []
    arr.forEach(ele => {
        let obj = {}
        obj.url = ele
        img.push(obj)
    });
    fileList.value = img

    //wangEditor数据
    nextTick(() => {
        myEditor.value.setWangHtml(goods.rowData.descs)
    })

    console.log('ruleForm--', ruleForm);
}

//接收tree点击的数据
const sendTreeData = (val) => {
    console.log('点击接收tree的数据', val);
    ruleForm.cid = val.cid
    ruleForm.category = val.name
}

//接收上传的图片---
const sendImg = (url) => {
    console.log('接收上传的图片---', url);
    ruleForm.image.push(url)
}

//接收WangEditor数据
const sendWangEditor = (val) => {
    console.log('接收WangEditor数据---', val);
    ruleForm.descs = val
}

//添加商品
const insertTbItem = async (params) => {
    let res = await api.insertTbItem(params)
    if (res.data.status === 200) {
        //跳转路由
        router.push('/goods/list')
        //信息提示
        ElMessage({
            message: '恭喜你，添加商品成功',
            type: 'success',
        })
    } else {
        //错误信息提示
        ElMessage.error('添加商品失败')
    }
}

//修改(编辑)商品接口
const updateTbItem = async (params) => {
    let res = await api.updateTbItem(params)
    console.log('修改结果---', res.data);
    if (res.data.status === 200) {
        //跳转到产品列表界面
        router.push('/goods/list')
    } else {

    }
}

//保存
const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('添加商品', ruleForm);
            //接口：title, image, sellPoint, price, cid, category, num, descs
            let { id, title, cid, category, sellPoint, price, num, descs, image } = ruleForm

            //判断按钮状态   添加  编辑
            if (goods.title == '添加') {
                insertTbItem({
                    title, cid, category, sellPoint, price, num, descs,
                    image: JSON.stringify(image),
                })
            } else {
                //编辑操作
                console.log('修改商品----', ruleForm);
                updateTbItem({
                    id, title, image: JSON.stringify(image), sellPoint, price, cid, category, num, descs
                })
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}

//重置
const resetForm = (formEl) => {
    if (goods.title === '添加') {
        if (!formEl) return
        formEl.resetFields()
        fileList.value = []
        myEditor.value.clearWang()
    } else {
        //编辑重置---
        Object.assign(ruleForm, goods.rowData)
        //获取images  fileList=[{name:'',url:''}]
        let arr = JSON.parse(goods.rowData.image)
        ruleForm.image = arr
        let img = []
        arr.forEach(ele => {
            let obj = {}
            obj.url = ele
            img.push(obj)
        });
        fileList.value = img

        //wangEditor数据
        nextTick(() => {
            myEditor.value.setWangHtml(goods.rowData.descs)
        })
    }

}

//取消
const closePage = () => {
    router.push('/goods/list')
}



</script>

<style lang="less" scoped>
.nav {
    height: 600px;
    background: #fff;

    .title {
        background: skyblue;
        padding: 20px;
        color: #fff;
    }

    .tree {
        padding: 20px;
    }
}

.wrapper {
    // height: 800px;
    background: #fff;

    .my-title {
        background: #eee;
        padding: 14px;
        color: #333;
        font-weight: bold;
        // margin-bottom: 30px;
    }

    .demo-ruleForm {
        padding: 20px;
    }
}
</style>