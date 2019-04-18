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
			
			</el-input> <el-button type="primary" round size="small" @click="openYWD">查看病历</el-button> <el-button type="primary" round size="small" @click="openBMJ">BMJ临床实践</el-button>
		</p>
		<el-input v-model="searchQuestion" placeholder="请输入关键字查找问题" style="width: 480px" size="small" clearable></el-input> <el-button type="primary" round size="small" class="m-l-10" @click="showQuestionList">新增问题</el-button>
		<el-tabs v-model="activeName" @tab-click="tabClick1">
		    <el-tab-pane v-for="item in allQuestion" :key="item.id" :label="item.name" :name="item.name">	
		    	
				<el-tabs tab-position="left" v-model="activeClass">
					<el-tab-pane v-for="(it,eq) in item.children" :key="it.id" :label="it.name" :name="it.name">
						<div class="scroll-y">
						<el-table :data="it.parms">
				    		<el-table-column
						      type="index"
						      label="序号"
						      width="50">
						    </el-table-column>
					        <el-table-column :label="it.classifyName">
					        	<template slot-scope="scope">
									<el-input v-model="scope.row.questionName" size="small" placeholder="问题"></el-input>				
					        	</template>
					        </el-table-column>
					        <el-table-column prop="questionPath" label="映射关系">
					        	
					        </el-table-column>
					        <el-table-column width="100px" label="操作">
					        	<template slot-scope="scope">
					        		<!-- <el-button
							          size="mini" @click="setMap(scope.row.tags)">映射</el-button> -->
							        <!-- <el-button
							          title="编辑"
							          type="text" 
							          @click="showQuestionForm('edit',scope.row)">
							          <i class="el-icon-edit-outline"></i></el-button> -->
							       
							        <el-button
							          title="删除"
							          type="text" @click.native.prevent="deleteRow(it.parms,scope.$index)">
							          <i class="el-icon-delete"></i></el-button>
					        	</template>
					        </el-table-column>
					    </el-table>
						</div>
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
		  title="选择问题"
		  :visible.sync="dialogVisibleTree"
		  width="600px"
		  @close="dialogClose"
		  :close-on-click-modal="false"
		  >
			<el-select v-model="selectQuestion" multiple clearable filterable 
			@change="changeQuestion" placeholder="请选择" style="width: 560px">
			    <el-option
			      v-for="item in thisQuestion"
			      :key="item.questionId"
			      :label="item.questionName"
			      :value="JSON.stringify(item)">
			    </el-option>
			</el-select>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisibleTree = false">取 消</el-button>
			    <el-button type="primary" @click="addQuestion">确 定</el-button>
			    
			</span>
			
		</el-dialog>	
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
            thisQuestion:[],
            selectQuestion:[],

	        defaultProps: {
	        	value:'id',
	        	label:'name'
	        },
	        searchQuestion:'',

	        index1:'',//一级索引
	        index2:'',//二级索引
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
			this.allQuestion = response.data.data.questions.trees;
			this.allQuestion2 = response.data.data.questions.trees;
			this.activeName = this.allQuestion[0].name;
            this.activeClass = this.allQuestion[0].children[0].name;
            this.loading = false;
    	})
    	//获取所有问题
        question.questionListAll({diseaseId:0}).then(response=>{
            this.optionQuestion = response.data.data.trees;
 
        });

    },
    methods:{
        handleChange(value){
	        this.dataForm.disease.diseaseTypeId = value[1];
        },
        changeQuestion(value){
        	// for (var i = 0; i < this.dataForm.questions.trees[this.index1].children[this.index2].parms.length; i++) {
        	// 	for (var j = 0; j < this.selectQuestion.length; j++) {
        	// 		let a = this.dataForm.questions.trees[this.index1].children[this.index2].parms[i]
	        // 		if (a.name == this.selectQuestion[j].questionName && a.questionModelPath == this.selectQuestion[j].questionModelPath) {
	        // 			alert("该问题已存在")
	        // 		}
	        // 	}
        	// }
        },
        //点击一级分类
     	tabClick1(tag){
     		this.activeClass = this.allQuestion[tag.index].children[0].name;
     	},
     	showQuestionList(){
     		this.dialogVisibleTree = true;

     		for (var i = 0; i < this.optionQuestion.length; i++) {
     			if (this.optionQuestion[i].name == this.activeName) {
     				for (var j = 0; j < this.optionQuestion[i].children.length; j++) {
     					if (this.optionQuestion[i].children[j].name == this.activeClass){
     						this.thisQuestion = this.optionQuestion[i].children[j].parms
     						this.index1 = i;
     						this.index2 = j;
     						//设置回显，防止问题重复
     						// for (var k = 0; k < this.dataForm.questions.trees[i].children[j].parms.length; k++) {
				     		// 	this.selectQuestion.push(JSON.stringify(this.dataForm.questions.trees[i].children[j].parms[k]))
				     		// }
     					}
     				}
     			}
     		}

     	},
     	dialogClose(){
	    	this.selectQuestion = [];
	    	
	    },
     	addQuestion(){
     		let questionArr = [];
     		//console.log(this.selectQuestion)
     		for (var i = 0; i < this.selectQuestion.length; i++) {
     			questionArr.push(JSON.parse(this.selectQuestion[i]))
     		}

			let a = this.dataForm.questions.trees[this.index1].children[this.index2].parms;
			this.dataForm.questions.trees[this.index1].children[this.index2].parms = a.concat(questionArr)				
     	
     		this.dialogVisibleTree = false;
     		// for (var i = 0; i < this.dataForm.questions.trees[this.index1].children[this.index2].parms.length; i++) {
       //  		for (var j = 0; j < questionArr.length; j++) {
        
	      //   		if (a[i].questionName == questionArr[j].questionName && a[i].questionModelPath == questionArr[j].questionModelPath) {
	      //   			alert("问题"+questionArr[j].questionName+"已存在")
	      //   			return false;
	      //   		}else{
						
	      //   		}
	      //   	}
       //  	}
     		
     	},
     	//删除问题
     	deleteRow(rows,index){
     		this.$confirm('确定删除该问题吗?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	rows.splice(index, 1);
		        this.$message({
		            type: 'success',
		            message: '删除成功!'
		        });
	        }).catch(() => {
	                  
	        });
      
     		
     	},
	    //保存
	    save(){
	    	this.loading = true
	    	this.dataForm.disease.diseaseName = this.form.caseName;
	    	this.dataForm.disease.teachPurpose = this.form.teachingAims;
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
	    	if (window.location.host == '192.168.132.13') {
	    		main = process.env.HOST
	    	}else{
	    		main = 'http://192.168.8.74:8080'
	    	}
	    	window.open(main+'/search/ZH_CN?q='+this.form.caseName, '_blank', 'height=600, width=1000, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no') 
	    }
	  
    },
    watch:{
    	searchQuestion(){
    		let _this = this
	   		let newArray = JSON.parse(JSON.stringify(_this.allQuestion2));;
	   		let search = _this.searchQuestion;
			_this.allQuestion2.forEach((value,index,array)=>{

				_this.allQuestion2[index].children.forEach((v,i,arr)=>{
					newArray[index].children[i].parms = []
						let parm = _this.allQuestion2[index].children[i].parms
						for (var j = 0; j< parm.length; j++) {
							if (parm[j].questionName.includes(search)) {
								newArray[index].children[i].parms.push(parm[j])
							}
						}
				})
				
			})
    		this.allQuestion = search?newArray:this.allQuestion2
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
</style>
