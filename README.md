# vue3-pruchase

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



## 项目介绍
    后台采购系统


## 安装依赖
1. vue create vue3-projuct
2. npm i axios -S
3. npm i echarts -S
4. npm i element-plus -S
5. npm i dayjs -S
6. npm i momentjs -S
7. npm i normalize.css -S


## 后端
    nodejs+mysql+Express


1. npm i express -S
2. npm i cors -S
3. npm i mysql -S
4. npm i multer -S
5. npm i mockjs -S

## 在项目中引入 Apache Echarts
1. 安装
    npm install echarts --save

2. 配置

## pinia
    npm install pinia


## 导出excel
1. 安装模块
    npm install vue-json-excel -S
    npm install file-saver -S
    npm install xlsx -S (报错：module not found can't resolve xlsx，所以加了这个)

2. 配置使用
    ```js
        import JsonExcel from 'vue-json-excel'
        Vue.component('downloadExcel',JsonExcel)
    ```

    ```js
        import * as XLXS from "xlsx"
        import FileSaver from "file-saver"
    ```

3. 使用
    ```vue
        <download-excel
        style="display:inline-block;margin-left:10px;"
        :data="DetailsForm"
        :fields="json_fields"
        :header="title"
        :name="title">
        <el-button class="order-btn" type="warning" size="small" @click="download">导出</el-button>
        </download-excel>
    ```