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
        <el-card class="box-card m-t-20 pos-r" ref="elCard">
            <div class="explain pos-a" :style="tipOffset" v-show="showtooltip">{{tipcontent}}</div>
            <div slot="header" class="clearfix">
                <span class="p-l-10">多维度统计</span> 
                <el-select v-model="timeRange" placeholder="请选择" size="small" class="floatRight" style="width: 100px;">
                    <el-option  v-for="item in [{label:'近7天', value:7},{label:'近30天', value:30},{label:'近一年', value:365}]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="text item">
                <div id="statisticsDimensions " ref="statisticsDimensions" style="height: 360px"></div>
            </div>
            
        </el-card>
        <el-card class="box-card m-t-20">
            <div slot="header" class="clearfix">
                <span class="p-l-10">教师使用统计</span>（教师登陆时间）
            </div>
            <div class="text item">
                <el-table :data="teacherData" stripe >
                    <el-table-column
                      label="序号"
                      type="index"
                      width="50">
                    </el-table-column>
                    <el-table-column prop="name" label="教师名字">
                    </el-table-column>
                    <el-table-column prop="loginTime" label="登陆时间">
                    </el-table-column>
                </el-table>
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
            timeRange:365, //时间范围
            showtooltip: false, //显示提示语
            tipOffset:{},   //描述语偏移量
            tipcontent:'',  //描述语
            appraiseList: {
                严谨性: { text: "诊断与鉴别诊断的全面性评价"},
                逻辑性: { text: "问诊、查体、诊断的逻辑顺序评价"},
                系统性: { text: "答题完成率的综合评价"},
                敏捷性: { text: "答题时间的综合评价"},
                拓展性: { text: "诊断与鉴别诊断的准确性评价"},
                多维度: { text: "对整体健康情况做出诊疗的综合评价"},
            },
            teacherData:[]
        }
    },
    mounted() {

        this.draw();
        this.draw2();
        this.draw3();
        this.getLog();
    },
    methods: {
        draw(){
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
            
        },
        draw3(){
            let Vdata = [
                {
                    value: [60,73,85,40,70,40],
                    name: '住培生[一阶段]',
                },{
                    value: [64,70,56,48,60,50],
                    name: '住培生[二阶段]'
                },{
                    value: [86,64,70,54,76,60],
                    name: '研究生[硕士]'
                },{
                    value: [67,87,85,65,74,47],
                    name: '研究生[博士]'
                },{
                    value: [65,68,75,60,75,53],
                    name: '医学生[本科]'
                },{
                    value: [70,86,85,64,73,60],
                    name: '医学生[博士]'
                }
            ]; //虚拟数据
            let statisticsDimensions = echarts.init(this.$refs.statisticsDimensions);
            statApi.statisticalScore().then(response=>{
                let responseData = response.data.data;
                console.log(responseData)
                let option = {
                    legend: {
                        data: ['住培生[一阶段]','住培生[二阶段]', '研究生[硕士]', '研究生[博士]', '医学生[本科]', '医学生[博士]'],
                        orient: 'vertical',
                        x: 'left',
                    },
                    tooltip: {},
                    radar: {
                        // shape: 'circle',
                        name: {
                            textStyle: {
                                color: '#fff',
                                backgroundColor: '#999',
                                borderRadius: 3,
                                padding: [3, 5]
                           }
                        },
                        indicator: [
                           { name: '系统性', max: 100},
                           { name: '敏捷性', max: 100},
                           { name: '逻辑性', max: 100},
                           { name: '拓展性', max: 100},
                           { name: '多维度', max: 100},
                           { name: '严谨性', max: 100},
                        ],
                        triggerEvent: true
                    },
                    series: [{
                        type: 'radar',
                        tooltip: { trigger: 'item'},
                        data: responseData.map(function (item) {
                            return {value:[item.xtxScore||0,item.mjxScore||0,item.ljxScore||0,item.zstzScore||0,item.dwdScore||0,item.yjxScore||0],name:item.identity}
                        })
                    }]
                };
                statisticsDimensions.setOption(option);
            })
            statisticsDimensions.on('mouseover', params=> {
                if(params.componentType == 'radar'){
                    this.showtooltip = true;
                    //console.log(params.event.offsetX+":"+params.event.offsetY)
                    this.tipcontent = this.appraiseList[params.name].text;
                    this.tipOffset = {
                        top:(params.event.offsetY+100) + "px",
                        left:params.event.offsetX + "px"
                    }
                    if (params.event.offsetX < this.$refs.elCard.$el.clientWidth/2) {
                        this.tipOffset.left = (params.event.offsetX-100) + "px"
                  
                    }
                } 
            });
            statisticsDimensions.on('mouseout', params=> {
                this.showtooltip = false;
            });
        },
        getLog(){
            statApi.operationLog().then(response=>{
                this.teacherData = response.data.data;
            })
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
.el-icon-warning-outline{
    font-size: 16px;
}
.explain{
    background: rgba(0,0,0,.6);
    color: #fff;
    border-radius: 4px;
    padding: 6px 10px;
    max-width: 140px;
    z-index: 999;
}
</style>
