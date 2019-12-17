<template>
    <div class="searchResult">
    	<!-- <router-link to="/list">
    		<el-button type="text">返回病历库</el-button>
    	</router-link> -->
    	<el-breadcrumb separator-class="el-icon-arrow-right">
		    <el-breadcrumb-item to="/list">病例库</el-breadcrumb-item>
		    <el-breadcrumb-item>病历列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-table :data="tableData" class="m-t-20" v-loading="loading" element-loading-text="拼命加载中...">
    		<el-table-column
		      type="index"
		      label="序号"
		      width="50">
		    </el-table-column>
	        <el-table-column prop="gender" label="性别" width="100">
	        </el-table-column>
	        <el-table-column label="年龄" width="100">
	        	<template slot-scope="scope">
					{{scope.row.age}}
	        	</template>
	        </el-table-column>
	        <el-table-column label="主诉">
	        	<template slot-scope="scope">
	        		<el-button type="text" @click="open(scope.row)">{{scope.row.chiefComplaint}}</el-button>
	        	</template>
	        </el-table-column>
	        <!-- <el-table-column prop="visitNum" label="就诊次" width="100">
	        </el-table-column> -->
	        <el-table-column label="操作" width="100">
		      <template slot-scope="scope">
		      	<el-button
		      	  title="编辑"
		          type="text" @click="setRecord(scope.row)"><i class="el-icon-edit"></i></el-button>
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
	      :total="total">
	    </el-pagination>
    </div>
</template>
<script>
import {ywd} from '@/services/apis/ywd';
import {recordApi} from '@/services/apis/record/record';
export default {
	name: 'search',
	data () {
		console.log()
	    return {
	    	loading: true,
	    	tableData:[],//病历列表数据
	    	total:0,//总条数
	    	currentPage:1,  //当前页码
	    	param:{
	    		keywords:JSON.stringify({"name":this.$route.query.keywords,"page":0,"size":10}),
	    		disease:'',
	    	},//参数
	        result:'',

	    }
	},
	mounted() {
		console.log(this.$route.query.keywords)
		ywd.getToken({token:'token'}).then(response=>{
			localStorage.setItem("token", response.data.result);
			this.getData(this.param);
        })
  		//this.getData(this.param);
		
	},
	beforeRouteEnter(to, from, next) {
	   next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
	      //console.log(to)
	      //console.log(from)
	    })
	},

  	methods: {
      	getData(param){
      		ywd.search(param).then(response=>{
      			this.tableData = response.data.hitRes;
      			this.total = response.data.hitCount;
	            this.loading = false;

	        })
      	},
      	// 分页相关
	    handleSizeChange(val) {
	        console.log(`每页 ${val} 条`);
	    },
	    handleCurrentChange(val) {
	    	this.loading = true;
	    	let v = JSON.parse(this.param.keywords);
	    	v.page = val-1;
	    	this.param.keywords = JSON.stringify(v);
	    	this.getData(this.param);
	        console.log(`当前页: ${val}`);
	    },
	    //to结构化病历
	    setRecord(row){
	  //   	recordApi.sampleAreRepeat({
			// 	diseaseId:this.$route.query.diseaseId,
	  //   		patientId:row.patientId,
	  //   		visitId:row.visitNum
			// }).then(response=>{
			// 	if (response.data.data) {
			// 		this.$message({
			//             type: 'warning',
			//             message: '该病例已存在!'
			//         });
			// 	}else{
					this.loading = true;
					recordApi.questionRelationShips({
						diseaseId:this.$route.query.diseaseId,
						patientId:row.patientId,
						visitId:row.visitNum,
						sceneName:'入院'
					}).then(response=>{
						let params = response.data.data;
						if (response.data.errCode == "0") {
			    			this.$set(params, "sampleParms",{
				     			mrKey:params.mrkey || '',
							    profession:params.profession || '',
							    hospitalizedTime:params.sceneStartTime || '',
				     		})
			     			recordApi.addDiseaseRecord({
								diseaseId:this.$route.query.diseaseId,
								teacherId:localStorage.getItem("uerId"),
								relationJson:JSON.stringify(params)
							}).then(response=>{
								this.loading = false;
								this.$message({
						            type: 'success',
						            message: '病例已保存!'
						        });
								this.$router.push({
						    		name:'setRecord',
						    		query:{
						    			disease:this.$route.query.disease,
						    			type:'edit',
						    			sampleId:response.data.data,
						    			diseaseId:this.$route.query.diseaseId
						    		}
						    	})
							})
			    		}else{
			    			this.$message({
						        message: response.data.errMsg,
						        type: 'warning'
					        });
			    		}
					})
					// this.$router.push({
			  //   		name:'setRecord',
			  //   		query:{
			  //   			disease:this.$route.query.disease,
			  //   			diseaseId:this.$route.query.diseaseId,
			  //   			patientId:row.patientId,
			  //   			visitId:row.visitNum,
			  //   			mrKey:row.mrKey,
			  //   			profession:row.profession,
			  //   			hospitalizedTime:row.hospitalizedTime,
			  //   		}
			  //   	})
			  //	}
			//})
	    	
	    },
	    open(row){
	    	//console.log(row)
	    	window.open(process.env.HOST+'search/bysy/casehistory.html?pid='+row.patientId+'&sex='+row.gender+'&age='+row.age+'&occup='+row.profession+'&mrKey='+row.mrKey+'&sonlist=default&datelist='+row.hospitalizedTime+'&form=AI', '_blank', 'height=600, width=1000, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no') 
	    },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.el-button.el-button--text i{
	font-size: 18px;

}
</style>