<template>
    <div class="frame">
    
        <el-container class="mainFrame" >
            <el-header>
                <h1 style="font-size: 20px;line-height: 60px;" class="floatLeft title">
                北京大学第三医院人工智能临床医学教学辅助数据库管理平台</h1>
                <el-dropdown class="floatRight" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{name}} ({{roleName}})<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="my">个人中心</el-dropdown-item>
                        <el-dropdown-item command="loginOut">退出</el-dropdown-item>
                
                    </el-dropdown-menu>
                </el-dropdown>
                
            </el-header>
            <el-container>
                <el-aside width="180px">

                    <el-menu
                      :default-active="setMenuActive($route.path)"
                      @select="handleSelect"
                      class="el-menu-vertical-demo"
                      >
                      <el-menu-item v-for="item in menuItem" :key="item.url" :index="item.url" v-if="item.role.indexOf(roleName) > -1">
                        <img :src="item.icon" alt="" class="m-r-10">
                        <span slot="title">{{item.name}}</span>
                      </el-menu-item>
                      <!-- <el-menu-item index="/list">
                        <img src="../assets/icon03.png" alt="" class="m-r-10">
                        <span slot="title">虚拟病例</span>
                      </el-menu-item>
                      <el-menu-item index="/problem">
                        <img src="../assets/icon02.png" alt="" class="m-r-10">
                        <span slot="title">标准提问库</span>
                      </el-menu-item>
                      <el-menu-item index="/mapTable">
                        <img src="../assets/icon04.png" alt="" class="m-r-10">
                        <span slot="title">问题分类表</span>
                      </el-menu-item>
                      <el-menu-item index="/students">
                        <img src="../assets/icon04.png" alt="" class="m-r-10">
                        <span slot="title">学生管理</span>
                      </el-menu-item>
                      <el-menu-item index="/teacher">
                        <img src="../assets/icon04.png" alt="" class="m-r-10">
                        <span slot="title">教师管理</span>
                      </el-menu-item> -->
                      <!-- <el-menu-item index="6">
                        <i class="el-icon-document"></i>
                        <span slot="title">操作日志</span>
                      </el-menu-item> -->
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'frame',
    data () {

        return {
            name:'',
            roleName:'管理员', //角色
            menuItem:[{
                name:'疾病分类',
                url:'/case',
                icon:require('../assets/icon04.png'),
                role:['教师','管理员'],
            },{
                name:'虚拟病例',
                url:'/list',
                icon:require('../assets/icon03.png'),
                role:['教师','管理员'],
            },{
                name:'标准提问库',
                url:'/problem',
                icon:require('../assets/icon02.png'),
                role:['管理员'],
            },{
                name:'问题分类表',
                url:'/mapTable',
                icon:require('../assets/icon05.png'),
                role:['管理员'],
            },{
                name:'学生管理',
                url:'/students',
                icon:require('../assets/icon07.png'),
                role:['教师','管理员'],
            },{
                name:'教师管理',
                url:'/teacher',
                icon:require('../assets/icon06.png'),
                role:['管理员'],
            },{
                name:'统计',
                url:'/stat',
                icon:require('../assets/icon01.png'),
                role:['教师','管理员'],
            }]
        }
    },
    mounted() {
        this.name = JSON.parse(localStorage.getItem("uerInfo")).name;
        this.roleName = JSON.parse(localStorage.getItem("uerInfo")).role.roleName;
    },
    methods:{
        handleSelect(key, keyPath) {
            this.$router.push({path:key})
        },
        //设置菜单栏选中状态
        setMenuActive(path) {
            return path;
        },
        handleCommand(command) {
            if (command == 'loginOut') {
                localStorage.removeItem("uerId");
                localStorage.removeItem("uerInfo");
                this.$router.push({
                    name:'login'
                })
            }else if(command == 'my'){
                this.$router.push({
                    name:'my'
                })
            }else{}
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.frame{
    .mainFrame{
        height: 100vh;
        .el-container{
            height: calc(100% - 60px);
            height:-moz-calc(100% - 60px); 
            height:-webkit-calc(100% - 60px); 
            height: calc(100% - 60px);
            .el-main {
                color: #333;
                height: 100%;
            }
        }
    }
    .el-header{
        background-color: #f0f0f0;
        color: #333;
        .el-dropdown{
            height: 60px;
            line-height: 60px;
            cursor: pointer;
        }
        .title{
            font-weight: 400;
            background: url(../assets/bysylogo.png) no-repeat center left;

            padding-left: 40px;
        }
    }
      
    .el-aside {
        background-color: #1B4ABE;
        color: #333;
        .el-menu{
            background: none;
            border: none;
            .el-menu-item{
                color: #fff;
                i{
                    color: #fff;
                }
            }
            .el-menu-item:hover,
            .el-menu-item.is-active{
                background: rgba(255,255,255,.2);
            }

        }
    }
      
    
    
}
</style>
