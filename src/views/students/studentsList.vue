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
    		<el-button type="primary" round class="floatRight" size="small" @click="showStudentForm('add')"><i class="el-icon-plus"></i> 添加用户</el-button>

    	</div>
    	<el-table :data="tableData" class="m-t-20" v-loading="loading">
    		<el-table-column
		      type="index"
		      label="序号"
		      width="50">
		    </el-table-column>
		    <el-table-column prop="id" label="Id" width="120">
		    </el-table-column>
		    <el-table-column prop="userName" label="姓名" width="100">
		    </el-table-column>
	        <el-table-column prop="sex" label="性别" width="100"> 
	        </el-table-column>
			<el-table-column prop="name" label="账号">
	        </el-table-column>
	        <!-- <el-table-column prop="password" label="密码">
	        </el-table-column> -->
	        <el-table-column prop="hospital" label="医院">
	        </el-table-column>
			<el-table-column prop="grade" label="班级">
	        </el-table-column>
	        <el-table-column label="操作" width="100">
		      <template slot-scope="scope">
		      	<el-button
		      	  title="编辑"
		          type="text" @click="edit(scope.row,'edit')"><i class="el-icon-edit"></i></el-button>
		        <el-button
		      	  title="删除"
		          type="text" @click="deleteStudent(scope.row)"><i class="el-icon-delete"></i></el-button>
		      </template>
		    </el-table-column>
		</el-table>

		<!-- 添加用户弹出框 -->
		<el-dialog
		  title="编辑学生信息"
		  :visible.sync="dialogVisibleStudents"
		  width="400px"
		  @close="dialogClose"
		  :close-on-click-modal="false"
		  >
		    <el-tabs v-model="activeName">
			    <el-tab-pane label="基本信息" name="first" @tab-click="handleClick">
					<el-form label-width="60px" :model="studentsForm">
				  		<el-form-item label="姓名">
							<el-input v-model="studentsForm.name" placeholder="请输入姓名" size="small"></el-input> 
						</el-form-item>
						<el-form-item label="性别">
						    <el-radio-group v-model="studentsForm.sex">
						      <el-radio label="男">男</el-radio>
						      <el-radio label="女">女</el-radio>
						    </el-radio-group>
						</el-form-item>
						<el-form-item label="账号">
						    <el-input v-model="studentsForm.account" placeholder="请输入账号" size="small"></el-input> 
						</el-form-item>
						<el-form-item label="密码" v-if="addOrEdit == 'add'">
						    <el-input v-model="studentsForm.password" placeholder="请输入密码" size="small"></el-input> 
						</el-form-item>
						<el-form-item label="医院">
						    <el-input v-model="studentsForm.hospital" placeholder="请输入医院" size="small"></el-input> 
						</el-form-item>
						<el-form-item label="班级">
						    <el-input v-model="studentsForm.grade" placeholder="请输入班级" size="small"></el-input> 
						</el-form-item>
					</el-form>
					
			    </el-tab-pane>
			    <el-tab-pane label="修改密码" name="second" v-if="addOrEdit == 'edit'">
					<el-form label-width="60px" :model="passwordForm">
				  		<el-form-item label="密码">
							<el-input v-model="passwordForm.password" placeholder="请输入密码" size="small"></el-input> 
						</el-form-item>
					</el-form>
			    </el-tab-pane>
		    </el-tabs>
		    <span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisibleStudents = false">取 消</el-button>
			    <el-button type="primary" @click="editPassword" v-if="activeName == 'second'">确 定</el-button :loading="btnLoading">
			    <el-button type="primary" @click="addStudent" v-else :loading="btnLoading">确 定</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
import {studentsApi} from '@/services/apis/students/students'
export default {
	name: 'students',
	data () {
	    return {
	    	loading:true,
	    	btnLoading: false,
	    	tableData:[],
	    	dialogVisibleStudents:false,
	    	studentsForm:{
	    		id:'',
	    		name:'',
	    		sex:'男',
	    		account:'',
	    		password:'', 
	    		hospital:'',//医院
	    		grade:''//班级
	    	},
	    	passwordForm:{ //修改密码
	    		password:'',
	    	},
	    	addOrEdit:'',  //新增还是编辑
	    	currentData:'', //当前操作对象
	    	uploadUrl:'',
	    	activeName: 'first'
	    }
	},
	mounted() {
		this.uploadUrl = process.env.BASE_API+'/teachai/med/user/uploadStudentDetail.json'
		this.getData();
	},
  	methods: {
      	getData(){
      		studentsApi.list().then(response=>{
				this.tableData = response.data.data;
				this.loading = false;
			})
      	},
      	showStudentForm(type){
      		this.dialogVisibleStudents = true;
      		this.addOrEdit = type;
      	},
      	setData(data){
      		let param = {
      			userId:data.id,
      			accountName: data.account,
      			userName: data.name,
      			sex: data.sex,
      			phone: data.account,
      			password: data.password,
      			hospitalName: data.hospital,
      			grade: data.grade,
      			identificationNumber:'',
      			identity:'',
      		}
      		return param;
      	},
      	handleClick(tab, event) {
	        console.log(tab, event);
	    },
      	addStudent(){
      		this.btnLoading = true;
      		studentsApi.addOrEdit(this.setData(this.studentsForm)).then(response=>{
      			this.getData();
      			this.$message({
		            type: 'success',
		            message: '编辑成功!'
		        });
				this.dialogVisibleStudents = false;
			})
      	},
      	editPassword(){
      		this.btnLoading = true;
      		if (this.passwordForm.password == '') {
      			this.$message({
		            type: 'warning',
		            message: '请输入密码!'
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
	  			id:this.currentData.id,
	    		name:this.currentData.userName,
	    		sex:this.currentData.sex,
	    		account:this.currentData.name,
	    		password:'', 
	    		hospital:this.currentData.hospital,//医院
	    		grade:this.currentData.grade//班级
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
      	dialogClose(){
      		this.btnLoading = false;
      		this.studentsForm={
	    		name:'',
	    		sex:'男',
	    		account:'',
	    		password:'', 
	    		hospital:'',//医院
	    		grade:''//班级
	    	},
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
</style>