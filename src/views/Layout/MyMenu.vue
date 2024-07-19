<template>
<div>
  <el-menu default-active="activeMenu()" class="el-menu-vertical-demo" :collapse="isClose" background-color="#112f50"
    text-color="#fff" active-text-color="#ffd04b" router>
    <el-menu-item><template #title>
        <span>首客生鲜采购系统</span></template>
    </el-menu-item>
    <el-menu-item index="/">
      <el-icon>
        <ShoppingBag />
      </el-icon><span>系统首页</span>
    </el-menu-item>
    <el-sub-menu index="/goods">
      <template #title>
        <el-icon>
          <Grid />
        </el-icon>
        <span>产品管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/goods/list">产品列表</el-menu-item>
        <el-menu-item index="/goods/category">产品分类</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>

    <el-sub-menu index="/order">
      <template #title>
        <el-icon>
          <Grid />
        </el-icon>
        <span>订单管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/order/orderlist">订单列表</el-menu-item>
        <el-menu-item index="/order/collect">订单汇总</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
  </el-menu>
</div>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";

export default {
  props: ['isClose'],

  setup() {
    //定义开关
    // const isCollapse = ref(false);
    //使用路由
    const route = useRoute()
    console.log(route);

    const activeMenu = () => {
      let { path, meta } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }

    return {
      // isCollapse,
      route,
      activeMenu
    };
  },
};
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu {
  border-right: none;
}
</style>