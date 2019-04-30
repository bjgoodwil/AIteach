<template>
    <div class="frame">
    
        <el-container class="mainFrame" >
            <el-header>
                <h1 style="font-size: 20px;line-height: 60px;" class="floatLeft title">
                人工智能临床医学教学辅助数据库管理平台</h1>
                <el-dropdown trigger="click" class="floatRight">
                  <span class="el-dropdown-link">
                    admin<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人中心</el-dropdown-item>
                    <el-dropdown-item>退出</el-dropdown-item>
            
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
                      <el-menu-item index="/case">
                        <i class="el-icon-menu"></i>
                        <span slot="title">疾病分类</span>
                      </el-menu-item>
                      <el-menu-item index="/mapTable">
                        <i class="el-icon-document"></i>
                        <span slot="title">问题分类表</span>
                      </el-menu-item>
                      <el-menu-item index="/problem">
                        <i class="el-icon-document"></i>
                        <span slot="title">标准提问库</span>
                      </el-menu-item>
                      <el-menu-item index="/list">
                        <i class="el-icon-tickets"></i>
                        <span slot="title">虚拟病例</span>
                      </el-menu-item>
                      <!-- <el-menu-item index="5">
                        <i class="el-icon-menu"></i>
                        <span slot="title">统计</span>
                      </el-menu-item>
                      <el-menu-item index="6">
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
            
        }
    },
    methods:{
        handleSelect(key, keyPath) {
           
            this.$router.push({path:key})
        },
        //设置菜单栏选中状态
        setMenuActive(path) {
            
            return path;
            
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
            background: url(../assets/logo.png) no-repeat center left;
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
