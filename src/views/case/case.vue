<template>
    <div class="case">
		
    	<el-row type="flex" class="row-bg m-b-20">
		  <el-col :span="8"><div class="grid-content">
			<img class="floatLeft logo" src="../../assets/case/a.png" alt="">
		  	<div class="floatLeft">
				<p>疾病类别</p>
				<p>60个</p>
		  	</div>
		  </div></el-col>
		  <el-col :span="8"><div class="grid-content">
		  	<img class="floatLeft logo" src="../../assets/case/b.png" alt="">
		  	<div class="floatLeft">
				<p>虚拟病例</p>
				<p>400例</p>
		  	</div>
				
		  </div></el-col>
		  <!-- <el-col :span="8"><div class="grid-content">
			<img class="floatLeft logo" src="../../assets/logo.png" alt="">
		  	<div class="floatLeft">
				<p>平台用户</p>
				<p>2000个</p>
		  	</div>
		  </div></el-col>
 -->		</el-row>
		<el-button type="primary" round class="addBtn floatRight pos-r" size="small" @click="addCase"><i class="el-icon-plus"></i> 添加疾病</el-button>
    	<el-tabs v-model="activeName" @tab-click="tabClick1">
    		<el-tab-pane v-for="(item,index) in data" :key="item.id" :label="item.typeName" :name="item.id.toString()">
    			<p class="symptomBox clearfix">
					<label for="" class="floatLeft">症状：</label>
					<ul class="symptomList clearfix">
					
						<li class="floatLeft" v-for="(item,index) in symptomList" :key="item.id" :class="{ symptomActive: index == symptomIndex}" @click="selectSymptom(index)">{{item.name}}</li>
					</ul>
    			</p>
				<el-tabs tab-position="left" v-model="activeClass" @tab-click="tabClick2">
					<el-tab-pane v-for="(it,eq) in item.list" :key="it.id" :label="it.typeName" :name="it.id.toString()">
						<ul class="specialtyList" v-loading="fullscreenLoading">
								
								<li class="caseItem pos-r" v-for="(i,e) in listDisease" :key="i.id"
								>
									<el-tooltip placement="right">
										<span :title="i.diseaseName">{{i.diseaseName}}</span> 

										<div slot="content">
											
										  	<a style="cursor: pointer;" @click="toCaseInfo(i)">详情</a>&nbsp; 
										  	<a style="cursor: pointer;" @click="toAddCase(i)">编辑</a>&nbsp; 
										  	<a style="cursor: pointer;" v-if="i.count == 0" @click="deleteDis(e,i,listDisease)">删除</a>
										
										</div>
									</el-tooltip>
									<span class="diseaseNum">{{i.count}}例</span>
								</li>
								
						</ul>
						
						
						<!-- <p v-for="(l,e) in it.list[0]">{{l.diseaseName}}</p> -->
					</el-tab-pane>
					
				</el-tabs>
    		</el-tab-pane>
		  
		</el-tabs>
    </div>
</template>
<script>
import {diseaseApi} from '@/services/apis/disease/disease'

export default {
	name: 'case',
	data () {

	    return {
	    	fullscreenLoading: false,
	    	data: {},
	        activeName:'',  //当前一级科室分类
	        activeClass:'', //当前二级科室分类
	        listDisease: [],//疾病列表
	        dialogVisible: false,
	        caseName: '',//添加的疾病症状名称
	        symptomList:[{name:'全部',id:'0'},{name:'腹痛',id:'1'},{name:'低热',id:'2'},{name:'食欲不振',id:'3'}], //症状
	        symptomIndex:0,
	    }
	},
	mounted() {
        // this.activeName = this.data.data.specialty_list[0].specialty_name;
        // this.activeClass = [];
        // for (var i = 0; i < this.data.data.specialty_list.length; i++) {

        	
        // 		this.activeClass.push(this.data.data.specialty_list[i].sub_specialty_list[0].sub_specialty_name)
        		
        	
        // }
        diseaseApi.listDiseaseType({fatherTypeId:0}).then(response=>{

            this.data = response.data.data.diseaseTypeList;
            this.activeName = this.data[0].id.toString();
            this.getDiseaseType(this.data[0].id,0)
        });
    },
  	methods: {
  		//获取科室分类列表
	    getDiseaseType(id,index){
	    	this.fullscreenLoading = true;
	    	diseaseApi.listDiseaseType({fatherTypeId:id}).then(response=>{
	    		this.data[index].list = response.data.data.diseaseTypeList;
	    		this.activeClass = this.data[index].list[0].id.toString();
	    		this.getListDisease(this.data[index].list[0].id)
	    	})
	    	
	    },
	    //获取疾病列表
	    getListDisease(id){
	    	this.fullscreenLoading = true;
	    	diseaseApi.listDisease({typeId:id}).then(response=>{
	            this.listDisease = response.data.data.diseasevolist;
	            this.fullscreenLoading = false;
	        })
	    	
	    },
	    //点击第一级科室分类
	    tabClick1(tag){
	    	this.fullscreenLoading = true;
	    	this.getDiseaseType(tag.name,tag.index);
	    },
	    //点击第二级科室分类，获取疾病
	    tabClick2(tag){
	    	this.fullscreenLoading = true;
	    	this.getListDisease(tag.name);
	    },
	    handleClick(tab, event) {
	        console.log(tab, event);
	    },
	    handleChange(value) {
	        console.log(value);
	    },
	    //
	    addCase(){
	    	this.$router.push({name:'addCase'})
	    },
	    /**
		 * 删除疾病
		 * @param  {[type]} index   [索引值]
		 * @param  {[type]} row [当前行数据]
		 * @param  {[type]} rows [列表数据]
		 * @return {[type]}      [description]
		 */
	    deleteDis(index,row,rows){
	    	this.$confirm('确定删除该病例吗?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	diseaseApi.deleteDisease({diseaseId:row.disease.id}).then(response=>{
	        		rows.splice(index, 1);
			        this.$message({
			            type: 'success',
			            message: '删除成功!'
			        });
				})
	        }).catch(() => {
	                  
	        });
	    },
	    //to疾病详情
	    toCaseInfo(caseName){
	    	this.$router.push({ 
	    		name: 'caseInfo', 
	    		query:{
	    			diseaseId:caseName.id,
	    			diseaseName:caseName.diseaseName,
	    			activeName:this.activeName,
	    			activeClass:this.activeClass
	    		},
	    		params: caseName,
	    	});
	    },
	    //to编辑疾病
	    toAddCase(caseName){
	    	this.$router.push({ 
	    		name: 'addCase',
	    		query:{
	    			activeName:this.activeName,
	    			activeClass:this.activeClass
	    		},
	    		params: caseName});
	    },
	    selectSymptom(index){
	    	this.symptomIndex = index;
	    },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.formItem{
	height: 50px;
}
.addBtn{
	z-index: 999;
}
.row-bg{
	background: #fafafa;
	padding: 20px;
}
.el-row .el-col.el-col-8{
	margin-right: 1%;
	.logo{
		width: 70px;
	}
	p{
		font-size: 18px;
		margin-top: 6px;
		margin-left: 20px;
	}
}
.specialtyList{


    width: 100%;
	.caseItem{
		list-style: none;
	    display: inline-block;
	    height: 100%;
	    min-width: 186px;
	    line-height: 38px;
	    margin: 0 30px;
	    font-size: 14px;
	    span:first-child {
		    color: #666;
		    display: inline-block;
		    float: left;
		    overflow: hidden;
		    white-space: nowrap;
		    text-overflow: ellipsis;
		}
		span.diseaseNum{
		    color: #999;
		    float: left;
		    margin-left: 10px;
		}
		
	}
}

.el-tabs__item.is-active{
	border-right: 2px #409eff solid;
}
.symptomBox{
	padding: 10px;
	background: #f0f0f0;
	font-size: 16px;
	.symptomList{
		li{
			margin: 0 20px;
			padding: 2px 12px;
		}
		li.symptomActive{
			background: #ccc;
			border-radius: 6px;
		}
	}
}
</style>