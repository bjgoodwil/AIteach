<template>
    <div class="caseInfo clearfix">
    	<el-breadcrumb separator-class="el-icon-arrow-right">
		    <el-breadcrumb-item :to="{ path: '/case' }">疾病库</el-breadcrumb-item>
		    <el-breadcrumb-item>{{this.$route.query.diseaseName}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-button v-if="activeSelect == 'list'" type="primary" round size="small" @click="toSearch" class="floatRight"><i class="el-icon-plus"></i> 添加病历</el-button>
		<el-button v-if="activeSelect == 'problem'" type="primary" round size="small" @click="toAddCase" class="floatRight">编辑问题</el-button>
		<el-tabs v-model="activeSelect" type="card" class="m-t-20" @tab-click="handleClick" v-loading="loading">
		    <el-tab-pane label="病例列表" name="list">
				<el-table :data="tableData" class="m-t-20">
		    		<el-table-column
				      type="index"
				      label="序号"
				      width="50">
				    </el-table-column>
			        <!-- <el-table-column prop="specialty" label="科室">
			        </el-table-column> -->
			        <el-table-column prop="diseaseName" label="疾病">
			        </el-table-column>
			        <el-table-column prop="diagnosis" label="出院诊断">
	        		</el-table-column>
			        <el-table-column prop="gender" label="性别" width="60">
			        </el-table-column>
			        <el-table-column prop="age" label="年龄" width="60">
			        </el-table-column>
			        <el-table-column prop="chiefComplaint" label="病历概述">
			        </el-table-column>
			        <!-- <el-table-column prop="symptoms" label="症状">
			        </el-table-column> -->
			        <el-table-column prop="createDate" label="发布时间" width="150">
			        </el-table-column>
			        <el-table-column prop="status" label="状态" width="80">
			        	<template slot-scope="scope">
			        		<el-tag v-if="scope.row.status == 1" type="success">已发布</el-tag>
			        		<el-tag v-else-if="scope.row.status == 0">待审核</el-tag>
			        		<el-tag v-else-if="scope.row.status == 2" type="warning">已审核</el-tag>	
			        	</template>
			        </el-table-column>
			        <el-table-column label="学生查看范围" width="120">
			        	<template slot-scope="scope">
			        		<el-select v-model="scope.row.scope" size="small" @change="(val)=>selectScope(val,scope.row.id)">
							    <el-option label="全部科室" value="0"></el-option>
							    <el-option label="本科室" value="-1"></el-option>
							</el-select>
						</template>
			        </el-table-column>
			        
			        <el-table-column label="操作" width="150">
				      <template slot-scope="scope">
				      	<el-button
				      	  title="查看或修改"
				          type="text" @click="setRecord(scope.row)"><i class="el-icon-view"></i></el-button>
				        <span v-if="scope.row.status == 2" class="m-l-10 m-r-10">
							<el-button
					          title="发布"
					          type="text"
					           @click="changeStatus('1', scope.row)"><i class="el-icon-s-promotion"></i></el-button>
					        <el-button
					      	  title="待审核"
						      type="text"
					           @click="changeStatus('0', scope.row)"><i class="el-icon-document-delete"></i></el-button>
				        </span>
				        
				        <el-button
				          title="下线"
				          type="text"
				          v-else-if="scope.row.status == 1" @click="changeStatus('2', scope.row)"><i class="el-icon-download"></i></el-button>
				        <el-button
				      	  title="通过审核"
				      	  type="text"
				          v-else-if="scope.row.status == 0" @click="changeStatus('2', scope.row)"><i class="el-icon-check"></i></el-button>
				        
				        <el-button
				          title="删除"
				          type="text"
				          @click="handleDelete(scope.$index, scope.row, tableData)"><i class="el-icon-delete"></i></el-button>
				      </template>
				    </el-table-column>
			    </el-table>
			    <el-pagination
			          class="textRight"
				      @size-change="handleSizeChange"
				      @current-change="handleCurrentChange"
				      :current-page.sync="currentPage"
				      :page-size="10"
				      layout="total, prev, pager, next"
				      :total="pageTotla">
				</el-pagination>
		    </el-tab-pane>

		</el-tabs>
		
    </div>
</template>
<script>
import {diseaseApi} from '@/services/apis/disease/disease';
import {recordApi} from '@/services/apis/record/record';
export default {
    name: 'caseInfo',
    data () {

        return {
        	loading:true,
            caseName:'',
            activeSelect:'list',
            myQuestion:[],
            checkQuestion:[],
            params:{
            	teacherUserId:'',
            	diseaseId:'',
            	count:10, //每页数量
	        	page:1 //当前页码
            },  //入参
            pageTotla:null,
            tableData: [],
	        problemList:[],//问题列表
	        currentPage:1  //当前页码
        }
    },
    mounted(){
		this.params.teacherUserId = JSON.parse(localStorage.getItem("uerInfo")).userId;
		this.params.diseaseId = this.$route.query.diseaseId;
		this.getListRecord();
    },
    methods:{
    	getListRecord(){
  			recordApi.listRecord(this.params).then(response=>{
				this.tableData = response.data.data.diseaseRecord;
				this.pageTotla = response.data.data.pageTotla;
				this.loading = false;
			})
  		},
    	/**
		 * 删除病例
		 * @param  {[type]} index   [索引值]
		 * @param  {[type]} row [当前行数据]
		 * @param  {[type]} rows [列表数据]
		 * @return {[type]}      [description]
		 */
	    handleDelete(index, row, rows) {
	    	this.$confirm('确定删除该项目?', '提示', {
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

		        this.$message({
		            type: 'success',
		            message: '删除成功!'
		        });
	        }).catch(() => {
	                  
	        });
	    },
	    //改变病例状态
	    changeStatus(type,row){
	    	recordApi.updateRecordStatus({sampleId:row.id,status:type}).then(response=>{
        		row.status = type;
		        this.$message({
		            type: 'success',
		            message: '修改成功!'
		        });
			})
	    },
	    //改变病例查看范围
	    selectScope(val,id){
	    	recordApi.updateSampleScope({sampleId:id,scope:val}).then(response=>{
		        this.$message({
		            type: 'success',
		            message: '设置成功'
		        });
			})
	    },
	    toSearch(){
	    	let main = '';
	    	main = process.env.NODE_ENV == 'production'?process.env.HOST:window.location.host;
	    	this.$router.push({
	    		name:'search',
	    		query:{
	    			host:main,
		    		disease:this.$route.params.diseaseName,
		    		diseaseId:this.$route.params.id
	    		}
	    	})
	    },
	    handleClick(tab, event) {
	        
	    },
	    // 分页相关
	    handleSizeChange(val) {
	        console.log(`每页 ${val} 条`);
	    },
	    handleCurrentChange(val) {
	        //console.log(`当前页: ${val}`);
	        this.loading = true;
	        this.params.page = val;
	        this.getListRecord();
	    },
	    toAddCase(){
	    	this.$router.push({ 
	    		name: 'addCase', 
	    		query:{
	    			activeName:this.$route.query.activeName,
	    			activeClass:this.$route.query.activeClass
	    		},
	    		params: this.$route.params,
	    	});
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
.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #000;
}
.el-button.el-button--text{
	font-size: 18px;
	.el-icon-delete{
		color: red;
	}
}

</style>
