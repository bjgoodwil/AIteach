<template>
    <div class="mapTable" v-loading="fullscreenLoading">
		<p style="height: 32px;"><i class="el-icon-location-outline"></i> 问题分类表 </p>
    	<el-tabs v-model="activeName" tab-position="left" @tab-click="tabClick1">
		    <el-tab-pane v-for="(item,index) in questionList" :key="item.id" :label="item.standandTypeName" :name="item.id">
		    	<div class="clearfix">
					<el-button type="primary" round class="floatRight m-l-10" size="small" @click="save">保存</el-button>
		    		<el-button type="primary" round class="floatRight" size="small" @click="showQuestionForm(item.id)"><i class="el-icon-plus"></i> 添加问题</el-button>
		    	</div>
		    	
		    	<table style="width: 100%;" class="m-t-10">
					<thead>
						<th style="width: 8%">序号</th>
						<th style="width: 36%">问题</th>
						<th style="width: 36%">路径</th>
						<th style="width: 10%">过滤条件</th>
						<th style="width: 10%">操作</th>
					</thead>
				</table>
				<table style="width: 100%;">
					<tbody>
						<!-- <draggable v-model="tableData" @update="datadragEnd" :options = "{animation:500}"> -->
							<tr v-for="(it,index) in tableData" :key="it.id" class="questionList">
								<td style="width: 8%">{{index+1}}</td>
								<td style="width: 36%"><el-input v-model="it.questionName" size="small" placeholder="问题"></el-input></td>
								<td style="width: 36%"><el-input v-model="it.relativePath" size="small" placeholder="问题路径"></el-input></td>
								<td style="width: 10%"><el-input v-model="it.filterParm" size="small" placeholder="过滤条件"></el-input></td>
								<td style="width: 10%">
									<el-button
							          title="删除"
							          type="text" @click.native.prevent="deleteRow(index)">
							          <i class="el-icon-delete"></i></el-button>
							    </td>
							</tr>
						<!-- </draggable> -->
					</tbody>
					<p v-if="tableData.length == 0" class="textCenter m-t-10">暂无数据</p>
				</table>
		    </el-tab-pane>
		
		</el-tabs>

		<!-- 添加问题弹出框 -->
		<el-dialog
		  title="添加问题"
		  :visible.sync="dialogVisibleTree"
		  width="600px"
		  @close="dialogClose"
		  :close-on-click-modal="false"
		  >
		    
		  	<el-form label-width="100px" :model="questionForm">
		  		<el-form-item label="问题名称">
					<el-input v-model="questionForm.questionName" placeholder="请输入问题" size="small"></el-input> 
				</el-form-item>
				<el-form-item label="问题路径">
				    <el-input v-model="questionForm.questionPath" placeholder="请输入问题路径" size="small"></el-input> 
				</el-form-item>
				<el-form-item label="过滤条件">
				    <el-input v-model="questionForm.questionParm" placeholder="请输入过滤条件" size="small"></el-input> 
				</el-form-item>
			</el-form>
			
			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisibleTree = false">取 消</el-button>
			    <el-button type="primary" @click="addQuestion">确 定</el-button>
			    
			</span>
			
		</el-dialog>
    </div>
</template>
<script>
import draggable from 'vuedraggable';//拖拽排序组件
import {question} from '@/services/apis/question/question'
export default {
	name: 'mapTable',
	components: {
	    draggable
	},
	data () {
	    return {
	    	fullscreenLoading:true,
	    	activeName:'',
	    	tableData: [],
	        questionList:[],
	        dialogVisibleTree:false,
	        questionForm:{
	        	standandTypeId:'',
	        	questionName:'',
	        	questionPath:'',
	        	questionParm:'',
	        	questionNum:''
	        }
	    }
	},
	mounted() {
		question.standandType().then(response=>{
    		this.questionList = response.data.data
    		this.activeName = response.data.data[0].id

    		this.getAllSubQuestion(this.questionList[0].id)
    	})
		//为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
        document.body.ondrop = function (event) {
            event.preventDefault();
            event.stopPropagation();
        }
	},
  	methods: {

	    //获取问题列表
	    getAllSubQuestion(id){
	    	
	    	question.allSubQuestion({standandTypeId:id}).then(response=>{
	    		this.tableData = response.data.data;
	            this.fullscreenLoading = false;
	        })
	    	
	    },
	    //点击问题分类
	    tabClick1(tag){
	    	this.fullscreenLoading = true;
	    	this.getAllSubQuestion(tag.name);
	    },
        //显示添加问题表单
	    showQuestionForm(){
	    	this.dialogVisibleTree = true;
	    
	    },
        deleteRow(index){
        	this.$confirm('确定删除该问题吗?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	this.tableData.splice(index, 1);
	        	this.save();
	        }).catch(() => {
	                  
	        });
        },
        dialogClose(){
        	for(var i in this.questionForm) {
				this.questionForm[i] = '';
			}
	    },
	    addQuestion(typeId){
	    	this.questionForm.standandTypeId = this.activeName;
	    	this.questionForm.questionNum = this.tableData.length+1;
	    	question.addSubQuestion(this.questionForm).then(response=>{
	    		if (response.data.errCode == '0') {
	    			this.$message({
			            type: 'success',
			            message: '添加成功!'
			        });
			        this.getAllSubQuestion(this.activeName)
			        this.dialogVisibleTree = false;
	    		}else{
	    			this.$message({
			            type: 'warning',
			            message: response.data.errMsg
			        });
	    		}
	    		
	        })
	    },
	    save(){
	    	for (var i = 0; i < this.tableData.length; i++) {
	    		this.tableData[i].questionNumber = i+1;
	    	}
	    	question.updateSubQuestion({questionJson:JSON.stringify(this.tableData)}).then(response=>{
	    		if (response.data.errCode == '0') {
	    			this.$message({
			            type: 'success',
			            message: '保存成功!'
			        });
			        this.getAllSubQuestion(this.activeName)
			        this.dialogVisibleTree = false;
	    		}else{
	    			this.$message({
			            type: 'warning',
			            message: response.data.errMsg
			        });
	    		}
	        })
	    },
	    //行拖拽
	    datadragEnd (evt) {
            evt.preventDefault();
        },
    },
    watch:{
        
    }
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
.el-form-item {
    margin-bottom: 0;
}
.questionList{
	border-bottom: 1px #f0f0f0 solid;
	td{
		padding: 2px 5px;
		vertical-align: middle;
	}
}
</style>