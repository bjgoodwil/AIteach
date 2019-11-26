<template>
    <div class="pagination">
        <el-pagination
          class="textRight"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageParams.page"
          :page-size="pageParams.count"
          layout="total, prev, pager, next"
          :total="pageTotla">
        </el-pagination>
    </div>
</template>

<script>
import Vue from 'vue';

export default {
    name: 'page-pagination',
    props: {
        pageParams: {     //当前页码
            type: Object,
            default:function () {
                return {}
            }
        },
        pageTotla: {
            type: Number,
            default: null  //总条数,
        },
        getdataFunction: {
            type: Function,
            default: function () {
                return {}
            }
        }
    },
    data () {
        return {

        }
    },
    mounted() {

    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            //console.log(`当前页: ${val}`);
            this.page = val;
            this.getdataFunction();
        },
    },
    watch: {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.hello{
  h1{
    font-weight: normal;
    font-size: 34px;
  }
}
</style>
