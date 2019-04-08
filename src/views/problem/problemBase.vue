<template>
    <div class="problem">
		<p style="height: 32px;"><i class="el-icon-location-outline"></i> 提问库 &nbsp;&nbsp;
			<!-- <el-input v-model="searchQuestion" placeholder="请输入关键字查看问题是否存在" size="small" style="width: 400px"></el-input>  -->
			<el-button type="primary" round class="addBtn floatRight" size="small" @click="showQuestionForm('add','')"><i class="el-icon-plus"></i> 新建问题 </el-button>
		</p>
		
		<el-tabs v-model="activeName" @tab-click="tabClick1">
			<el-tab-pane v-for="item in classes" :id="item.id" :key="item.id" :label="item.classifyName" :name="item.id.toString()" >
		
				<el-tabs tab-position="left" v-model="activeClass" @tab-click="tabClick2">
					<el-tab-pane v-for="(it,eq) in item.list" :key="it.id" :label="it.classifyName" :name="it.id.toString()">
						
						<el-table :data="questionList" v-loading="loading">
				    		<el-table-column
						      type="index"
						      label="序号"
						      width="50">
						    </el-table-column>
					        <el-table-column :label="it.classifyName">
					        	<template slot-scope="scope">
									{{scope.row.questionName}}								
					        	</template>
					        </el-table-column>
					        <el-table-column prop="questionPath" label="映射关系">
					        	
					        </el-table-column>
					        <el-table-column width="100px" label="操作">
					        	<template slot-scope="scope">
					        		<!-- <el-button
							          size="mini" @click="setMap(scope.row.tags)">映射</el-button> -->
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
					        </el-table-column>
					    </el-table>
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
			  <el-form-item label="问题">
			    <el-input v-model="questionForm.name" placeholder="请输入问题"></el-input>
			  </el-form-item>
			  <el-form-item label="映射">
			    
			    <el-cascader
			    	style="width: 480px"
					:props="defaultProps"
				    :options="dataTree"
				    v-model="questionForm.relation"
				    filterable
				    placeholder="试试搜索"
				    @change="handleChange">
				</el-cascader>
			  </el-form-item>
			</el-form>
		  	<!-- <el-tree
		  	:props="treeProp"
		  	  ref="tree"
			  :data="dataTree"
			  show-checkbox
			  
			  :default-checked-keys="defaultCheckedTree"
			  node-key="id"
			  @check-change="handleCheckChange">
			</el-tree> -->
			
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
	        activeName:'',  //当前一级分类
	        activeClass:'', //当前二级分类
	        questionList:[],//问题列表

	        questionForm:{ //新增问题绑定数据
	        	name:'',
	        	relation: [],
	        	questionPath: '',
	        	formateRelation:''  //格式化映射关系
	        },

	        defaultCheckedTree:[],  //选中的映射
	        dialogVisibleTree:false, //显示映射关系树
	        dataTree: [],
	        treeProp:{
	        	label:'name',
	        	children:'childs'
	        },
	        //联级相关
	        defaultProps: {
	        	value:'name',
	        	label:'name',
	        	children:'children'
	        }, //联级配置
	  		options:[],
	  		selectedOptions:[],
	  		searchQuestion:""
	    }
	},
	mounted() {
		
		question.classifyList({fatherId:0}).then(response=>{

            this.classes = response.data.data.questionClassifyList;
            this.activeName = this.classes[0].id.toString();
            this.getClassifyList(this.classes[0].id,0)
        });
        //this.classifyList();
        this.setMap();
    },
    
  	methods: {
  		//获取问题分类列表
	    getClassifyList(id,index){
	    	this.loading = true;
	    	question.classifyList({fatherId:id}).then(response=>{
	    		this.classes[index].list = response.data.data.questionClassifyList;
	    		this.activeClass = this.classes[index].list[0].id.toString();
	    		this.getQuestionList(this.classes[index].list[0].id)
	    	})
	    	
	    },
	    //获取问题列表
	    getQuestionList(id){
	    	this.loading = true;
	    	question.questionList({classifyId:id}).then(response=>{
	            this.questionList = response.data.data.questionList;
	            this.loading = false;
	        })
	    	
	    },
	    //点击第一级分类
	    tabClick1(tag,event){
	    	this.questionList = [];
	    	this.getClassifyList(tag.name,tag.index);
	    },
	    //点击第二级分类，获取问题
	    tabClick2(tag){
	    	this.questionList = [];
	    	this.getQuestionList(tag.name);
	    },
        handleCheckChange(data, checked, indeterminate) {
	        //console.log(data, checked, indeterminate);
	        //设置单选
	        this.i++;
            if(this.i%2==0){
                if(checked){
                    this.$refs.tree.setCheckedKeys([]);
                    this.$refs.tree.setCheckedKeys([data]);
                    //交叉点击节点
                }else{
                    this.$refs.tree.setCheckedKeys([]);
                    //点击已经选中的节点，置空
                }
            }

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
      		
      		question.getModelList().then(response=>{
	            this.dataTree = response.data.data.trees;
	        });

	    },
	    dialogClose(){
	    	this.questionForm.name = '';
	    	this.questionForm.relation = [];
	    },
	    //显示添加和编辑问题
	    showQuestionForm(type,row){
	    	console.log(row)
	    	this.dialogVisibleTree = true;

	    	if (type == 'edit') {
	    		this.addOrEdit = 'edit';
	    		this.currentId = row;
	    		this.questionForm.name = row.questionName;
	    		this.questionForm.relation = row.questionPath.split("_");

	    	}else if(type == 'add'){
	    		this.addOrEdit = 'add';
	    		this.questionForm.name = '';
	    		//this.questionForm.relation = [];
	    	}
	    },
	    //新增问题
	    addCase(id){
	    	
	    	question.addQuestion({classifyId:id,questionName:this.questionForm.name,questionModelPath:this.questionForm.formateRelation,questionPath:this.questionForm.questionPath}).then(response=>{
	            this.getQuestionList(id);
	            this.dialogVisibleTree = false;
	        })
	    },
	    editCase(id){

	    	question.updateQuestion({questionId:this.currentId.id,questionName:this.questionForm.name,questionModelPath:this.questionForm.formateRelation,questionPath:this.questionForm.questionPath}).then(response=>{
	            this.getQuestionList(id);
	            this.dialogVisibleTree = false;
	        })
	    },
	    //删除问题
	    deleteRow(row) {
	      
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
			        this.getQuestionList(this.activeClass)
		        })
		        
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
</style>