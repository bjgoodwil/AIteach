<template>
    <div class="addCase" v-loading="loading">
    	<el-breadcrumb separator-class="el-icon-arrow-right">
		    <el-breadcrumb-item :to="{ path: '/case' }">疾病库</el-breadcrumb-item>
		    <el-breadcrumb-item v-if="$route.query.activeName">编辑疾病</el-breadcrumb-item>
		    <el-breadcrumb-item v-else>新建疾病</el-breadcrumb-item>
		    
		</el-breadcrumb>
		
		<el-form ref="form" :model="form" label-width="80px" class="m-t-20">
			<div class="clearfix">
				
				<el-form-item label="专业" class="floatLeft">
				
				    <el-cascader
					    :options="options"
					    :props="defaultProps"
					    v-model="form.selectedOptions"
					    @change="handleChange"
					    :disabled="disabled" size="small"
					    >
					</el-cascader>
				</el-form-item>
				<el-form-item label="疾病" class="floatLeft">
				    <el-input v-model="form.caseName" placeholder="请输入疾病症状" size="small"></el-input>
				</el-form-item>
			</div>
			
			<el-form-item label="教学目的">
			    <el-input v-model="form.teachingAims" autosize type="textarea" placeholder="请输入教学目的" style="width: 495px;"></el-input> 
			    
			</el-form-item>
		</el-form>

		<p class="m-b-10 m-t-10">
			</el-input> <el-button type="primary" round size="small" @click="openYWD">查看病历</el-button> <el-button type="primary" round size="small" @click="openBMJ">BMJ临床实践</el-button> <el-button type="primary" round size="small" @click="exportToExcel">导出问题</el-button>
		</p>
		
		<el-tabs type="border-card" v-model="activeScene" @tab-click="tabClick">
			<el-tab-pane :key="scene.id" :label="scene.name" v-for="scene in allQuestion">
				<el-input v-model="searchQuestion" placeholder="请输入关键字查找问题" style="width: 480px" size="small" clearable></el-input> <el-button type="primary" round size="small" class="m-l-10 floatRight pos-r" @click="showQuestionList">新增问题</el-button>
				<el-tabs v-model="activeName" @tab-click="tabClick1">
				    <el-tab-pane v-for="item in scene.children" :key="item.id" :label="item.name" :name="item.id">	
						<el-tabs tab-position="left" v-model="activeClass">
							<el-tab-pane v-for="(it,eq) in item.children" :key="it.id" :label="it.name" :name="it.id">
								<div class="scroll-y">
									<table style="width: 100%;" class="m-t-10">
										<thead>
											<th style="width: 10%">序号</th>
											<th style="width: 40%">问题</th>
											<th style="width: 40%">映射关系</th>
											<th style="width: 10%">操作</th>
										</thead>
									</table>
									<table style="width: 100%;">
										<tbody>
											<draggable v-model="it.parms" @update="datadragEnd" :options = "{animation:500}">
												<tr v-for="(i,index) in it.parms" :key="i.id" class="questionList">
													<td>{{index+1}}</td>
													<td style="width: 40%"><el-input v-model="i.questionName" size="small" placeholder="问题"></el-input></td>
													<td style="width: 50%">{{i.questionPath}}</td>
													<td style="width: 10%">
														<el-button
												          title="删除"
												          type="text" @click.native.prevent="deleteRow(it.parms,index)">
												          <i class="el-icon-delete"></i></el-button>
												    </td>
												</tr>
											</draggable>
										</tbody>
									</table>
									<p v-if="it.parms.length == 0" class="textCenter m-t-10">暂无数据</p>
								</div>
							</el-tab-pane>
						</el-tabs>
				    </el-tab-pane>
				</el-tabs>
			</el-tab-pane>
		</el-tabs>
		
		<div class="m-t-20 m-r-20">
			<el-button round class="addBtn floatRight m-l-10" size="small" @click="$router.push({name:'case'})"> 取 消 </el-button>
			<el-button type="primary" round class="addBtn floatRight " size="small" @click="save"> 保 存 </el-button>
		</div>
		<!-- 添加问题弹出框 -->
		<el-dialog
		  title="添加问题"
		  :visible.sync="dialogVisibleTree"
		  width="500px"
		  @close="dialogClose"
		  :close-on-click-modal="false"
		  >
		  	<el-tabs type="border-card" @tab-click="tabClickType">
				<el-tab-pane label="标准库问题">
					<el-form label-width="80px" :model="questionForm">
				  		<el-form-item label="选择问题">
							<el-select v-model="questionForm.selectQuestion" filterable
							@change="changeQuestion" placeholder="请选择" size="small" style="width: 100%">
							    <el-option
							      v-for="item in thisQuestion"
							      :key="item.id"
							      :label="item.questionName"
							      :value="JSON.stringify(item)">
							    </el-option>
							</el-select>
						</el-form-item>
						<el-form-item :label="standandTypeName" v-if="standandTypeName">
						    <el-input v-model="questionForm.questionParm" placeholder="请输入问题参数" size="small"></el-input> 
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="自定义问题">
					<el-form label-width="80px" :model="questionForm">
				  		<el-form-item label="问题名称">
							<el-input v-model="questionForm.questionName" placeholder="请输入问题名称" size="small"></el-input> 
						</el-form-item>
						<el-form-item label="映射路径">
						    <el-input v-model="questionForm.questionPath" placeholder="请输入问题路径" size="small"></el-input> 
						</el-form-item>
					</el-form>	
				</el-tab-pane>
			</el-tabs>
			
			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisibleTree = false">取 消</el-button>
			    <el-button type="primary" @click="addQuestion">确 定</el-button>
			</span>
			
		</el-dialog>	
    </div>
</template>
<script>
import draggable from 'vuedraggable';//拖拽排序组件
import {question} from '@/services/apis/question/question';
import {diseaseApi} from '@/services/apis/disease/disease'
export default {
    name: 'addCase',
    components: {
	    draggable
	},
    data () {

        return {
        	loading: true,
        	disabled:false,//设置专业是否可编辑
        	activeScene:'', //当前场景
        	activeName:'',
	    	activeClass:'',
        	form:{
        		selectedOptions: [],//所选专业
	        	caseName: '',//添加的疾病症状名称
	        	teachingAims:'',//教学目的
        	},

        	allQuestion: [],//所有问题
        	allQuestion2: [],

	        dataForm:{},

            options: [],
            dialogVisibleTree:false,
            optionQuestion:[],
            questionForm:{    //添加问题表单
            	selectQuestion:'',
            	questionParm:'',
            	//自定义问题
            	questionName:'',
            	questionPath:''
            }, 
            thisQuestion:[],
	        defaultProps: {
	        	value:'id',
	        	label:'name'
	        },
	        standandTypeList:[],
	        standandTypeName:'',
	        searchQuestion:'',

        }
    },
    mounted(){
    	//获取疾病所有分类
    	diseaseApi.diseaseTypesAll().then(response=>{
    		this.options = response.data.data.trees;
    	})
    	//判断是添加还是编辑
    	if (this.$route.query.activeName) {
    		this.disabled = true;
    		//console.log(this.$route.params)
    	}else{this.disabled = false;}
    	question.standandType().then(response=>{
    		this.standandTypeList = response.data.data
    	
    	})
    	//获取该疾病下的问题
    	diseaseApi.diseaseWithQuestion({diseaseId:this.$route.query.diseaseId}).then(response=>{
    		this.dataForm = response.data.data;
    		if (this.$route.query.diseaseId == 0) {
    			//this.dataForm.disease.diseaseTypeId = 
    		}else{
    			this.form.selectedOptions = [];
		        this.form.selectedOptions[0] = this.$route.query.activeName;
		        this.form.selectedOptions[1] = this.$route.query.activeClass;
    		}
    		this.form.caseName = response.data.data.disease.diseaseName || '';
			this.form.teachingAims = response.data.data.disease.teachPurpose || '';
			this.allQuestion = response.data.data.questions;
			this.allQuestion2 = JSON.parse(JSON.stringify(this.allQuestion));
			this.activeName = this.allQuestion[0].children[0].id;
            this.activeClass = this.allQuestion[0].children[0].children[0].id;
            this.loading = false;
    	})
    	//获取所有问题
        question.listAllQuestion().then(response=>{
        	this.optionQuestion = response.data.data.trees
    	})

    },
    methods:{
        handleChange(value){
	        this.dataForm.disease.diseaseTypeId = value[1];
        },
        changeQuestion(value){
        	if (this.standandTypeName == '') {this.questionForm.questionParm == ''}
        	for (var i = 0; i < this.standandTypeList.length; i++) {
        		if(this.standandTypeList[i].id == JSON.parse(value).standandTypeId){
        			this.standandTypeName = this.standandTypeList[i].standandTypeName+"="
        		}
        	}
        },
        //切换场景
        tabClick(tag){
        	this.activeName = this.allQuestion[tag.index].children[0].id;
	    	this.activeClass = this.allQuestion[tag.index].children[0].children[0].id;
        },
        //点击一级分类
     	tabClick1(tag){
     		this.activeClass = this.allQuestion[this.activeScene].children[tag.index].children[0].id;
     	},
     	//添加问题时切换问题类型
     	tabClickType(tag){
     		this.standandTypeName = ''
     		if (tag.label == '标准库问题') {
     			this.questionForm.questionName = ''
     			this.questionForm.questionPath = ''
     		}else if (tag.label == '自定义问题') {
     			this.questionForm.selectQuestion = ''
     			this.questionForm.questionParm = ''
     		}
     	},
     	showQuestionList(){
     		this.dialogVisibleTree = true;
     		let a = this.optionQuestion[this.activeScene];
     		for (var i = 0; i < a.children.length; i++) {
        		if (this.activeName == a.children[i].id) {
        			for (var j = 0; j < a.children[i].children.length; j++) {
        				if (this.activeClass == a.children[i].children[j].id){
        					this.thisQuestion = a.children[i].children[j].parms
        				}
        			}
        		}
        	}
        	
     	},
     	dialogClose(){
     		for(var i in this.questionForm) {
				this.questionForm[i] = '';
			}
			this.standandTypeName = ''
	    },
     	addQuestion(){

     		let param = {
     			diseaseId:this.$route.query.diseaseId,
     			classifyId:this.activeClass,
     			standandQuestionId:'',
     			parms:this.questionForm.questionParm,
     			questionNum:'',
     			//自定义问题时的参数
     			questionName:this.questionForm.questionName || '',
     			questionPath:this.questionForm.questionPath || ''
     		}
     		if (this.questionForm.selectQuestion != '') {
     			param.standandQuestionId = JSON.parse(this.questionForm.selectQuestion).id
     		}else{
     			param.standandQuestionId = ''
     		}
     		let a = this.allQuestion[this.activeScene];
     		for (var i = 0; i < a.children.length; i++) {
        		if (this.activeName == a.children[i].id) {
        			for (var j = 0; j < a.children[i].children.length; j++) {
        				if (this.activeClass == a.children[i].children[j].id){
        					param.questionNum = a.children[i].children[j].parms.length+1
        				}
        			}
        		}
        	}
        	if (this.$route.query.diseaseId == 0) {
    			param.diseaseId = '';
    		}
     		diseaseApi.addSingleQuestion(param).then(response=>{
     			this.$message({
		            type: 'success',
		            message: '添加成功!'
		        });

	    		diseaseApi.diseaseWithQuestion({diseaseId:param.diseaseId}).then(response=>{
		    		this.dataForm = response.data.data;
					this.allQuestion = response.data.data.questions;
					this.allQuestion2 = JSON.parse(JSON.stringify(this.allQuestion));
		            this.loading = false;
		    	})
		    	this.dialogVisibleTree = false;
	    	})
     	},
     	//删除问题
     	deleteRow(rows,index){
     		this.$confirm('确定删除该问题吗?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	rows.splice(index, 1);
	        }).catch(() => {});
     	},
	    //保存
	    save(){
	    	this.loading = true
	    	this.dataForm.disease.diseaseName = this.form.caseName;
	    	this.dataForm.disease.teachPurpose = this.form.teachingAims;
	    	for (var i = 0; i < this.dataForm.questions.length; i++) {
	    		for (var j = 0; j < this.dataForm.questions[i].children.length; j++) {
	    			for (var k = 0; k < this.dataForm.questions[i].children[j].children.length; k++) {
		    			for (var l = 0; l < this.dataForm.questions[i].children[j].children[k].parms.length; l++) {
			    			this.dataForm.questions[i].children[j].children[k].parms[l].questionNum = l+1
			    		}
		    		}
	    		}
			}
			if (this.$route.query.diseaseId == 0) {
    			this.dataForm.disease.id = '';
    		}
			let param = JSON.stringify(this.dataForm);
	    	diseaseApi.editDisease({questionJson:param}).then(response=>{
	    		this.$message({
		            type: 'success',
		            message: '修改成功!'
		        });
		        this.loading = false;
		        if (this.$route.query.diseaseId == 0) {
	    			this.$router.push({name:'case'})
	    		}
	    	})
	    },
	    openYWD(){
	    	window.open(process.env.HOST+'search/bysy/index.html?keywords='+this.form.caseName+'&sortField=1&filterField=EMR02.00#patient_doc_list,binganshouye#patient_doc_list&form=AI', '_blank', 'height=600, width=1000, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no') 
	    },
	    openBMJ(){
	    	let main = '';
	    	if (window.location.host == process.env.HOST) {
	    		main = 'http://10.2.3.96:8080'
	    	}else{
	    		main = 'http://192.168.8.74:8080'
	    	}
	    	window.open(main+'/search/ZH_CN?q='+this.form.caseName, '_blank', 'height=600, width=1000, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no') 
	    },
	    //行拖拽
	    datadragEnd (evt) {
            evt.preventDefault();
            console.log(evt.to)
        },
        //excel数据导出
        exportToExcel() {
	        require.ensure([], () => {
	            const {
	                export_json_to_excel
	            } = require('../../vendor/Export2Excel');
	            const tHeader = ['场景','问题', 'id'];
	            const filterVal = ['name','children', 'id'];
	            const list = this.dataForm.questions;
	            const data = this.formatJson(filterVal, list);
	            export_json_to_excel(tHeader, data, '列表excel');
	        })
	    },
	    formatJson(filterVal, jsonData) {
	        return jsonData[this.activeScene].children.map(v => filterVal.map(j => v[j]))
	    }
    },
    watch:{
    	searchQuestion(){
    		let _this = this
    		let scene = _this.allQuestion2[this.activeScene].children;
	   		let newArray = JSON.parse(JSON.stringify(scene));;
	   		let search = _this.searchQuestion;
			scene.forEach((value,index,array)=>{
				scene[index].children.forEach((v,i,arr)=>{
					newArray[index].children[i].parms = []
						let parm = scene[index].children[i].parms
						for (var j = 0; j< parm.length; j++) {
							if (parm[j].questionName.includes(search)) {
								newArray[index].children[i].parms.push(parm[j])
							}
						}
				})
				
			})
    		this.allQuestion[this.activeScene].children = search?newArray:this.allQuestion2[this.activeScene].children
    	}
    },
    
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
.el-form-item {
    margin-bottom: 0;
}
.el-button.el-button--text{
	font-size: 18px;
	.el-icon-delete,.delete{
		color: red;
	}
}
.el-tabs.el-tabs--left{
	height: 400px;
	.el-tabs__content{
		.scroll-y{
			max-height: 400px;
    		overflow-y: auto;
		}
		
	}
}
.questionList{
	border-bottom: 1px #f0f0f0 solid;
	td{
		padding: 2px 5px;
		vertical-align: middle;
	}
}
</style>
