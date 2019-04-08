<template>
    <div class="login">
        <h1> {{ msg }}</h1>
        <div class="describe">
            <p style="font-size: 24px; font-weight: 400; margin-top: 10%;">致力于培养优秀临床思维人才</p>
            <p class="m-t-20">实现临床实践能力，加快人才培养，从“学生”走向<br>合格“医生”</p>
        </div>
        <div class="loginForm">
            <el-form :inline="true" :model="formInline" class="demo-form-inline pos-r">
              <el-form-item class="pos-a">
                <img src="../../assets/login/name.png" alt="" class="pos-a" >
                <input class="pos-a" v-model="formInline.userName" placeholder="用户名" style="left: 40px;">
              </el-form-item>
              <el-form-item class="pos-a" style="left:220px;">
                <img src="../../assets/login/mima.png" alt="" class="pos-a" style="left: 40px;">
                <input class="pos-a" v-model="formInline.password" placeholder="密码" style="left: 80px;">
              </el-form-item>
              <el-form-item class="pos-a" style="left:440px;">
                <img src="../../assets/login/yanzm.png" alt="" class="pos-a" style="left: 80px;">
                <input class="pos-a" v-model="formInline.code" placeholder="验证码" style="left: 120px;">
              </el-form-item>
              <el-form-item class="pos-a" style="left:780px;">
                <el-button class="m-l-20" type="primary" @click="onSubmit">登 陆</el-button>
              </el-form-item>
            </el-form>
        </div>
        <img class="pos-a" style="right: 0;bottom: 30px;z-index:-1" src="../../assets/login/hospital.jpg" alt="">
    
  </div>
</template>

<script>
export default {
    name: 'login',
    data () {
        return {
            msg: '人工智能临床医学教学辅助数据库',
            formInline: {
                userName: '',
                password: '',
                code:''
            }
        }
    },
    mounted() {

    },
    methods: {
        onSubmit() {
            this.$router.push({name:'case'})

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
    .el-button--primary {
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
