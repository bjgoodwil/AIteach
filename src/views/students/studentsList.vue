<template>
    <div class="students">
    	
    	<div class="clearfix">
    		<p class="floatLeft"><i class="el-icon-location-outline"></i> 学生列表 </p>
    		<!-- <el-button type="primary" round class="floatRight m-l-10" size="small"><i class="el-icon-upload2"></i> 批量导入</el-button> -->
    		<el-upload
		      ref="upload"
			  class="upload-demo floatRight m-l-10"
			  :action="uploadUrl"
			  :multiple="false"
			  :before-upload="beforeExcelUpload"
			  :on-success="handleExcelSuccess">
			  <el-button slot="trigger" round size="small" type="primary"><i class="el-icon-upload2"></i> 批量导入</el-button>
			</el-upload>
			<el-button type="primary" round class="floatRight m-l-10" size="small" @click="downloadTemplate"><i class="el-icon-download"></i> 下载模板</el-button>
    		<el-button type="primary" round class="floatRight" size="small" @click="showStudentForm('add')"><i class="el-icon-plus"></i> 添加学生</el-button>

    	</div>
    	<el-cascader
    		size="small"
    		class="m-r-20"
    		placeholder="请选择科室筛选"
		    :options="permissions"
		    :props="{ checkStrictly: true,value:'diseaseType',label:'permissionName',children:'teacherPermissionVOChilds' }"
		    clearable
		    @change="handleChangeClass">
	    </el-cascader>
	    <el-input v-model="params.searchKey" placeholder="请输入姓名或手机号" size="small" @input="handleChangeSearchKey" clearable style="width: 220px" ></el-input>
    	<el-table :data="tableData" class="m-t-20" v-loading="loading">
    		<el-table-column
		      label="序号"
		      width="50">
		      <template slot-scope="scope">
				{{(params.page-1)*10+(scope.$index+1)}}
		      </template>
		    </el-table-column>
		    <!-- <el-table-column prop="id" label="Id" width="160">
		    </el-table-column> -->
		    <el-table-column prop="userName" label="姓名" width="100">
		    </el-table-column>
	        <el-table-column prop="sex" label="性别" width="80"> 
	        </el-table-column>
			<el-table-column prop="name" label="账号">
	        </el-table-column>
	        <el-table-column prop="identity" label="学生类型">
	        </el-table-column>
			<el-table-column prop="grade" label="班级">
	        </el-table-column>
	        <el-table-column prop="studentNumber" label="学号">
	        </el-table-column>
	        <el-table-column prop="deptName" label="学科专业">
	        </el-table-column>
	        <el-table-column prop="deptSubName" label="科室">
	        
	        </el-table-column>
	        <el-table-column label="操作" width="120">
		      <template slot-scope="scope">
		      	<el-button
		      	  title="查看统计"
		          type="text" @click="lookStatistics(scope.row.id)"><i class="el-icon-pie-chart"></i></el-button>
		      	<el-button
		      	  title="编辑"
		          type="text" @click="edit(scope.row,'edit')"><i class="el-icon-edit"></i></el-button>
		        <el-button
		      	  title="删除"
		          type="text" @click="deleteStudent(scope.row)"><i class="el-icon-delete"></i></el-button>
		      </template>
		    </el-table-column>
		</el-table>
		<!-- 分页 -->
	    <el-pagination
          class="textRight"
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page.sync="params.page"
	      :page-size="params.count"
	      layout="total, prev, pager, next"
	      :total="pageTotla">
		</el-pagination>
		<!-- 添加用户弹出框 -->
		<el-dialog
		  title="编辑学生信息"
		  :visible.sync="dialogVisibleStudents"
		  width="630px"
		  @close="dialogClose"
		  :close-on-click-modal="false"
		  >
		    <el-tabs v-model="activeName">
			    <el-tab-pane label="基本信息" name="first" @tab-click="handleClick">
					<el-form label-width="80px" :model="studentsForm" :inline="true" class="demo-form-inline" ref="form" :rules="rules">
				  		<el-form-item label="姓名" prop="userName">
							<el-input v-model="studentsForm.userName" placeholder="请输入姓名" size="small"></el-input> 
						</el-form-item>
						<el-form-item label="性别" prop="sex">
						    <el-radio-group v-model="studentsForm.sex">
						      <el-radio label="男">男</el-radio>
						      <el-radio label="女">女</el-radio>
						    </el-radio-group>
						</el-form-item>
						<el-form-item label="账号" prop="accountName">
						    <el-input v-model="studentsForm.accountName" placeholder="请输入手机号" size="small"></el-input> 
						</el-form-item>
						<el-form-item label="密码" prop="password" v-if="addOrEdit == 'add'">
						    <el-input type="password" v-model="studentsForm.password" placeholder="请输入密码" size="small"></el-input> 
						</el-form-item>
						<el-form-item label="学号">
						    <el-input v-model="studentsForm.studentNumber" placeholder="请输入学号" size="small"></el-input> 
						</el-form-item>
						<el-form-item label="身份证号" prop="identificationNumber">
						    <el-input v-model="studentsForm.identificationNumber" placeholder="请输入身份证号" size="small"></el-input> 
						</el-form-item>
						<el-form-item label="附属账号">
						    <el-input v-model="studentsForm.affiliateAccount" placeholder="请输入附属账号" size="small"></el-input> 
						</el-form-item>
						<el-form-item label="主账号">
						    <el-input v-model="studentsForm.mainAccount" placeholder="请输入主账号" size="small"></el-input> 
						</el-form-item>
						<el-form-item label="学生类别">
						    <el-select v-model="studentsForm.identity" placeholder="学生类别" size="small" style="width: 200px">
						      	<el-option  v-for="item in [{label:'住培生[一阶段]', value:'住培生[一阶段]'},{label:'住培生[二阶段]', value:'住培生[二阶段]'},{label:'研究生[硕士]', value:'研究生[硕士]'},{label:'研究生[博士]', value:'研究生[博士]'},{label:'医学生[本科]', value:'医学生[本科]'},{label:'医学生[博士]', value:'医学生[博士]'}]"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
						    </el-select>
						</el-form-item>
						<el-form-item label="班级">
						    <el-input v-model="studentsForm.grade" placeholder="请输入班级" size="small"></el-input> 
						</el-form-item>
						<el-form-item label="科室" prop="permissionId">
						    <el-cascader
						        style="width: 200px"
						        size="small"
							    :options="permissions"
							    :props="props"
							    :value="studentsForm.permissionId"
							    @change="handleChange"
							    clearable>
							</el-cascader>
						</el-form-item>
					</el-form>
					
			    </el-tab-pane>
			    <el-tab-pane label="重置密码" name="second" v-if="addOrEdit == 'edit'">
					<el-form label-width="60px" :model="passwordForm">
				  		<el-form-item label="密码">
							<el-input type="password" v-model="passwordForm.password" placeholder="请输入密码" size="small"></el-input> 
						</el-form-item>
					</el-form>
			    </el-tab-pane>
		    </el-tabs>
		    <span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisibleStudents = false">取 消</el-button>
			    <el-button type="primary" @click="editPassword" v-if="activeName == 'second'">确 定</el-button :loading="btnLoading">
			    <el-button type="primary" @click="addStudent('form')" v-else :loading="btnLoading">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 成绩统计弹出框 -->
		<el-dialog
		  title="成绩统计"
		  :visible.sync="statisticsDialogVisible"
		  width="800px">
		    <statistics-score :userId="userId"></statistics-score>
			<!-- <div id="statisticScore" ref="statisticScore" style="height: 360px"></div> -->
		  </span>
		</el-dialog>
    </div>
</template>
<script>
import {studentsApi} from '@/services/apis/students/students'
import {teachersApi} from '@/services/apis/teachers/teachers'
//import Blob from '@/vendor/Blob'
import Export2Excel from '@/vendor/Export2Excel.js'
import StatisticsScore from '@/components/statistics/statistics'
export default {
	name: 'students',
	components: {
        StatisticsScore,
    },
	data () {
	    return {
	    	userId:'',
	    	loading:true,
	    	btnLoading: false,
	    	tableData:[],
	    	statisticsDialogVisible:false,
	    	dialogVisibleStudents:false,
	    	studentsForm:{
	    		userId:'',
	    		userName:'',
	    		sex:'男',
	    		accountName:'',
	    		password:'', 
	    		studentNumber:'', //学号
	    		identificationNumber:'', //身份证号
	    		affiliateAccount:'', //附属账号
	    		mainAccount:'', //主账号
	    		identity:'住培生[一阶段]',//学生类别
	    		grade:'',//班级
	    		permissionId:''//权限
	    	},
	    	resetStudentsForm:'', //重置学生信息
	    	passwordForm:{ //修改密码
	    		password:'',
	    	},
	    	props: { 
	    		value:"diseaseType",
	    		label:"permissionName",
	    		children:"teacherPermissionVOChilds"
	    	},
	    	permissions: [], //权限列表
	    	addOrEdit:'',  //新增还是编辑
	    	currentData:'', //当前操作对象
	    	uploadUrl:'',
	    	activeName: 'first',
	    	params:{
	    		permissionId:'',
	    		searchKey:'', //姓名和手机号
	    		count:10, //每页数量
	        	page:1 //当前页码
	    	},
	    	pageTotla:null,  //总条数,
	    	rules: {
                userName: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' }
                ],
                accountName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { min: 6, message: '长度最少 6 个字符', trigger: 'blur' }
                ],
                identificationNumber: [
                	{ required: true, message: '身份证号不能为空', trigger: 'blur' }
                ],
                permissionId: [
                	{ required: true, message: '请选择专业科室', trigger: 'blur' }
                ]
            },
	    	studentTemplate: [
		        {'account':'学生手机号', 'name':'张三', 'sex':'男', 'studentNum':'102', 'cord':'111111194412011111', 'affiliateAccount':'10005', 'masterAccount':'10005', 'type':'住培生[一阶段]', 'class':'学生班级', 'major':'内科', 'classify':'心内科'},
		        {'account':'', 'name':'小芳', 'sex':'女', 'studentNum':'', 'cord':'', 'affiliateAccount':'', 'masterAccount':'', 'type':'住培生[二阶段]', 'class':'', 'major':'外科', 'classify':'呼吸科'},
		        {'account':'', 'name':'', 'sex':'', 'studentNum':'', 'cord':'', 'affiliateAccount':'', 'masterAccount':'', 'type':'研究生[硕士]', 'class':'', 'major':'妇产科', 'classify':'妇科'},
		        {'account':'', 'name':'', 'sex':'', 'studentNum':'', 'cord':'', 'affiliateAccount':'', 'masterAccount':'', 'type':'研究生[博士]', 'class':'', 'major':'儿科', 'classify':'儿科疾病'},
		        {'account':'', 'name':'', 'sex':'', 'studentNum':'', 'cord':'', 'affiliateAccount':'', 'masterAccount':'', 'type':'医学生[本科]', 'class':'', 'major':'', 'classify':''},
		        {'account':'', 'name':'', 'sex':'', 'studentNum':'', 'cord':'', 'affiliateAccount':'', 'masterAccount':'', 'type':'医学生[博士]', 'class':'', 'major':'', 'classify':''},
		    ]
	    }
	},
	mounted() {
		console.log(StatisticsScore)
		this.resetStudentsForm = JSON.parse(JSON.stringify(this.studentsForm));
		this.uploadUrl = process.env.BASE_API+'/teachai/med/user/uploadStudentDetail.json'
		this.getData();
		teachersApi.selectPer().then(response=>{
			this.permissions = response.data.data.permissions;
		})
	},
  	methods: {
      	getData(){
      		this.loading = true;
      		studentsApi.list(this.params).then(response=>{
				this.tableData = response.data.data.user;
				this.pageTotla = response.data.data.pageTotla;
				this.loading = false;
			})
      	},
      	showStudentForm(type){
      		this.dialogVisibleStudents = true;
      		this.addOrEdit = type;
      	},
      	handleClick(tab, event) {
	        console.log(tab, event);
	    },
	    //选择管理科室
	    handleChange(val){	
	    	this.studentsForm.permissionId = val;
	    },
	    handleChangeClass(val){
	    	if (val.length == 1) {
	    		this.params.permissionId = val[0]
	    	}else if (val.length == 2) {
	    		this.params.permissionId = val[1]
	    	}else{
	    		this.params.permissionId = ''
	    	}
	    	this.params.page = 1;
	    	this.getData();
	    },
	    handleChangeSearchKey(val){
	    	this.params.searchKey = val;
	    	this.getData();
	    },
	    // 分页相关
	    handleSizeChange(val) {
	        console.log(`每页 ${val} 条`);
	    },
	    handleCurrentChange(val) {
	        //console.log(`当前页: ${val}`);
	        this.loading = true;
	        this.params.page = val;
	        this.getData();
	    },
      	addStudent(formName){
      		console.log(this.studentsForm)
      		if (this.studentsForm.permissionId != '') {
      			this.studentsForm.permissionId = JSON.stringify(this.studentsForm.permissionId);
      		}
      		this.$refs[formName].validate((valid) => {
                if (valid) {
                	this.btnLoading = true;
		      		studentsApi.addOrEdit(this.studentsForm).then(response=>{
		      			this.getData();
		      			this.$message({
				            type: 'success',
				            message: '编辑成功!'
				        });
						this.dialogVisibleStudents = false;
					})
                }
            })
      	},
      	editPassword(){
      		this.btnLoading = true;
      		if (this.passwordForm.password == '') {
      			this.$message({
		            type: 'warning',
		            message: '请输入密码!'
		        });
      		}else if(this.passwordForm.password.length <6){
      			this.$message({
		            type: 'warning',
		            message: '密码长度最少 6 个字符!'
		        });
      		}else{
      			studentsApi.updatePassword({password:this.passwordForm.password,userId:this.currentData.id}).then(response=>{
	      			this.getData();
	      			this.$message({
			            type: 'success',
			            message: '密码修改成功!'
			        });
					this.dialogVisibleStudents = false;
				})
      		}
      	},
      	edit(row,type){
      		this.dialogVisibleStudents = true;
      		this.currentData = row;
      		this.addOrEdit = type;
      		this.studentsForm={
	  			userId:this.currentData.id,
	    		userName:this.currentData.userName,
	    		sex:this.currentData.sex,
	    		accountName:this.currentData.name,
	    		password:'', 
	    		hospital:this.currentData.hospital,//医院
	    		studentNumber:this.currentData.studentNumber, //学号
	    		identity: this.currentData.identity, //学生类别
	    		identificationNumber:this.currentData.identificationNumber, //身份证号
	    		affiliateAccount:this.currentData.affiliateAccount, //附属账号
	    		mainAccount:this.currentData.mainAccount, //主账号
	    		grade:this.currentData.grade,//班级
	    		permissionId:JSON.parse(this.currentData.permissionId)//权限
	    	}
      	},
      	deleteStudent(row){
      		this.currentData = row;
      		this.$confirm('确定删除该账号?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	studentsApi.delete({
					userId:this.currentData.id
				}).then(response=>{
					this.$message({
			            type: 'success',
			            message: '删除成功!'
			        });
			        this.getData();
				})
	        })
      	},
      	lookStatistics(id){
      		this.userId = id;
  			//studentsApi.statisticalSampleByUserId({userId:id}).then(response=>{

  		// 		let statisticScore = echarts.init(this.$refs.statisticScore);
  		// 		let startTime = [];
  		// 		let scoreData = [];
  		// 		let chiefComplaintData = [];
  		// 		response.data.data.forEach(v=>{  
				//     if (v.chiefComplaint) {
    //                     chiefComplaintData.push(v.chiefComplaint)
    //                 }else{
    //                     chiefComplaintData.push('xx病例');
    //                 } 
    //                 startTime.push(v.startTime);
    //                 scoreData.push(v.score);
				// });
  				
  		// 		let option = {
    //                 tooltip: {
    //                     trigger: 'axis',
    //                     axisPointer: {
    //                         snap: true,
    //                         lineStyle: {
    //                             color: '#1790cf',
    //                             width: 2
    //                         }
    //                     },
    //                 },
    //                 xAxis:  {
    //                     type: 'category',
    //                     boundaryGap: false,
    //                     nameGap:20,
    //                     axisTick: {
    //                         show: false
    //                     },
    //                     splitArea : {
    //                         show : true,
    //                     },//保留网格区域
    //                     data: startTime.reverse(),
    //                     name:'学习时间',
    //                     splitLine:{
    //                         show:true
    //                     },
    //                     nameTextStyle: {
    //                         color: ['#0087ED'],
    //                         fontSize:'14',
    //                     },
    //                     axisLine:{
    //                         lineStyle:{
    //                             color:'#1790cf',
    //                             style:'solid',
    //                             width:'2'//坐标线的宽度
    //                         }
    //                     },
    //                     axisLabel: {
    //                         textStyle: {
    //                             color:'#333',
    //                             fontSize:'13',
    //                         }
    //                     }

    //                 },
    //                 yAxis: {
    //                     type: 'value',
    //                     name:'分数',
    //                     min:0,
    //                     max:100,
    //                     nameGap:30,
    //                     axisTick: {
    //                         show: false
    //                     },
    //                     splitArea : {
    //                         show : true,
        
    //                     },//保留网格区域
    //                     splitLine:{
    //                         show:true
    //                     },

    //                 },
    //                 dataZoom: [
    //                     {
    //                         type: 'inside',
    //                         start: 0,
    //                         end: 100
    //                     },
    //                     {
    //                         start: 0,
    //                         end: 100
    //                     }
    //                 ],
    //                 series: [
    //                     {
    //                         name:'本人成绩',
    //                         type:'line',
    //                         lineStyle:{
    //                             normal:{
    //                                 width:2,  //连线粗细
    //                                 color: "#f1797c"  //连线颜色
    //                             }
    //                         },
    //                         data:scoreData.reverse()
    //                     }
    //                 ]
    //             };
    //             statisticScore.setOption(option);
    //   			console.log(response.data)
				this.statisticsDialogVisible = true;
			//})

      	},
      	dialogClose(){
      		this.btnLoading = false;
      		this.$refs.form.resetFields();
      		this.studentsForm=this.resetStudentsForm;
	    	this.passwordForm.password = '';
	    	this.activeName = 'first';
      	},
      	beforeExcelUpload(file) {
	    	var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)				
			const extension = testmsg === 'xls'
			const extension2 = testmsg === 'xlsx'
	        const isLt2M = file.size / 1024 / 1024 < 2;

	        if (!extension && !extension2) {
	          this.$message.error('只能上传 Excel 文件!');
	        }
	        if (!isLt2M) {
	          this.$message.error('文件大小不能超过 2MB!');
	        }
	        return extension || extension2 && isLt2M;
	    },
      	handleExcelSuccess(res, file) {
	    	this.$message({
	            type: 'success',
	            message: '上传成功!'
	        });
	        this.getData();
	    },
	    //下载学生模板
	    downloadTemplate(){
	    	require.ensure([], () => {
		        const { export_json_to_excel } = require('@/vendor/Export2Excel');
		        const tHeader = ['登陆账号', '姓名', '性别', '学号', '身份证号', '附属账号', '主账号', '学生类别', '班级', '学科专业', '科室' ];
		        // 上面设置Excel的表格第一行的标题
		        const filterVal = ['account', 'name', 'sex', 'studentNum', 'cord', 'affiliateAccount', 'masterAccount', 'type', 'class', 'major', 'classify'];
		        // 上面的index、nickName、name是tableData里对象的属性
		        const list = this.studentTemplate;  //把data里的tableData存到list
		        const data = this.formatJson(filterVal, list);
		        export_json_to_excel(tHeader, data, 'students');
		    })
	    },
	    formatJson(filterVal, jsonData) {
	      return jsonData.map(v => filterVal.map(j => v[j]))
	    }
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
</style>