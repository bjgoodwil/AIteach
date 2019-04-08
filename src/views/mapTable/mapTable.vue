<template>
    <div class="mapTable">

    	<el-tree 
    		:data="dataTree" 
    		:props="defaultProps" 
    		node-key="id" 
    		:expand-on-click-node="false"
    		@node-click="handleNodeClick">
			
			<span class="custom-tree-node" slot-scope="{ node, data }">
		        <span>{{ node.label }}</span>
		        <span v-if="data.parentId==0">
					<el-button

		                class="m-l-10"
			            type="text"
			            size="mini"
			            @click="() => add(data)">
			            新增
			        </el-button>
		        </span>
		        <span v-if="data.parms">
		            {{data.parms[0].questionName}}
		            
		            <el-button
		                class="m-l-10"
			            type="text"
			            size="mini"
			            @click="() => edit(data)">
			            修改
			        </el-button>
			        <el-button
			            type="text"
			            size="mini"
			            @click="() => remove(node, data)">
			            删除
			        </el-button>
		        </span>
		    </span>
    	</el-tree>
    </div>
</template>
<script>
import {question} from '@/services/apis/question/question'
export default {
	name: 'mapTable',
	data () {

	    return {
	    	dataTree:[],
	    	defaultProps:{
	    		children: 'children',
          		label: 'name'
	    	},
	    	msg:0
	    }
	},
	mounted() {
		question.getModelList().then(response=>{
  			console.log(response.data.data)
            this.dataTree = response.data.data.trees;
        });
	},
  	methods: {
        handleNodeClick(){},
        add(data){
	    	if (!data.children) {
	            this.$set(data, 'children', []);
	        }
    		data.children.push({
	    		id: 1111111,
				diseaseNum: 1,
				medicalRecordNum: 0,
				name: "test",
				parentId: "14912",
				parms:[{questionName: "住院入院记录_主诉_症状_症状名称"}]
	    	})
	    },   
	    remove(node, data) {
	        const parent = node.parent;
	        const children = parent.data.children || parent.data;
	        const index = children.findIndex(d => d.id === data.id);
	        children.splice(index, 1);
	    },
	    edit(data){

	    },
	    add(data){
	    	if (!data.children) {
	            this.$set(data, 'children', []);
	        }
    		data.children.push({
	    		id: 1111111,
				diseaseNum: 1,
				medicalRecordNum: 0,
				name: "test",
				parentId: "14912",
				parms:[{questionName: "住院入院记录_主诉_症状_症状名称"}]
	    	})
	    }    	
    },
    watch:{
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
</style>