<template>
    <div>
        <div class="menu">
            <MyMenu :isClose="isClose"></MyMenu>
        </div>
        <div class="content" :class="{ active: isClose }">
            <Content :isClose="isClose" @change="change"></Content>
        </div>
    </div>

</template>

<script>
import MyMenu from './MyMenu.vue'
import Content from './Content.vue'
import { ref } from "vue";

export default {
    components: {
        MyMenu,
        Content
    },
    setup() {
        //定义变量
        const isClose = ref(false);

        //修改变量
        const change = () => {
            isClose.value = !isClose.value

        };

        return {
            isClose,
            change
        };
    }

}
</script>

<style lang="less" scoped>
.menu {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    background: #112f50
}

.content {
    padding-left: 200px;
}

.active {
    padding-left: 64px;
}
</style>
