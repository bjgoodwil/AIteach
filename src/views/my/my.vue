<template>
    <div class="login">
        <p style="height: 32px;"><i class="el-icon-location-outline"></i> 个人中心 </p>
        <!-- <div>
            <p><label for="">角色：</label>超级管理员</p>
            <p><label for="">用户名：</label>admin</p>
            <p><label for="">账号：</label>admin</p>
            <p><label for="">管理科室：</label>全部</p>
        </div> -->
        <el-form ref="form" :model="formUser" label-width="100px">
            <el-form-item label="角色：">
                {{formUser.role}}
            </el-form-item>
            <el-form-item label="用户名：">
                {{formUser.name}}
            </el-form-item>
            <el-form-item label="账号：">
                {{formUser.userName}}  &nbsp;&nbsp;&nbsp;&nbsp;<el-button type="text">修改密码</el-button>
            </el-form-item>
            <el-form-item label="管理科室：">
                <span v-for="item in formUser.classify">{{item}}</span>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'my',
    data () {
        return {
            formUser: {
                role: '超级管理员',
                name: 'amdin',
                userName:'admin',
                classify:['全部']
            }
        }
    },
    mounted() {
        let userInfo = JSON.parse(localStorage.getItem("uerInfo"));
        this.formUser.role = userInfo.role.roleName;
        this.formUser.name = userInfo.name;
        this.formUser.userName = userInfo.userName;
    },
    methods: {
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
