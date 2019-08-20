<template>
    <div class="stat">
        <p style="height: 32px;"><i class="el-icon-location-outline"></i> 统计 </p>
        <el-card class="box-card" v-loading="loading1">
            <div slot="header" class="clearfix">
                <span class="p-l-10">学员使用统计</span>（所有病例的学习次数）
            </div>
            <div class="text item">
                <div id="statisticsStudentUser" ref="statisticsStudentUser" style="height: 360px"></div>
            </div>
        </el-card>
        <el-card class="box-card m-t-20" v-loading="loading2">
            <div slot="header" class="clearfix">
                <span class="p-l-10">病例统计</span>（学习次数最多的病例）
            </div>
            <div class="text item">
                <div id="statisticsCaseNumber" ref="statisticsCaseNumber" style="height: 360px"></div>
            </div>
        </el-card>
    </div>
</template>

<script>
import {statApi} from '@/services/apis/stat/stat';
import echarts from 'echarts'
export default {
    name: 'stat',
    data () {
        return {
            loading1:true,
            loading2:true,
            
        }
    },
    mounted() {

        this.draw();
        this.draw2();
    },
    methods: {
        draw () {
             // 实例化echarts对象
            let statisticsStudentUser = echarts.init(this.$refs.statisticsStudentUser);
            statApi.statisticalSampleUser().then(response=>{
                this.loading1 = false;
                let responseData = response.data.data;
                let option = {
               
                    tooltip: {
                        trigger: 'axis'
                    },
                    dataZoom: [{
                        type: 'inside',
                        start: 0,
                        end: 100
                    }, {
                        start: 0,
                        end: 100,
                    }],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: responseData.map(function (item) {
                            return item.operationStartTime;
                        }),
                        name: '时间'
                    },
                    yAxis: {
                        type: 'value',
                        name: '人次'
                    },
                    series: [
                        {
                            name:'学习次数',
                            type:'line',
                            data: responseData.map(function (item) {
                                return item.count;
                            }),
                        },
                    ]
                }
                statisticsStudentUser.setOption(option);
            })
            
            
            // 绘制条形图
            //let option = {
                // title: {
                //     text: '折线图堆叠',
                // },
                // tooltip: {
                //     trigger: 'axis'
                // },
                // legend: {
                //     data:['住培生[一阶段]','住培生[二阶段]','研究生[硕士]','研究生[博士]','医学生[本科]','医学生[博士]'],
                //     orient:'vertical',
                //     top:'50',
                //     right:'20'
                // },
                // grid: {
                //     left: '3%',
                //     right: '150',
                //     bottom: '3%',
                //     containLabel: true,

                // },
                // toolbox: {
                //     feature: {
                //         saveAsImage: {}
                //     }
                // },
                // xAxis: {
                //     type: 'category',
                //     boundaryGap: false,
                //     data: ['周一','周二','周三','周四','周五','周六','周日'],
                //     name: '时间'
                // },
                // yAxis: {
                //     type: 'value',
                //     name: '人次'
                // },
                // series: [
                    // {
                    //     name:'住培生[一阶段]',
                    //     type:'line',
                    //     stack: '总量',
                    //     data:[120, 132, 101, 134, 90, 230, 210]
                    // },
                    // {
                    //     name:'住培生[二阶段]',
                    //     type:'line',
                    //     stack: '总量',
                    //     data:[220, 182, 191, 234, 290, 330, 310]
                    // },
                    // {
                    //     name:'研究生[硕士]',
                    //     type:'line',
                    //     stack: '总量',
                    //     data:[150, 232, 201, 154, 190, 330, 410]
                    // },
                    // {
                    //     name:'研究生[博士]',
                    //     type:'line',
                    //     stack: '总量',
                    //     data:[320, 332, 301, 334, 390, 330, 320]
                    // },
                    // {
                    //     name:'医学生[本科]',
                    //     type:'line',
                    //     stack: '总量',
                    //     data:[820, 932, 901, 934, 1290, 1330, 1320]
                    // },
                    // {
                    //     name:'医学生[博士]',
                    //     type:'line',
                    //     stack: '总量',
                    //     data:[920, 930, 890, 910, 1280, 1230, 1350]
                    // }
                //]
            //};

        },
        draw2(){
            let yAxisData = [];
            let seriesData = [];
            statApi.statisticalSample().then(response=>{
                for (var i = 0; i < response.data.data.length; i++) {
                    if (response.data.data[i].chiefComplaint) {
                        yAxisData.unshift(response.data.data[i].chiefComplaint)
                    }else{
                        yAxisData.unshift('xx病例');
                    }
                    seriesData.unshift(response.data.data[i].count)
                }
                this.loading2 = false;
                statisticsCaseNumber.setOption(option);
            })
            let statisticsCaseNumber = echarts.init(this.$refs.statisticsCaseNumber);
            let option = {
                // title: {
                //     text: '世界人口总量',
                //     subtext: '数据来自网络'
                // },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: 200,
                },
                xAxis: {
                    type: 'value',
                    name:'使用次数'
                },
                yAxis: {
                    type: 'category',
                    data: yAxisData,
                    name:'病例',
                },
                axisLabel: {
                    formatter: function(value) {
                        if (value.length > 15) {
                          return value.substring(0, 15) + "... ";
                        } else {
                          return value;
                        }
                    }
                },
                series: [
                    {
                        name: '学习次数',
                        type: 'bar',
                        barWidth : 12,//柱图宽度
                        itemStyle: {
                            normal: {
                                
                                barBorderRadius:12
                            },

                        },
                        data: seriesData
                    },

                ]
            };
            
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-card .el-card__header > div span{
    border-left: 4px #068efb solid;
    font-size: 16px;
}
</style>
