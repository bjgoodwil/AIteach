<template>
    <div class="record">
		
		<el-tabs v-model="activeName">
		    <el-tab-pane label="病例列表" name="病例列表">
		    	<el-form ref="form" :inline="true" :model="form" label-width="40px" size="small" class="clearfix">
			
					<el-form-item label="专业" class="floatLeft">
					    <el-cascader
						    :options="options"
						    :props="defaultProps"
						    v-model="form.selectedOptions"
						    @change="handleChange">
						</el-cascader>
					</el-form-item>
					<el-form-item label="疾病" class="floatLeft">
						<el-select v-model="form.caseName" clearable placeholder="请选择" size="small" @change="selectDisease">

						    <el-option
						      v-for="item in optionsDis1"
						      :key="item.id"
						      :label="item.diseaseName"
						      :value="item.id">
						    </el-option>
						</el-select>
					</el-form-item>
					
				</el-form>
		    	<label for="">性别 </label>
				<el-radio-group v-model="form.gender"  size="small" class="m-l-10" @change="selectGender">
			      <el-radio-button label="">全部</el-radio-button>
			      <el-radio-button label="男">男</el-radio-button>
			      <el-radio-button label="女">女</el-radio-button>
			    </el-radio-group>
			    <label for="" class="m-l-20">状态 </label>
			    <el-radio-group v-model="form.status" size="small" class="m-l-10" @change="selectStatus">
			      <el-radio-button label="">全部</el-radio-button>
			      <el-radio-button label="1">已发布</el-radio-button>
			      <el-radio-button label="0">未发布</el-radio-button>
			    </el-radio-group>
			    <el-button type="primary" round size="small" @click="showDialogForm" class="floatRight"><i class="el-icon-plus"></i> 添加病历</el-button>
		    </el-tab-pane>
		    
		</el-tabs>

    	
    	<el-table :data="tableData" class="m-t-20" stripe v-loading="loading">
    		<el-table-column
		      type="index"
		      label="序号"
		      width="50">
		    </el-table-column>
	        <!-- <el-table-column prop="specialty" label="科室">
	        </el-table-column> -->
	        <el-table-column prop="diagnosis" label="疾病">
	        </el-table-column>
	        <el-table-column prop="gender" label="性别" width="60">
	        </el-table-column>
	        <el-table-column prop="age" label="年龄" width="60">
	        </el-table-column>
	        <el-table-column prop="chiefComplaint" label="病历概述">
	        </el-table-column>
	        <el-table-column prop="symptoms" label="症状">
	        </el-table-column>
	        <el-table-column prop="status" label="状态" width="80">
	        	<template slot-scope="scope">
	        		<span v-if="scope.row.status == 1">已发布</span>
	        		<span v-else-if="scope.row.status == 0"> 未发布 </span>
	        	</template>
	        </el-table-column>
	        <el-table-column prop="createDate" label="发布时间" width="200">
	        </el-table-column>
	        <el-table-column label="操作" width="120">
		      <template slot-scope="scope">
		      	<el-button
		      	  title="查看"
		          type="text" @click="setRecord(scope.row)"><i class="el-icon-search"></i></el-button>
		        <el-button
		          title="发布"
		          type="text"
		          v-if="scope.row.status == 0" @click="changeStatus('1', scope.row)"><i class="el-icon-upload"></i></el-button>
		        <el-button
		          title="下架"
		          type="text"
		          v-if="scope.row.status == 1" @click="changeStatus('0', scope.row)"><i class="el-icon-download"></i></el-button>
		        <el-button
		          title="删除"
		          type="text"
		          @click="handleDelete(scope.$index, scope.row, tableData)"><i class="el-icon-delete"></i></el-button>
		      </template>
		    </el-table-column>
	    </el-table>
	    <!-- 分页 -->
	    <!-- <el-pagination
	          class="textRight"
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page.sync="currentPage"
		      :page-size="10"
		      layout="total, prev, pager, next"
		      :total="100">
		</el-pagination> -->
		<el-dialog title="选择专业疾病" :visible.sync="dialogFormVisible" @close="dialogClose" width="600px">
			<el-form :model="diseaseForm" label-width="80px">
			  	<el-form-item label="专业">
			  
			        <el-cascader
			        	style="width: 480px"
					    :options="options"
					    :props="defaultProps"
					    v-model="diseaseForm.diseaseType"
					    @change="handleChangeSearch"
					    >
					</el-cascader>
			    </el-form-item>
			    <el-form-item label="疾病">
			        <el-select v-model="diseaseForm.disease" placeholder="请选择" style="width: 480px" @change="handleChangeGetId">
					    <el-option
					      
					      v-for="item in optionsDis2"
					      :key="item.id"
					      :label="item.diseaseName"
					      :value="item">
					    </el-option>
					</el-select>
			    </el-form-item>
			    
			</el-form>
			<div slot="footer" class="dialog-footer">
			    <el-button @click="dialogFormVisible = false">取 消</el-button>
			    <el-button type="primary" @click="toSearch">确 定</el-button>
			</div>
		</el-dialog>
    </div>
</template>
<script>
import {diseaseApi} from '@/services/apis/disease/disease';
import {recordApi} from '@/services/apis/record/record';
export default {
	name: 'record',
	data () {
		
	    return {
	    	loading:true,
	    	disabled:false,
	    	activeName:'病例列表',
	    	form:{
        		selectedOptions: [],//所选专业
	        	caseName: '',//添加的疾病症状名称
	        	diseaseId:'',
	        	gender:'',//性别
	        	status:'' //
        	},
        	dialogFormVisible:false,
        	diseaseForm:{
        		diseaseType:[],
        		disease:'',
        		diseaseId:'',
        	},
        	options: [],//疾病分类
        	optionsDis1: [],//疾病
        	optionsDis2: [],
	        defaultProps: {
	        	value:'id',
	        	label:'name'
	        },
	        tableData: [],
	        currentPage:1  //当前页码
	    }
	},
	mounted(){
		this.getListRecord({diseaseId:'',status:'',gender:''});
    	//判断是添加还是编辑
    	if (this.$route.params.diseaseName) {
    		this.disabled = true;
    	}else{this.disabled = false;}
    	//获取疾病所有分类
    	diseaseApi.diseaseTypesAll().then(response=>{
    		this.options = response.data.data.trees;
    	})
    },
  	methods: {
  		getListRecord(params){
  			recordApi.listRecord(params).then(response=>{
				this.tableData = response.data.data.diseaseRecord;
				this.loading = false;
			})
  		},
	    //改变病例状态
	    changeStatus(type,row){
	    	let text = ''
	    	if (type == 1) text = '发布'; else text = '下架';
	    	console.log(text)
	    	this.$confirm('确定'+text+'病例吗?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	recordApi.updateRecordStatus({sampleId:row.id,status:type}).then(response=>{
	        		row.status = type;
			        this.$message({
			            type: 'success',
			            message: '病例已'+text+'!'
			        });
				})
	        }).catch(() => {
	                  
	        });
	    	
	    },
	    //选择疾病
	    selectDisease(val){
	    	this.loading = true;
	    	this.form.diseaseId = val;
	    	if (val == '') this.form.selectedOptions = [];
	    	
	    	this.getListRecord({diseaseId:val,status:this.form.status,gender:this.form.gender});
	    },
	    //选择状态
	    selectStatus(val){
	    	this.loading = true;
	    	this.getListRecord({diseaseId:this.form.diseaseId,status:val,gender:this.form.gender});
	    },
	    //选择性别
	    selectGender(val){
	    	this.loading = true;
	    	this.getListRecord({diseaseId:this.form.diseaseId,status:this.form.status,gender:val});
	    },
	    /**
		 * 删除病例
		 * @param  {[type]} index   [索引值]
		 * @param  {[type]} row [当前行数据]
		 * @param  {[type]} rows [列表数据]
		 * @return {[type]}      [description]
		 */
	    handleDelete(index, row, rows) {
	    	this.$confirm('确定删除该病例吗?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	recordApi.deleteDiseaseRecord({sampleId:row.id}).then(response=>{
	        		rows.splice(index, 1);
			        this.$message({
			            type: 'success',
			            message: '删除成功!'
			        });
				})
	        }).catch(() => {
	                  
	        });
	    },
	    //dialog打开的回调
	    showDialogForm(){
	    	this.dialogFormVisible = true;
	    	this.optionsDis2 = [];
	    },
	    //dialog关闭的回调
	    dialogClose(){
	    	this.diseaseForm.diseaseType = [];
	    	this.diseaseForm.disease = '';
	    },
	    //to搜索结果列表页
	    toSearch(){
	    	if (this.diseaseForm.disease == '') {
	    		this.$message({
		          message: '请选择疾病',
		          type: 'warning'
		        });
	    	}else{
	    		this.$router.push({name:'search',
		    		query:{
		    			host:window.location.host,
		    			disease:this.diseaseForm.disease,
		    			diseaseId:this.diseaseForm.diseaseId
		    		}
		    	})
	    	}
	    	
	    },
	    handleChange(val){
	    	
	    	this.form.caseName = '';
	    	diseaseApi.listDisease({typeId:val[1]}).then(response=>{
	            this.optionsDis1 = response.data.data.diseasevolist;
	        })
	    },
	    handleChangeSearch(val){
	    	this.diseaseForm.disease = '';
	    	//获取疾病
	    	diseaseApi.listDisease({typeId:val[1]}).then(response=>{
	            this.optionsDis2 = response.data.data.diseasevolist;
	        })
	    	
	    },
	    handleChangeGetId(val){
	    	this.diseaseForm.disease = val.diseaseName;
	    	this.diseaseForm.diseaseId = val.id;

	    },
	    // 分页相关
	    handleSizeChange(val) {
	        console.log(`每页 ${val} 条`);
	    },
	    handleCurrentChange(val) {
	        console.log(`当前页: ${val}`);
	    },
	    //to结构化病历
	    setRecord(row){
	    	this.$router.push({
	    		name:'setRecord',
	    		query:{
	    			disease:row.diagnosis,
	    			type:'edit',
	    			sampleId:row.id
	    		}
	    	})
	    }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-button.el-button--text{
	font-size: 18px;
	/*.el-icon-upload{
		color: rgb(103, 194, 58);
	}*/
	.el-icon-delete{
		color: red;
	}
}
</style>