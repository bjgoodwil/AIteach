<template>
    <div class="login" v-loading="loading">
        <p style="height: 32px;"><i class="el-icon-location-outline"></i> 个人中心 </p>
        <el-card class="box-card">
            
            <div class="text item">
                <el-form ref="form" :model="formUser" label-width="100px">
                    <el-form-item label="角色：">
                        {{formUser.role}}
                    </el-form-item>
                    <el-form-item label="用户名：">
                        {{formUser.name}}
                    </el-form-item>
                    <el-form-item label="账号：">
                        {{formUser.userName}}  &nbsp;&nbsp;&nbsp;&nbsp;<el-button type="text" @click="dialogFormVisible = true">修改密码</el-button>
                    </el-form-item>
                    <el-form-item label="管理科室：">
                        <span v-if="formUser.role == '管理员'">全部科室</span>
                        <el-cascader      
                            disabled
                            v-else
                            size="small"
                            style="width: 200px"
                            :options="permissions"
                            :props="props"
                            :value="formUser.permissionId"
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        

        <el-dialog 
          title="修改密码" 
          :visible.sync="dialogFormVisible"
          width="400px"
          @close="dialogClose">
          <el-form :model="passwordForm" label-width="80px" :rules="rules" ref="passwordForm">
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input type="password" size="small" v-model="passwordForm.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input type="password" size="small" v-model="passwordForm.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="surePasswowrd">
              <el-input type="password" size="small" v-model="passwordForm.surePasswowrd"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="sure('passwordForm')">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import {teachersApi} from '@/services/apis/teachers/teachers'
export default {
    name: 'my',
    data () {
        return {
            loading:true,
            dialogFormVisible:false,
            formUser: {
                userId:'',
                role: '超级管理员',
                name: 'amdin',
                userName:'admin',
                permissionId:[]
            },
            passwordForm:{
                oldPassword:'',
                newPassword:'',
                surepasswowrd:'',
            },
            props: { 
                multiple: true,
                value:"diseaseType",
                label:"permissionName",
                children:"teacherPermissionVOChilds"
            },
            permissions:[], //权限
            rules: {
                oldPassword: [
                    { required: true, message: '请输入旧密码', trigger: 'change' }
                ],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'change' }
                ],
                surePasswowrd: [
                    { required: true, message: '请确认新密码', trigger: 'change' }
                ],
            }
        }
    },
    mounted() {
        teachersApi.selectPer().then(response=>{
            this.permissions = response.data.data.permissions;
            this.loading = false;
        })
        let userInfo = JSON.parse(localStorage.getItem("uerInfo"));
        this.formUser.userId = userInfo.userId;
        this.formUser.role = userInfo.role.roleName;
        this.formUser.name = userInfo.name;
        this.formUser.userName = userInfo.userName;
        if (userInfo.permissionId != '') {
            this.formUser.permissionId = JSON.parse(userInfo.permissionId);
        }
    },
    methods: {
        //选择管理科室
        handleChange(val){  
            this.formUser.permissionId = val;
        },
        dialogClose(){
            this.passwordForm = {
                oldPassword:'',
                newPassword:'',
                surePasswowrd:'',
            }
        },
        sure(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.passwordForm.newPassword == this.passwordForm.surePasswowrd) {
                        teachersApi.updatePassword({userId:this.formUser.userId,password:this.passwordForm.newPassword,oldPassword:this.passwordForm.oldPassword}).then(response=>{
                            if (response.data.errCode != '0') {
                                this.$message({
                                    type: 'error',
                                    message: response.data.errMsg + '('+response.data.data+')'
                                });
                            }else{
                                this.$message({
                                    type: 'success',
                                    message: '密码修改成功!'
                                });
                                this.dialogFormVisible = false;
                            }
                        })
                    }else{
                        this.$message({
                            type: 'warning',
                            message: '两次输入的密码不一致!'
                        });
                    }
                } else {
                    return false;
                }
            }); 
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
