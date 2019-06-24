<template>
    <div class="problem" v-loading="loading">
		<p style="height: 32px;"><i class="el-icon-location-outline"></i> 标准提问库 </p>
		
		<el-tabs type="border-card" v-model="activeScene" @tab-click="tabClick">
			<el-tab-pane :key="scene.id" :label="scene.name" v-for="scene in classes">
				<el-input v-model="searchQuestion" placeholder="请输入关键字查找问题" style="width: 500px" size="small" clearable></el-input> 
				<el-button type="primary" round class="addBtn floatRight pos-r" size="small" @click="showQuestionForm('add','')"><i class="el-icon-plus"></i> 添加问题</el-button>
				<el-tabs v-model="activeName" @tab-click="tabClick1">
					<el-tab-pane v-for="item in scene.children" :id="item.id" :key="item.id" :label="item.name" :name="item.id">
						<el-tabs tab-position="left" v-model="activeClass" @tab-click="tabClick2">
							<el-tab-pane v-for="(it,eq) in item.children" :key="it.id" :label="it.name" :name="it.id">
								<div class="scroll-y">
								
									<el-table :data="it.parms">
							    		<el-table-column
									      type="index"
									      label="序号"
									      width="50">
									    </el-table-column>
								        <el-table-column label="问题" prop="questionName">
								        	
								        </el-table-column>
								        <el-table-column label="映射路径" prop="questionPath">
								        	
								        </el-table-column>
								        <el-table-column label="所属科室" prop="departmentName" width="100">
								        	
								        </el-table-column>
								        <el-table-column label="操作" width="100">
								        	<template slot-scope="scope">
									        	<el-button
										          title="删除"
										          type="text" @click.native.prevent="deleteRow(it.parms,scope.$index,scope.row)">
										          <i class="el-icon-delete"></i></el-button>
										      </template>
								        </el-table-column>
								    </el-table>
									
							    </div>
							</el-tab-pane>
						</el-tabs>
					</el-tab-pane>
				</el-tabs>
			</el-tab-pane>
		</el-tabs>
		
		<!-- 关联映射弹出框 -->
		<el-dialog
		  title="添加问题"
		  :visible.sync="dialogVisibleTree"
		  width="600px"
		  :close-on-click-modal="false"
		  @close="dialogClose">
		  	<el-form label-width="80px" :model="questionForm">
		  		<el-form-item label="专业">
				    <el-cascader
				        style="width: 280px"
					    :options="options"
					    :props="defaultProps"
					    v-model="questionForm.selectedOptions"
					    @change="handleChange"
					    size="small">
					</el-cascader>
				</el-form-item>
			  	<el-form-item label="问题分类">
				    <el-select v-model="questionForm.standandTypeId" filterable clearable
					@change="changeStandandType" placeholder="请选择问题分类" size="small" style="width: 280px">
					    <el-option
					      label=""
					      value="">
					    </el-option>
					    <el-option
					      v-for="item in questionType"
					      :key="item.id"
					      :label="item.standandTypeName"
					      :value="item.id">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="问题">
				    <el-input v-model="questionForm.questionName" placeholder="请输入问题" size="small"></el-input> 
				</el-form-item>
				<el-form-item label="映射路径">
				    <el-input v-model="questionForm.questionPath" placeholder="请输入映射路径" size="small"></el-input>
				</el-form-item>

			  
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisibleTree = false">取 消</el-button>
			    <el-button v-if="addOrEdit=='add'" type="primary" @click="addCase" :disabled="btnDisabled">确 定</el-button>
			    <el-button v-if="addOrEdit=='edit'" type="primary" @click="editCase">确 定</el-button>
			</span>
			
		</el-dialog>
    </div>
</template>
<script>
//提问库接口
import {question} from '@/services/apis/question/question';
import {diseaseApi} from '@/services/apis/disease/disease';
//医问道映射接口
import {ywd} from '@/services/apis/ywd'
export default {
	name: 'problem',
	data () {

	    return {
	    	btnDisabled:false,
	    	loading: true,
	    	addOrEdit: '', //判断新增还是编辑
	    	currentId:'',  //当前编辑的问题id
	        classes:[],
	        classes2:[],
	        activeScene:'', //当前场景
	        activeName:'',  //当前一级分类
	        activeClass:'', //当前二级分类
	        questionType:[],//问题类型
	        questionForm:{ //新增问题绑定数据
	        	classifyId:"",  //所属分类
	        	standandTypeId:'',  //问题类型
	        	questionName:'',  //主问题名字
	        	questionPath: '', //主问题路径
	        	selectedOptions: [],//专业
	        	departmentId:'', //专业id
	        	questionNum:'', //问题序号
	        },

	        dialogVisibleTree:false, //显示映射关系树
	        dataTree: [],
	        //联级相关
	        defaultProps: {
	        	value:'id',
	        	label:'name'
	        }, //联级配置
	  		options:[],
	  		searchQuestion:""
	    }
	},
	mounted() {
		question.standandType().then(response=>{
			this.questionType = response.data.data;
    	})
        this.getQuestionList();
        //获取疾病所有分类
    	diseaseApi.diseaseTypesAll().then(response=>{
    		this.options = response.data.data.trees;
    		this.options.unshift({
				id: "0",
				name: "全部",
    		})
    		this.questionForm.selectedOptions[0] = this.options[0].id;
    		console.log(this.questionForm.selectedOptions)
    	});
    },
    
  	methods: {

	    //获取问题列表
	    getQuestionList(){
	    	question.listAllQuestion({departmentId:"all"}).then(response=>{
	            this.classes = response.data.data.trees;
	            this.classes2 = JSON.parse(JSON.stringify(this.classes));
	            
	            this.activeName = this.classes[0].children[0].id;
	            this.activeClass = this.classes[0].children[0].children[0].id;
	            this.loading = false;
	        });
	    },
	    //点击切换场景
	    tabClick(tag){
	    	//console.log(this.activeScene)
	    	this.activeName = this.classes[tag.index].children[0].id;
	    	this.activeClass = this.classes[tag.index].children[0].children[0].id;
	    },
	    //点击第一级分类
	    tabClick1(tag,event){
	    	this.activeClass = this.classes[this.activeScene].children[tag.index].children[0].id;
	    },
	    //点击第二级分类，获取问题
	    tabClick2(tag){
	    	//this.getQuestionList(tag.name);
	    },
	    dialogClose(){
	    	this.questionForm.questionName = '';
	    },
	    //显示添加和编辑问题
	    showQuestionForm(type,row){
	    	this.dialogVisibleTree = true;
	    	if (type == 'edit') {
	    		this.addOrEdit = 'edit';
	    		this.$set( this.questionForm, 'id', row.id)
	    		// this.currentId = row;
	    		for (var index in this.questionForm){
				    this.questionForm[index] = JSON.parse(JSON.stringify(row[index]));
				}
	    	}else if(type == 'add'){
	    		this.addOrEdit = 'add';
	    		this.$delete(this.questionForm,'id');
	    		for (var index in this.questionForm){
	    			if (index == 'selectedOptions') {
	    				this.questionForm[index] = []
	    			}else{
	    				this.questionForm[index] = '';
	    			}
				    
				}
	    	}
	    },
	    //所选专业
	    handleChange(value){
	        this.questionForm.departmentId = value[1] || value[0];
	        console.log(this.questionForm.selectedOptions)
        },
	    //选择问题类型
	    changeStandandType(val){
	    	//console.log(this.questionForm.standandTypeId)
	    },
	    //新增问题
	    addCase(){
	    	if (this.questionForm.departmentId != "") {
	    		this.btnDisabled = true;
	    		this.loading = true;
	    		this.questionForm.classifyId = this.activeClass;
	    		question.addFatherQuestion(this.questionForm).then(response=>{
	    			this.dialogVisibleTree = false;
	    			this.btnDisabled = false;
		    		if (response.data.errCode == "0") {
		    			this.$message({
				            type: 'success',
				            message: '添加成功!'
				        });
				        question.listAllQuestion({departmentId:"all"}).then(response=>{
				            this.classes = response.data.data.trees;
				            this.classes2 = JSON.parse(JSON.stringify(this.classes));
				            this.loading = false;
				        });
		    		}else{
		    			this.$confirm(response.data.errMsg, '提示', {
				          type: 'warning',
				          showConfirmButton: false,
				        })
		    		}
		        }) 
	    	}else{
	    		this.$message({
		            type: 'warning',
		            message: "请选择所属专业",
		        })
	    	}
	    	
	    },
	    editCase(){
	    	this.loading = true;
	    	let paramArry = [this.questionForm]
	    	question.updateQuestion({questionJson:JSON.stringify(paramArry)}).then(response=>{
	            if (response.data.errCode == "0") {
	    			this.$message({
			            type: 'success',
			            message: '修改成功!'
			        });
			        this.getQuestionList();
	    			
	    		}else{
	    			this.$confirm(response.data.errMsg, '提示', {
			          type: 'warning',
			          showConfirmButton: false,
			        })
	    		}
	            this.dialogVisibleTree = false;
	        })
	    },
	    //删除问题
	    deleteRow(rows,index,row) {
	      
	        this.$confirm('确定删除该问题吗?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {

	        	question.deleteQuestion({questionId:row.id}).then(response=>{
		            this.$message({
			            type: 'success',
			            message: '删除成功!'
			        });
			        rows.splice(index, 1);
		        })
		        
	        }).catch(() => {
	                  
	        });
	    },
    },
    watch : {
	   'activeName':(val) => { //监听切换状态-计划单
	        //this.getClassifyList(val)
	   },
	    searchQuestion(){
	    	let _this = this;
	    	let scene = _this.classes2[this.activeScene].children;
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
    		this.classes[this.activeScene].children = search?newArray:this.classes2[this.activeScene].children
    	}
	},
}    
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-button.el-button--text{
	font-size: 18px;
	.el-icon-delete{
		color: red;
	}
}
.el-tabs.el-tabs--left{
	.el-tabs__content{
		.scroll-y{
			max-height: 700px;
    		overflow-y: auto;
		}
		
	}
}
.el-form-item {
    margin-bottom: 0;
}
.mainQuestion{
	font-size: 14px;
	line-height: 44px;
	padding:0 12px;
	border-radius: 4px;
}
</style>