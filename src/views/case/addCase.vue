<template>
    <div class="addCase">
    	<el-breadcrumb separator-class="el-icon-arrow-right">
		    <el-breadcrumb-item :to="{ path: '/case' }">疾病库</el-breadcrumb-item>
		    <el-breadcrumb-item v-if="$route.params.diseaseName">编辑疾病</el-breadcrumb-item>
		    <el-breadcrumb-item v-else>新建疾病</el-breadcrumb-item>
		    
		</el-breadcrumb>
		
		<el-form ref="form" :model="form" label-width="80px" class="m-t-20">
			<div class="clearfix">
				<el-form-item label="" >
				    <el-button type="primary" round size="small" @click="openYWD">查看病历</el-button>
				</el-form-item>
				
				<el-form-item label="专业" class="floatLeft">
				
				    <el-cascader
					    :options="options"
					    :props="defaultProps"
					    v-model="form.selectedOptions"
					    @change="handleChange"
					    :disabled="disabled"
					    >
					</el-cascader>
				</el-form-item>
				<el-form-item label="疾病" class="floatLeft">
				    <el-input v-model="form.caseName" placeholder="请输入疾病症状"></el-input>
				</el-form-item>
			</div>
			
			<el-form-item label="教学目的">
			    <el-input v-model="form.teachingAims" type="textarea" placeholder="请输入教学目的" style="width: 500px;"></el-input>
			</el-form-item>
		</el-form>
		<!-- <el-tree 

		    ref="tree"
			:data="data" 
			show-checkbox 
			:props="defaultProps" 
			@check-change="handleCheckChange"
			node-key="id"
			:default-checked-keys="defaultCheckedTree"
			></el-tree> -->
		<p class="m-b-10"><span class="textRight" style="display: inline-block;width: 68px;padding-right: 12px;">题库</span>
			<el-input v-model="searchQuestion" placeholder="请输入关键字查找问题" style="width: 500px">
			</el-input> 
		</p>
		<div class="clearfix">
			<div class="problemList m-r-20" v-loading="loading">
				
				<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
				<el-collapse accordion>
					
					<div v-for="item in allQuestion" class="m-b-20" :key="item.id">
						<el-collapse-item>
							<template slot="title">
						      <p style="color: rgb(245, 108, 108);font-size: 16px;"><i class="header-icon el-icon-menu"></i> {{item.name}} </p>
						    </template>
							<el-collapse accordion>
							<div v-for="list in item.children" :key="list.id">
								<el-collapse-item>
									<template slot="title">
										<p>{{list.name}}</p>
									<!-- <el-alert
									    :title="list.name"
									    :closable="false"
									    class="m-t-20"
									    >
									</el-alert> -->
									</template>
								<el-checkbox-group v-model="checkQuestion" @change="handleCheckChange">
									<el-checkbox v-for="i in list.parms" :label="i.questionId" :key="i.questionId" class="m-t-20">{{i.questionName}}
								    </el-checkbox>
								</el-checkbox-group>
								</el-collapse-item>
							</div>
							</el-collapse>
						</el-collapse-item>
					</div>
				</el-collapse>
			</div>
			<!-- <div class="floatLeft problemList">
				<p class="m-b-10">我的问题及分数</p>
				<div v-for="item in myQuestion" class="m-b-20" :key="item.id">
					<p style="color: red;font-size: 20px;">{{item.typeName}}</p>
					<div v-for="list in item.list" :key="list.typeId">
						<el-alert
						    :title="list.typeName"
						    :closable="false">
						</el-alert>
						<p v-show="checkQuestion.indexOf(i.questionId) > -1" v-for="(i,index) in list.list" :key="i.questionId" >{{index+1}}.{{i.questionName}} <el-input v-model="i.score" placeholder="请输入分数" size="small" style="width: 80px"></el-input></p>

					</div>

				</div>
			
			</div> -->
		</div>
		<div class="m-t-20 m-r-20">
			<el-button round class="addBtn floatRight m-l-10" size="small" @click="$router.push({name:'case'})"> 取 消 </el-button>
			<el-button v-if="$route.params.diseaseName" type="primary" round class="addBtn floatRight " size="small" @click="saveEdit"> 保 存 </el-button>
			<el-button v-else type="primary" round class="addBtn floatRight " size="small" @click="save"> 保 存 </el-button>

			
		</div>
			
    </div>
</template>
<script>
import {question} from '@/services/apis/question/question';
import {diseaseApi} from '@/services/apis/disease/disease'
export default {
    name: 'addCase',
    data () {

        return {
        	loading: true,
        	disabled:false,//设置专业是否可编辑
        	form:{
        		selectedOptions: [],//所选专业
	        	caseName: '',//添加的疾病症状名称
	        	teachingAims:'',//教学目的
        	},
        	isIndeterminate: false,
        	checkAll: false,
        	allQuestion: [],//所有问题
        	allQuestion2: [],
        	allQuestionId:[],
        	myQuestion:[], //该疾病的问题

	        dataForm:[],
	        checkQuestion:[],

	        defaultProps: {
	          children: 'children',
	          label: 'label'
	        },
	        defaultCheckedTree:[],

            options: [],
	        defaultProps: {
	        	value:'id',
	        	label:'name'
	        },
	        searchQuestion:'',
	        searchData:''
        }
    },
    mounted(){
    	this.checkQuestion = [];
    	//判断是添加还是编辑
    	if (this.$route.params.diseaseName) {
    		this.disabled = true;
    		//console.log(this.$route.params)
    	}else{this.disabled = false;}
    	//获取疾病所有分类
    	diseaseApi.diseaseTypesAll().then(response=>{
    		this.options = response.data.data.trees;
    	})
    	//获取所有问题
    	question.questionListAll().then(response=>{
    		this.allQuestion = response.data.data.trees;
    		this.allQuestion2 = response.data.data.trees;
    		this.loading = false;
    		for (var i = 0; i < this.allQuestion.length; i++) {
    			for (var j = 0; j < this.allQuestion[i].children.length; j++) {
    				//this.allQuestionId.push(this.allQuestion[i].children[j].parms)
    				if (this.allQuestion[i].children[j].parms) {

	    				for (var k = 0; k < this.allQuestion[i].children[j].parms.length; k++) {

	    					this.allQuestionId.push(this.allQuestion[i].children[j].parms[k].questionId)
	    				}
	    			}
	    			
	    		}
    		}
        });
        if (this.$route.params.diseaseName) {
        	diseaseApi.relationShips({diseaseId:this.$route.params.id}).then(response=>{
        		if (response.data.data) {
        			this.myQuestion = response.data.data.trees;

		    		for (var i = 0; i < this.myQuestion.length; i++) {

		    			for (var j = 0; j < this.myQuestion[i].children.length; j++) {
		    				
		    				if (this.myQuestion[i].children[j].parms) {

			    				for (var k = 0; k < this.myQuestion[i].children[j].parms.length; k++) {

			    					this.checkQuestion.push(this.myQuestion[i].children[j].parms[k].questionId)
			    				}
			    			}
			    			
			    		}
		    		}
        		}
	    		
	        });
        }
        this.form.selectedOptions = [];
        this.form.selectedOptions[0] = this.$route.query.activeName;
        this.form.selectedOptions[1] = this.$route.query.activeClass;

    	this.form.caseName = this.$route.params.diseaseName || '';
    	this.form.teachingAims = this.$route.params.teachPurpose || '';
    	for (var i = 0; i < this.allQuestion.length; i++) {
			this.dataForm.push({
				//id: this.data[i].id,
		        label: this.allQuestion[i].label,
		        children: [],
		        child:[],
		    })
		}
		//this.formatData();
    },
    methods:{
        handleChange(value){

	        console.log(value);
	    
        },
        handleCheckChange(value){
	        let checkedCount = value.length;
        	this.checkAll = checkedCount === this.allQuestionId.length;
        	this.isIndeterminate = checkedCount > 0 && checkedCount < this.allQuestionId.length;
	 
	    },
	    handleCheckAllChange(val) {

	        this.checkQuestion = val ? this.allQuestionId : [];
	        this.isIndeterminate = false;
	    },

	    //格式化数据
	    formatData(){
	    	//this.dataForm = [];
	    	let questionId = '';
	    	for (var i = 0; i < this.checkQuestion.length; i++) {
	    		questionId+=this.checkQuestion[i]+'_'+0+','
	    	}
	    	questionId = questionId.substring(0, questionId.lastIndexOf(','))
	    	return questionId;
	    },
	    //保存
	    save(){
	    	
	    	let params = {
	    		diseaseName:this.form.caseName,
	    		diseaseTypeId:this.form.selectedOptions[1],
	    		teachPurpose:this.form.teachingAims,
	    		questionIdAndScores:this.formatData()
	    	}

	    	diseaseApi.addDisease(params).then(response=>{
	    		this.$message({
		            type: 'success',
		            message: '添加成功!'
		        });
		        this.$router.push({name:'case'})
	    	})
	    },
	    //编辑
	    saveEdit(){
	    	let params = {
	    		diseaseId:this.$route.params.id,
	    		diseaseTypeId:this.$route.query.activeClass,
	    		diseaseName:this.form.caseName,
	    		//diseaseTypeId:this.form.selectedOptions[1],
	    		teachPurpose:this.form.teachingAims,
	    		questionIdAndScores:this.formatData()
	    	}

	    	diseaseApi.updateDisease(params).then(response=>{
	    		this.$message({
		            type: 'success',
		            message: '修改成功!'
		        });
		        this.$router.push({name:'case'})
	    	})
	    },
	    openYWD(){
	    	window.open(process.env.HOST+'search/bysy/index.html?keywords='+this.form.caseName+'&sortField=1&filterField=EMR02.00#patient_doc_list,binganshouye#patient_doc_list&form=AI', '_blank', 'height=600, width=1000, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no') 
	    }
	  
    },
    watch:{
    	searchQuestion(){
    		let search = this.searchQuestion;
    		this.allQuestion = search?this.allQuestion2.filter(item => 
    			item.name.includes(search)
    		):this.allQuestion2
    	}
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-checkbox-group .el-checkbox{
	display: block;
}
.problemList{
	max-height: 500px;
	overflow-y: scroll;
	border: 1px #ccc solid;
	padding: 10px;
	background: #fff;
}
.el-collapse-item__content .el-collapse{
	border: none;
	> div{
    	border-bottom: 1px solid #EBEEF5;
	} 
	> div:last-child{
		border: none;
	}
}
</style>
