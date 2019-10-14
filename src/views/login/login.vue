<template>
    <div class="login">
        <h1> {{ msg }}</h1>
        <div class="describe">
            <p style="font-size: 24px; font-weight: 400; margin-top: 10%;">致力于培养优秀临床思维人才</p>
            <p class="m-t-20">实现临床实践能力，加快人才培养，从“学生”走向<br>合格“医生”</p>
            <el-button type="primary" plain class="m-t-20" @click="toStudy">去 学 习 <i class="el-icon-arrow-right"></i></el-button>
        </div>
        <div class="loginForm">
            <el-form :inline="true" :model="formInline" class="demo-form-inline pos-r">
              <el-form-item class="pos-a">
                <img src="../../assets/login/name.png" alt="" class="pos-a" >
                <input class="pos-a" v-model="formInline.userName" placeholder="用户名" style="left: 40px;">
              </el-form-item>
              <el-form-item class="pos-a" style="left:220px;">
                <img src="../../assets/login/mima.png" alt="" class="pos-a" style="left: 40px;">
                <input type="password" class="pos-a" v-model="formInline.password" placeholder="密码" style="left: 80px;" @keyup.enter.native="onSubmit">
              </el-form-item>
              <el-form-item class="pos-a" style="left:440px;">
                <img src="../../assets/login/yanzm.png" alt="" class="pos-a" style="left: 80px;">
                <img :src="codeUrl" alt="" class="pos-a" @click="getCode" style="left: 210px; z-index: 9">
                <input class="pos-a" v-model="formInline.captchaCode" placeholder="验证码" style="left: 120px;"  @keyup.enter="onSubmit">
              </el-form-item>
              <el-form-item class="pos-a" style="left:780px;">
                <el-button class="m-l-20" type="success" @click="onSubmit" >登 陆</el-button>
              </el-form-item>
            </el-form>
        </div>
        <img class="pos-a" style="right: 0;bottom: 30px;z-index:-1" src="../../assets/login/hospital.jpg" alt="">
    
  </div>
</template>

<script>
import {loginApi} from '@/services/apis/login/login';
export default {
    name: 'login',
    data () {
        return {
            msg: '人工智能临床医学教学辅助数据库',
            codeUrl:'', //图形验证码
            formInline: {
                userName: '',
                password: '',
                captchaCode:''
            }
        }
    },
    created() {
        // let that = this;
        // document.onkeypress = function(e) {
        //   var keycode = document.all ? event.keyCode : e.which;
        //   if (keycode == 13) {
        //     that.onSubmit();// 登录方法名
        //      return false;
        //   }
        // };
    },
    mounted() {
        this.getCode();

    },
    methods: {
        onSubmit() {
            if (this.formInline.userName == '' || this.formInline.password == '') {
                this.$message({
                    message: '请输入账号和密码',
                    type: 'warning'
                });
            }else if (this.formInline.captchaCode == '') {
                this.$message({
                    message: '请输入验证码',
                    type: 'warning'
                });
            }else{
                let param = {
                    userName: this.formInline.userName,
                    password: this.formInline.password,
                    captchaCode: this.formInline.captchaCode.toUpperCase()
                }
                loginApi.login(param).then(response=>{
                    if (response.data.errCode == '0') {
                        this.$message({
                            message: "登陆成功",
                            type: 'success'
                        });
                        localStorage.setItem("uerId", response.data.data.userId);
                        localStorage.setItem("uerInfo", JSON.stringify(response.data.data));
                        this.$router.push({path:this.$route.query.redirect || '/'})
                    }else{
                        this.$message({
                            message: response.data.errMsg,
                            type: 'error'
                        });
                    }
                    
                })
            }
            
        },
        getCode(){
            loginApi.getCode().then(response=>{
                this.codeUrl = "data:image/png;base64,"+response.data.data.codePic;
            })
        },
        //去往学习端
        toStudy(){
            window.open(process.env.BASE_API+"/study")
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.login{
    position: relative;
    background: url(../../assets/login/bg.jpg) no-repeat;
    background-position: top right;
    background-size: 35%;
    min-height: 100vh;
    .loginForm{
        background: #5B88FF;
        width: 900px;
        height: 60px;
        margin: 8% auto 0 auto;
        border-radius: 50px;
        padding: 30px 50px 10px 50px;

        
    }
    h1{
        font-weight: normal;
        font-size: 18px;
        padding-left: 40px;
        height: 60px;
        line-height: 60px;
        margin-left: 20px;
        background: url(../../assets/logo.png) no-repeat center left;
    }
    .describe{
        width: 1000px;
        margin: 0 auto;
    }
    .el-button--success {
        color: #5B88FF;
        background-color: #fff; 
        border-color: #fff; 
        border-radius: 20px;
        width: 100px;
    }

}
.el-form-item{
    .el-form-item__content{
        input{
            height: 34px;
            padding-left: 10px; 
            background:none;
            border: none;
            color: #fff;
            border-bottom: 1px solid #ccc;
        }
        
        img{
            top: 5px;
        }
    }
}
.el-input__inner {
    background:none;
    border: 2px red solid;
}
::-webkit-input-placeholder { /* WebKit browsers */
  color: #fff;

}

::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #fff;

}

:-ms-input-placeholder { /* Internet Explorer 10+ */
  color: #fff;

} 
</style>
