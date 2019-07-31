<template>
    <div class="teacher">
    	
    	<div class="clearfix">
    		<p class="floatLeft"><i class="el-icon-location-outline"></i> 教师列表 </p>
    		<!-- <el-button type="primary" round class="floatRight m-l-10" size="small"><i class="el-icon-upload2"></i> 批量导入</el-button> -->
    		<!-- <el-upload
		      ref="upload"
			  class="upload-demo floatRight m-l-10"
			  :action="uploadUrl"
			  :multiple="false"
			  :before-upload="beforeExcelUpload"
			  :on-success="handleExcelSuccess">
			  <el-button slot="trigger" round size="small" type="primary"><i class="el-icon-upload2"></i> 批量导入</el-button>
			</el-upload> -->
    		<el-button type="primary" round class="floatRight" size="small" @click="showTeacherForm('add')"><i class="el-icon-plus"></i> 添加用户</el-button>

    	</div>
    	<el-table :data="tableData" class="m-t-20" v-loading="loading">
    		<el-table-column
		      type="index"
		      label="序号"
		      width="50">
		    </el-table-column>
		    <el-table-column prop="teacherName" label="账号" width="120">
	        </el-table-column>
		    <el-table-column prop="name" label="姓名" width="100">
		    </el-table-column>
	        <el-table-column prop="sex" label="性别" width="100"> 
	        </el-table-column>
	        <el-table-column label="管理科室">
	        	<template slot-scope="scope">
	        		<!-- {{scope.row.permissionId}} -->
	        		<el-cascader      
	        			disabled
				        style="width: 100%"
				        size="small"
					    :options="permissions"
					    :props="props"
					    :value="JSON.parse(scope.row.permissionId)"
					    clearable>
					</el-cascader>
				</template>
	        </el-table-column>
	        <el-table-column label="操作" width="100">
		      <template slot-scope="scope">
		      	<el-button
		      	  title="编辑"
		          type="text" @click="edit(scope.row,'edit')"><i class="el-icon-edit"></i></el-button>
		        <el-button
		      	  title="删除"
		          type="text" @click="deleteTeacher(scope.row)"><i class="el-icon-delete"></i></el-button>
		      </template>
		    </el-table-column>
		</el-table>

		<!-- 添加用户弹出框 -->
		<el-dialog
		  title="编辑教师信息"
		  :visible.sync="dialogVisibleStudents"
		  width="400px"
		  @close="dialogClose"
		  :close-on-click-modal="false"
		  >
		    <el-tabs v-model="activeName">
			    <el-tab-pane label="基本信息" name="first" @tab-click="handleClick">
					<el-form label-width="80px" :model="teachersForm">
				  		<el-form-item label="姓名">
							<el-input v-model="teachersForm.name" placeholder="请输入姓名" size="small"></el-input> 
						</el-form-item>
						<el-form-item label="性别">
						    <el-radio-group v-model="teachersForm.sex">
						      <el-radio label="男">男</el-radio>
						      <el-radio label="女">女</el-radio>
						    </el-radio-group>
						</el-form-item>
						<el-form-item label="账号">
						    <el-input v-model="teachersForm.teacherName" placeholder="请输入账号" size="small"></el-input> 
						</el-form-item>
						<el-form-item label="密码" v-if="addOrEdit == 'add'">
						    <el-input type="password" v-model="teachersForm.teacherPassword" placeholder="请输入密码" size="small"></el-input> 
						</el-form-item>
						<el-form-item label="管理科室">
						    <el-cascader

						        style="width: 280px"
						        size="small"
							    :options="permissions"
							    :props="props"
							    :value="teachersForm.permissionId"
							    @change="handleChange"
							    clearable>
							</el-cascader>
						</el-form-item>
					</el-form>
					
			    </el-tab-pane>
			    <el-tab-pane label="重置密码" name="second" v-if="addOrEdit == 'edit'">
					<el-form label-width="60px" :model="passwordForm">
				  		<el-form-item label="密码">
							<el-input type="password" v-model="passwordForm.teacherPassword" placeholder="请输入密码" size="small"></el-input> 
						</el-form-item>
					</el-form>
			    </el-tab-pane>
		    </el-tabs>
		    <span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisibleStudents = false">取 消</el-button>
			    <el-button type="primary" @click="editPassword" v-if="activeName == 'second'">确 定</el-button :loading="btnLoading">
			    <el-button type="primary" @click="addTeacher" v-else :loading="btnLoading">确 定</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
import {studentsApi} from '@/services/apis/students/students'
import {teachersApi} from '@/services/apis/teachers/teachers'
export default {
	name: 'teacher',
	data () {
	    return {
	    	loading:true,
	    	btnLoading: false,
	    	tableData:[],
	    	props: { 
	    		multiple: true,
	    		value:"diseaseType",
	    		label:"permissionName",
	    		children:"teacherPermissionVOChilds"
	    	},
	    	permissions: [], //权限列表
	    	dialogVisibleStudents:false,
	    	teachersForm:{
	    		id:'',
	    		name:'',
	    		sex:'男',
	    		teacherName:'',
	    		teacherPassword:'', 
	    		permissionId:[]//权限
	    	},
	    	passwordForm:{ //修改密码
	    		teacherPassword:'',
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
		teachersApi.selectPer().then(response=>{
			this.permissions = response.data.data.permissions;
	
		})
	},
  	methods: {
      	getData(){
			teachersApi.list().then(response=>{
				this.tableData = response.data.data;
				this.loading = false;
			})
      	},
      	showTeacherForm(type){
      		this.dialogVisibleStudents = true;
      		this.addOrEdit = type;
      	},
      	setData(data){
      		let param = {
      			//userId:data.id,
      			name: data.name,
      			teacherName: data.userName,
      			sex: data.sex,
      			teacherPassword: data.password,
      		}
      		return param;
      	},
      	handleClick(tab, event) {
	        console.log(tab, event);
	    },
	    //选择管理科室
	    handleChange(val){	
	    	this.teachersForm.permissionId = val;
	    },
      	addTeacher(){
      		this.btnLoading = true;
      		this.teachersForm.permissionId = JSON.stringify(this.teachersForm.permissionId) || ""
      		teachersApi.addOrEdit(this.teachersForm).then(response=>{
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
      		if (this.passwordForm.teacherPassword == '') {
      			this.$message({
		            type: 'warning',
		            message: '请输入密码!'
		        });
      		}else{
      			teachersApi.updatePassword({password:this.passwordForm.teacherPassword,userId:this.currentData.id,type:"2"}).then(response=>{
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
      		this.teachersForm={
	  			id:this.currentData.id,
	    		name:this.currentData.name,
	    		sex:this.currentData.sex,
	    		teacherName:this.currentData.teacherName,
	    		teacherPassword:'', 
	    		permissionId:JSON.parse(this.currentData.permissionId)
	    	}
      	},
      	deleteTeacher(row){
      		this.currentData = row;
      		this.$confirm('确定删除该账号?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	teachersApi.delete({
					id:this.currentData.id
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
      		this.teachersForm={
	    		name:'',
	    		sex:'男',
	    		teacherName:'',
	    		teacherPassword:'', 
	    		permissionId:[]//权限
	    	},
	    	this.passwordForm.teacherPassword = '';
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