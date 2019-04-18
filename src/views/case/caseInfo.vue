<template>
    <div class="caseInfo clearfix">
    	<el-breadcrumb separator-class="el-icon-arrow-right">
		    <el-breadcrumb-item :to="{ path: '/case' }">疾病库</el-breadcrumb-item>
		    <el-breadcrumb-item>{{this.$route.query.diseaseName}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-button v-if="activeSelect == 'list'" type="primary" round size="small" @click="toSearch" class="floatRight"><i class="el-icon-plus"></i> 添加病历</el-button>
		<el-button v-if="activeSelect == 'problem'" type="primary" round size="small" @click="toAddCase" class="floatRight">编辑问题</el-button>
		<el-tabs v-model="activeSelect" type="card" class="m-t-20" @tab-click="handleClick">
		    <el-tab-pane label="病例列表" name="list">
				<el-table :data="tableData" class="m-t-20">
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
			    <!-- <el-pagination
			          class="textRight"
				      @size-change="handleSizeChange"
				      @current-change="handleCurrentChange"
				      :current-page.sync="currentPage"
				      :page-size="10"
				      layout="total, prev, pager, next"
				      :total="100">
				</el-pagination> -->
		    </el-tab-pane>
		    <!-- <el-tab-pane label="问题描述" name="problem">

				<el-table :data="checkQuestion" class="m-t-20">
		    		<el-table-column
				      type="index"
				      label="序号"
				      width="50">
				    </el-table-column>
			        <el-table-column prop="questionName" label="问题">
			        </el-table-column>
			        <el-table-column prop="score" label="分数" width="100">
			        </el-table-column>
			    </el-table>
				
		    </el-tab-pane> -->

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
            caseName:'',
            activeSelect:'list',
            myQuestion:[],
            checkQuestion:[],
            tableData: [],
	        problemList:[],//问题列表
	        currentPage:1  //当前页码
        }
    },
    mounted(){
 	
    	recordApi.listRecord({
			diseaseId:this.$route.query.diseaseId,
		}).then(response=>{

			this.tableData = response.data.data.diseaseRecord;
		})
    	// diseaseApi.relationShips({diseaseId:this.$route.query.diseaseId}).then(response=>{
    	// 	this.myQuestion = response.data.data.trees;
    	// 	if (this.myQuestion) {
	    // 		for (var i = 0; i < this.myQuestion.length; i++) {

	    // 			for (var j = 0; j < this.myQuestion[i].children.length; j++) {
	    // 				//this.allQuestionId.push(this.allQuestion[i].children[j].parms)
	    // 				if (this.myQuestion[i].children[j].parms) {

		   //  				for (var k = 0; k < this.myQuestion[i].children[j].parms.length; k++) {

		   //  					this.checkQuestion.push(this.myQuestion[i].children[j].parms[k])
		   //  				}
		   //  			}
		    			
		   //  		}
	    // 		}
	    // 	}
     //    });
    },
    methods:{
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
	    toSearch(){
	    	this.$router.push({
	    		name:'search',
	    		query:{
	    			host:window.location.host,
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
	        console.log(`当前页: ${val}`);
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
