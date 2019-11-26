<template>

    <el-select v-model="value.difficultyDegree" placeholder="难度" size="small">
        <el-option label="0" value="0" ></el-option>
        <el-option label="1" value="1" ></el-option>
        <el-option label="2" value="2" ></el-option>
        <el-option label="3" value="3" ></el-option>
    </el-select>

</template>

<script>
import Vue from 'vue';
export default {
    name: 'difficult-set',

    props: {
        value: {
            type: Object,
        },
    },
    data () {
        return {
        }
    },
    mounted() {

    },
    methods: {
    },

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
