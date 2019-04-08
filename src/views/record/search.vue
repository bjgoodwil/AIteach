<template>
    <div class="search">
    	
    	<iframe ref="iframe" :src="src" id="mobsf" frameborder="0" style="width: 100%;height: 100vh;"></iframe>
    
    </div>
</template>
<script>

export default {
	name: 'search',
	data () {

	    return {
	    	src:'',
	        data:'123',
	        
	    }
	},
	mounted() {

		//三院地址：http://192.168.132.13:8804
		//本地地址：http://192.168.8.20
		this.src = process.env.HOST+"search/bysy/advanced.html?from=AI&disease="+this.$route.query.disease+"&diseaseId="+this.$route.query.diseaseId+"&host="+this.$route.query.host

	},
  	methods: {
      	test(){
      		console.log("成功")
      	}
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>