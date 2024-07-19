//导入
import { defineStore } from "pinia";

export const useGoodsStore = defineStore('goods', {
    state: () => ({
        rowData: {},
        title: '添加'
    }),
    getters: {

    },
    actions: {
        //设置数据
        changeTitle(playoad) {
            this.title = playoad
        },
        changeRowData(playoad) {
            this.rowData = playoad
        },
        //清空
        clearGoods() {
            this.title = '添加'
            this.rowData = {}
        }
    }
})