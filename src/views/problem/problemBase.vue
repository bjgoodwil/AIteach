<template>
    <div class="problem" v-loading="loading">
		<p style="height: 32px;"><i class="el-icon-location-outline"></i> 提问库 </p>
		<el-input v-model="searchQuestion" placeholder="请输入关键字查找问题" style="width: 500px" size="small" clearable></el-input> 
		<el-button type="primary" round class="addBtn floatRight pos-r" size="small" @click="showQuestionForm('add','')"><i class="el-icon-plus"></i> 添加问题</el-button>
		<el-tabs v-model="activeName" @tab-click="tabClick1">
			<el-tab-pane v-for="item in classes" :id="item.id" :key="item.id" :label="item.name" :name="item.id.toString()" >
		
				<el-tabs tab-position="left" v-model="activeClass" @tab-click="tabClick2">
					<el-tab-pane v-for="(it,eq) in item.children" :key="it.id" :label="it.name" :name="it.id.toString()">
						<div class="scroll-y">
						<el-table :data="it.parms">
				    		<el-table-column
						      type="index"
						      label="序号"
						      width="50">
						    </el-table-column>
					        <el-table-column :label="it.name">
					        	<template slot-scope="scope">
									{{scope.row.questionName}}								
					        	</template>
					        </el-table-column>
					        <el-table-column prop="questionPath" label="映射关系">
					        	
					        </el-table-column>
					        <!-- <el-table-column width="100px" label="操作">
					        	<template slot-scope="scope">
							        <el-button
							          title="编辑"
							          type="text" 
							          @click="showQuestionForm('edit',scope.row)">
							          <i class="el-icon-edit-outline"></i></el-button>
							        
							        <el-button
							          title="删除"
							          type="text" @click.native.prevent="deleteRow(scope.row)">
							          <i class="el-icon-delete"></i></el-button>
					        	</template>
					        </el-table-column> -->
					    </el-table>
					    </div>
					</el-tab-pane>
				</el-tabs>
			</el-tab-pane>
		</el-tabs>
		
		<!-- 关联映射弹出框 -->
		<el-dialog
		  title="设置问题"
		  :visible.sync="dialogVisibleTree"
		  width="600px"
		  @close="dialogClose">
		  	<el-form label-width="80px" :model="questionForm">
		  	  <el-form-item label="问题分类">
			    <el-input v-model="questionForm.type" placeholder="请输入问题分类"></el-input>
			  </el-form-item>
			  <el-form-item label="问题">
			    <el-input v-model="questionForm.name" placeholder="请输入问题" style="width: 360px"></el-input> <el-button type="primary" round size="small" > 添加关联子问题</el-button>
			  </el-form-item>
			  <el-form-item label="映射路径">
			    <el-input v-model="questionForm.questionPath" placeholder="请输入映射路径"></el-input>
			  </el-form-item>
			  <!-- <el-form-item label="映射">
			    
			    <el-cascader
			    	style="width: 480px"
					:props="defaultProps"
				    :options="dataTree"
				    v-model="questionForm.relation"
				    filterable
				    clearable 
				    placeholder="试试搜索"
				    @change="handleChange">
				</el-cascader>
			  </el-form-item> -->
			</el-form>

			
			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisibleTree = false">取 消</el-button>
			    <el-button v-if="addOrEdit=='add'" type="primary" @click="addCase(activeClass)">确 定</el-button>
			    <el-button v-if="addOrEdit=='edit'" type="primary" @click="editCase(activeClass)">确 定</el-button>
			</span>
			
		</el-dialog>
    </div>
</template>
<script>
//提问库接口
import {question} from '@/services/apis/question/question'
//医问道映射接口
import {ywd} from '@/services/apis/ywd'
export default {
	name: 'problem',
	data () {

	    return {
	    	loading: true,
	    	addOrEdit: '', //判断新增还是编辑
	    	currentId:'',  //当前编辑的问题id

	        classes:[],
	        classes2:[],
	        activeName:'',  //当前一级分类
	        activeClass:'', //当前二级分类

	        questionForm:{ //新增问题绑定数据
	        	type:'',
	        	name:'',
	        	relation: [],
	        	childrenQues:[], //相关子问题
	        	questionPath: '',
	        	formateRelation:''  //格式化映射关系
	        },

	        defaultCheckedTree:[],  //选中的映射
	        dialogVisibleTree:false, //显示映射关系树
	        dataTree: [],
	        //联级相关
	        defaultProps: {
	        	value:'name',
	        	label:'name',
	        	children:'children'
	        }, //联级配置
	  		options:[],
	  		searchQuestion:""
	    }
	},
	mounted() {

        this.getQuestionList(0);
        this.setMap();
    },
    
  	methods: {

	    //获取问题列表
	    getQuestionList(id){
	    	question.questionListAll({diseaseId:id}).then(response=>{
			
	            this.classes = response.data.data.trees;
	            this.classes2 = response.data.data.trees;
	            this.activeName = this.classes[0].id.toString();
	            this.activeClass = this.classes[0].children[0].id.toString();
	            this.loading = false;
	        });
	    	
	    },
	    //点击第一级分类
	    tabClick1(tag,event){
	    	this.activeClass = this.classes[tag.index].children[0].id.toString();
	    },
	    //点击第二级分类，获取问题
	    tabClick2(tag){
	    	//this.getQuestionList(tag.name);
	    },

	    getCascaderObj(val,opt) {
          
            for (var i = 0;i<opt.length;i++) {
            	
        		for (var j = 0;j<opt[i].children.length;j++) {
            		if (opt[i].name == val[0] && opt[i].children[j].name == val[1]) { 
                    	//console.log(opt[i].children[j])
                    	this.questionForm.formateRelation = opt[i].children[j].parms[0].questionName
                    }
            	}
            	
            }
                
           
        },
	    handleChange(value){
	    	this.getCascaderObj(this.questionForm.relation,this.dataTree)
	    	this.questionForm.questionPath = '';
	    	for (var i = 0; i < value.length; i++) {
	    		this.questionForm.questionPath+=value[i]+"_"
	    	}
	    	let s = this.questionForm.questionPath;
	    	this.questionForm.questionPath = s.substring(0, s.lastIndexOf('_'))
	    	
	    },
	    /**
		 * 设置映射
		 */
	    setMap(tags){
	    	this.defaultCheckedTree = [];
	    },
	    dialogClose(){
	    	this.questionForm.name = '';
	    	this.questionForm.relation = [];
	    },
	    //显示添加和编辑问题
	    showQuestionForm(type,row){
	    	this.dialogVisibleTree = true;

	    	if (type == 'edit') {
	    		this.addOrEdit = 'edit';
	    		// this.currentId = row;
	    		this.questionForm.name = row.questionName;
	    		// this.questionForm.relation = row.questionPath.split("_");

	    	}else if(type == 'add'){
	    		this.addOrEdit = 'add';
	    		this.questionForm.name = '';
	    		//this.questionForm.relation = [];
	    	}
	    },
	    //新增问题
	    addCase(id){
	    	
	    	// question.addQuestion({classifyId:id,questionName:this.questionForm.name,questionModelPath:this.questionForm.formateRelation,questionPath:this.questionForm.questionPath}).then(response=>{

	    	// 	if (response.data.errCode == 2) {
	    	// 		this.$confirm(response.data.errMsg, '提示', {
			   //        type: 'warning',
			   //        showConfirmButton: false,
			          
			   //      })
	    			
	    	// 	}else{
	    			
	    	// 	}
	     //        this.dialogVisibleTree = false;
	     //    })
	    },
	    editCase(id){

	    	// question.updateQuestion({questionId:this.currentId.id,questionName:this.questionForm.name,questionModelPath:this.questionForm.formateRelation,questionPath:this.questionForm.questionPath}).then(response=>{
	     //        this.getQuestionList(id);
	     //        this.dialogVisibleTree = false;
	     //    })
	    },
	    //删除问题
	    deleteRow(row) {
	      
	        this.$confirm('确定删除该问题吗?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	// question.deleteQuestion({questionId:row.id}).then(response=>{
	        		
		        //     this.$message({
			       //      type: 'success',
			       //      message: '删除成功!'
			       //  });
			       //  this.getQuestionList(this.activeClass)
		        // })
		        
	        }).catch(() => {
	                  
	        });
	    },

	    /**
		 * 取消映射
		 * @param  {[type]} tag   [取消的映射]
		 * @param  {[type]} tags [映射列表]
		 * @return {[type]}      [description]
		 */
	    handleClose(tag,tags){
	    	tags.splice(tags.indexOf(tag), 1)
	    },
    },
    watch : {
	   'activeName':(val) => { //监听切换状态-计划单
	        //this.getClassifyList(val)
	   },
	    searchQuestion(){
	    	let _this = this
	   		let newArray = JSON.parse(JSON.stringify(_this.classes2));;
	   		let search = _this.searchQuestion;
			_this.classes2.forEach((value,index,array)=>{

				_this.classes2[index].children.forEach((v,i,arr)=>{
					newArray[index].children[i].parms = []
						let parm = _this.classes2[index].children[i].parms
						for (var j = 0; j< parm.length; j++) {
							if (parm[j].questionName.includes(search)) {
								newArray[index].children[i].parms.push(parm[j])
							}
						}
				})
				
			})
    		this.classes = search?newArray:this.classes2
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
	height: 420px;
	.el-tabs__content{
		.scroll-y{
			max-height: 420px;
    		overflow-y: auto;
		}
		
	}
}
</style>