<template>
<div>
    <div style="border: 1px solid #ccc">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
            :mode="mode" />
        <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
            :mode="mode" @onCreated="handleCreated" @onChange="onChange" />
    </div>
</div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const emit = defineEmits(['sendWangEditor'])

const mode = 'default' // 或 'simple'

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>hello</p>')

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

//修改WangEditor
const onChange = (editor) => {
    console.log('content', editor.children[0].children[0].text);
    emit('sendWangEditor', editor.children[0].children[0].text)
}

//清空方法
const clearWang = () => {
    valueHtml.value = ''
}

//设置内容
const setWangHtml = (val) => {
    valueHtml.value = val
}

//暴露方法
defineExpose({
    clearWang,
    setWangHtml
})

</script>

<style lang="scss" scoped></style>