<template>
  <div id="app">
    
    <router-view/>
  </div>
</template>

<script>
import {ywd} from '@/services/apis/ywd';
export default {
    name: 'App',
    data () {

        return {
            
        }
    },
    mounted() {
        // let param = {
        //     token:true,
        // }
        // ywd.getToken(param).then(response=>{
        //     localStorage.setItem('token',response.data.result);
        // })
    },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-width: 1200px;
  color: #2c3e50;

}
</style>
