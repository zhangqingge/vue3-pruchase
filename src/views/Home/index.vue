<template>
    <div class="home">
        <!--1.  顶部区域布局---------- -->
        <div class="header">
            <div class="item">
                总销售额
                <div class='num'>{{ homeInfo.saleTotal }}</div>
                <div class="bottom">今日销售额：{{ homeInfo.sale }}</div>
            </div>
            <div class="item">总访问量
                <div class='num'>{{ homeInfo.viewsTotal }}</div>
                <div class="bottom">今日访问量：{{ homeInfo.views }}</div>
            </div>
            <div class="item">总收藏量
                <div class='num'>{{ homeInfo.collectTotal }}</div>
                <div class="bottom">今日销售额：{{ homeInfo.collect }}</div>
            </div>
            <div class="item">总支付量
                <div class='num'>{{ homeInfo.payTotal }}</div>
                <div class="bottom">今日支付量：{{ homeInfo.pay }}</div>
            </div>
        </div>

        <!--2. 访问数据统计 ----------------->
        <div class="content">
            <div class="time-info border" id='box13'>
                <div class="title">月销售额</div>
                <div id="charts" style="width: 100%; height: 300px"></div>
            </div>
            <div class="area border" id="box1">比例分配
                <div id="main" style="width: 100%; height: 300px"></div>
            </div>
        </div>


        <!-- 3.  -->
        <!-- 最新内容 -->
        <div class="home-footer">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>今日订单</span>
                </div>
                <div class="text item">
                    <el-row>
                        <el-col :span="8">
                            <div>111</div>
                        </el-col>
                        <el-col :span="8">
                            <div>222</div>
                        </el-col>
                        <el-col :span="8">
                            <div>333</div>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>本月订单</span>
                </div>
                <div class="text item">
                    <el-row>
                        <el-col :span="8">

                            <div>111</div>
                        </el-col>
                        <el-col :span="8">
                            <div>222</div>
                        </el-col>
                        <el-col :span="8">
                            <div>333</div>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>快捷入口</span>
                </div>
                <div class="text item">
                    <el-button type="primary">产品管理</el-button>
                    <el-button>消息管理</el-button>
                    <el-button>内容管理</el-button>
                </div>
            </el-card>
        </div>

    </div>
</template>

<script>
import api from '@/api/index';
import { onMounted, reactive, ref, toRef, getCurrentInstance, inject } from 'vue';
export default {
    setup() {
        //定义统计数据变量-对象
        let homeInfo = reactive({ data: {} })
        // const homeInfo = ref({})

        //1.获取echarts
        const instance = getCurrentInstance();
        const echarts = instance.appContext.config.globalProperties.$echarts
        //2.获取echarts
        const $echarts = inject('echarts')
        //1.获取首页统计信息数据
        api.totalInfo().then(res => {
            console.log('获取首页统计信息数据', res.data.data.list);
            //语法：Object.assign(目标对象,要合并的对象)
            //1.响应式
            // Object.assign(homeInfo, res.data.data.list)
            //2.响应式
            let data = res.data.data.list
            homeInfo.data = data
            //3.响应式数据
            // homeInfo.value = data
        })
        //2.首页图标数据
        api.format().then(res => {
            console.log('获取绘制折线图---', res.data.result.data.sale_money);
            let arr = res.data.result.data.sale_money;
            //声明变量存储x轴 y轴数据
            let arrx = [], money = [], total = [], pieData = [];
            arr.forEach(ele => {
                arrx.push(ele.name)
                total.push(ele.num)
                money.push(ele.total_amount)
                //获取对象结构存储饼图数据-----
                let obj = {}
                obj.name = ele.name;
                obj.value = ele.total_amount;
                pieData.push(obj)
            });

            bar(arrx, money, total)
            pie(pieData)

        })

        //绘制柱状图
        const bar = (arrx, total, money) => {
            // var myChart = echarts.init(document.getElementById('charts'))
            let disab_com  = document.getElementById("charts")
            disab_com.removeAttribute('_echarts_instance_')
            var myChart = echarts.init(disab_com)
            // 指定图表的配置项和数据
            var option = {
                tooltip: {},
                xAxis: {
                    data: arrx
                },
                yAxis: {},
                series: [
                    {
                        name: '销售额',
                        type: 'line',
                        data: total,
                        smooth: true,
                    },
                    {
                        name: '销售量',
                        type: 'bar',
                        data: money,
                    },
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }
        //绘制饼图
        const pie = (pieData) => {
            let disab_com  = document.getElementById("main")
            disab_com.removeAttribute('_echarts_instance_')
            var myChart = echarts.init(disab_com)
            // var chartDom = document.getElementById('main');
            // var myChart = echarts.init(chartDom);
            var option;

            option = {
                title: {
                    text: 'Referer of a Website',
                    subtext: 'Fake Data',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: '50%',
                        data: pieData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };

            option && myChart.setOption(option);
        }

        //绘制图表
        // onMounted(() => {
        //     //柱状图
        //     bar()
        //     //饼图
        //     pie()

        // })

        return {
            homeInfo: toRef(homeInfo, 'data'),
            // homeInfo,
        }
    }
}
</script>

<style lang="less" scoped>
.home {
    margin: 10px;
}

.header {
    display: flex;
    padding-right: 30px;

    .item {
        flex: 1;
        height: 100px;
        padding: 10px;
        background: #fff;
        border-radius: 10px;
        margin-left: 20px;
        margin-right: 20px;
        font-weight: bold;
        color: #fff;

        position: relative;

        .num {
            font-size: 22px;
            margin: 10px;
            color: #fff;
        }

        .bottom {
            position: absolute;
            border-top: 1px solid rgb(246, 245, 245);
            padding: 10px 20px;
            bottom: 0;
            right: 0;
            left: 0;
            color: #fff;
            font-weight: normal;
        }
    }

    .item:nth-child(1) {
        background-image: linear-gradient(#df887d, #88554d);
    }

    .item:nth-child(2) {
        background-image: linear-gradient(#409eff, #2e556e);
    }

    .item:nth-child(3) {
        background-image: linear-gradient(#b54fa8, #713c7a);
    }

    .item:nth-child(4) {
        background-image: linear-gradient(#1cd2f1, #39717a);
    }
}

.border{
    border: 1px solid #eee;
    background: #eee;
}

.content {
    margin: 20px;
    display: flex;
    height: 320px;

    .time-info {
        flex: 2;
        background: #fff;
        margin-right: 20px;
        padding: 10px;
    }

    .area {
        flex: 1;
        background: #fff;
        padding: 10px;
    }
}

.home-footer {
    display: flex;
    padding-left: 20px;
    margin-bottom: 20px;

    .box-card {
        flex: 1;
        margin-right: 30px;

        span {
            font-weight: 600;
        }
    }
}
</style>