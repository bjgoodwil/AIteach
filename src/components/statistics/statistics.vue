<template>
  <div class="statisticsScore">
      累计学习 <b>{{studyTime}}</b> 次
      <div id="statisticScore" ref="statisticScore" style="height: 360px" v-loading="loading"></div>
  </div>
</template>

<script>
import Vue from 'vue';
import {studentsApi} from '@/services/apis/students/students'
import echarts from 'echarts'
export default {
    name: 'statistics-score',
    props: {
        userId: {     //学生id
            type: String,
            default: function () {
                return '';
            }
        },
    },
    data () {
        return {
            loading:true,
            studyTime:null
        }
    },
    mounted() {
        this.draw();
    },
    methods: {
        draw(){
            this.loading = true;
            studentsApi.statisticalSampleByUserId({userId:this.userId}).then(response=>{
                this.studyTime = response.data.data.length;
                let statisticScore = echarts.init(this.$refs.statisticScore);
                let startTime = [];
                let scoreData = [];
                let chiefComplaintData = [];
                response.data.data.forEach(v=>{  
                    if (v.chiefComplaint) {
                        chiefComplaintData.push(v.chiefComplaint)
                    }else{
                        chiefComplaintData.push('xx病例');
                    } 
                    startTime.push(v.startTime);
                    scoreData.push(v.score);
                });
                let option = {
                    tooltip: {
                        trigger: 'axis',
                        formatter: function(params) {
                            var texts = "";
                            for (var i = 0; i < params.length; i++) {
                                if (i == 0 && chiefComplaintData) {
                                    texts +=chiefComplaintData[params[i].dataIndex] + "<br>";
                                }
                                texts +=params[i].seriesName + ": " + params[i].value + "<br>" + "学习时间: "+startTime[params[i].dataIndex];
                            }
                            return texts;
                        }
                    },
                    grid: {
                        left: 40,
                        right: 110
                    },
                    xAxis:  {

                        data: startTime,
                        name:'学习时间',
                    },
                    yAxis: {
                        type: 'value',
                        name:'分数',
                        min:0,
                        max:100,
                        nameGap:30,
                        axisTick: {
                            show: false
                        },
                        splitArea : {
                            show : true,
        
                        },//保留网格区域
                        splitLine:{
                            show:true
                        },

                    },
                    dataZoom: [
                        {
                            type: 'inside',
                            start: 0,
                            end: 100
                        },
                        {
                            start: 0,
                            end: 100
                        }
                    ],
                    visualMap: {
                        top: 0,
                        right: 0,
                        pieces: [{
                            gt: 0,
                            lte: 20,
                            color: '#cc0033'
                        }, {
                            gt: 20,
                            lte: 60,
                            color: '#ffde33'
                        }, {
                            gt: 60,
                            lte: 100,
                            color: '#096'
                        }],
                        outOfRange: {
                            color: '#999'
                        }
                    },
                    series: [
                        {
                            name:'本人成绩',
                            type:'line',
                            data:scoreData,
                            markLine: {
                                silent: true,
                                data: [{
                                    yAxis: 20
                                }, {
                                    yAxis: 60
                                }, {
                                    yAxis: 100
                                }]
                            }
                        }
                    ]
                };
                statisticScore.setOption(option);
                this.loading = false;
            })
        }
    },
    watch: {
        userId() {
          this.draw();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.hello{
  h1{
    font-weight: normal;
    font-size: 34px;
  }
}
</style>
