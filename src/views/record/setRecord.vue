<template>
    <div class="setRecord" v-loading="loading">
    	<el-breadcrumb separator-class="el-icon-arrow-right">
		    <el-breadcrumb-item to="/list">虚拟病例</el-breadcrumb-item>
		    <el-breadcrumb-item>结构化病例</el-breadcrumb-item>
		</el-breadcrumb>
		<el-form :inline="true" :model="formInline" class="m-t-20" label-width="80px">
			
			<el-form-item label="性别：">
			    {{formInline.gender}}
			</el-form-item>
			<el-form-item label="年龄：">
				
			    {{formInline.age}}
			</el-form-item> &nbsp;&nbsp;
			<el-button type="primary" round size="small" @click="open">查看病历详情</el-button> <el-button type="primary" round size="small" @click="openImg">查看影像</el-button><br>
			<el-form-item label="参考时间">
			    <el-input type="number" v-model="formInline.time" placeholder="时间"  style="width: 200px">
					<template slot="append">分钟</template>
			    </el-input>
			</el-form-item>
			<el-form-item label="病历难度">
			    <el-select v-model="formInline.grade" placeholder="活动区域" @change="change" style="width: 200px">
			      	<el-option label="初级" value="0" ></el-option>
			      	<el-option label="中级" value="1" ></el-option>
			      	<el-option label="高级" value="2" ></el-option>
			    </el-select>
			</el-form-item>
			<el-form-item label="疾病">
			    <el-input v-model="formInline.disease" placeholder="疾病" :disabled="true"></el-input>
			</el-form-item>
			<el-form-item label="症状">
			    <el-input v-model="formInline.symptoms" placeholder="症状"></el-input>
			</el-form-item>
			<el-form-item label="主诉">
			    <el-input v-model="formInline.chiefComplaint" placeholder="主诉" style="width: 496px"></el-input>
			</el-form-item>			
		</el-form>
		<el-alert
		    title="评分范围：-1减分项，0分为干扰项，1-5分为得分项"
		    type="error"
		    :closable="false">
		</el-alert>
		<el-tabs v-model="activeName" @tab-click="tabClick1">
		    <el-tab-pane v-for="item in data" :key="item.id" :label="item.name" :name="item.name">
				<el-tabs tab-position="left" v-model="activeClass" @tab-click="tabClick2">
					<el-tab-pane v-for="(it,eq) in item.children" :key="it.id" :label="it.name+'('+it.parms.length+')'" :name="it.name">
						<!-- {{it.parms}} -->
						<table style="width: 100%;">
							<thead>
								<th style="width: 8%">序号</th>
								<th style="width: 36%">{{it.name}}</th>
								<th style="width: 36%">答案</th>
								<th style="width: 10%">得分</th>
								<th style="width: 10%">操作</th>
							</thead>
						</table>
						<table style="width: 100%;">
							<tbody>
							<draggable v-model="it.parms" @update="datadragEnd" :options = "{animation:500}">
								<!-- <transition-group> -->
								<tr v-for="(i,index) in it.parms" :key="i.questionId" class="questionList" >
									<td style="width: 8%">{{index+1}}</td>
									<td class="questionName" style="width: 36%;"><el-input type="textarea" autosize v-model="i.questionName" placeholder="请输入问题" ></el-input></td>
									<td class="questionAnswer" style="width: 36%;"><el-input type="textarea" autosize v-model="i.questionAnswer" placeholder="请输入答案"></el-input></td>
									<td style="width: 10%"><el-input v-model="i.score" type="number" placeholder="请输入得分"></el-input></td>
									<td style="width: 10%">
										<el-button
								          title="删除"
								          type="text" @click.native.prevent="deleteRow(it.parms,index)">
								          <i class="el-icon-delete"></i></el-button>
									</td> 
								</tr>
								<!-- </transition-group> -->
							</draggable>
							</tbody>
						</table>
						<!-- <el-table :data="it.parms">
						
				    		<el-table-column
						      type="index"
						      label="序号"
						      width="50">
						    </el-table-column>
					        <el-table-column prop="questionName" :label="it.name">
					        	
					        </el-table-column>
					        <el-table-column label="答案">
					        	<template slot-scope="scope">
									<el-input v-model="scope.row.questionAnswer" placeholder="请输入内容" ></el-input>
					        	</template>
					        </el-table-column>
					        <el-table-column label="得分" width="120">
					        	<template slot-scope="scope">
					        		<el-input type="number" v-model="scope.row.score" placeholder="得分" style="width: 100px"></el-input>
					        	</template>
					        </el-table-column>
					        <el-table-column width="100px" label="操作">
					        	<template slot-scope="scope">
					        		
							        <el-button
							          title="删除"
							          type="text" @click.native.prevent="deleteRow(it.parms,scope.$index)">
							          <i class="el-icon-delete"></i></el-button>
					        	</template>
					        </el-table-column>
					    </el-table> -->
					</el-tab-pane>
				</el-tabs>
		    </el-tab-pane>
		    <el-tab-pane label="诊断" name="诊断">
		    	<el-tabs tab-position="left" v-model="activeClass1">
		    		<el-tab-pane label="诊断" name="诊断">
						<div class="zhenduanItem" v-for="(item,index) in zhenduan.support">
							<p class="clearfix p-10">{{index+1}},诊断名称：<el-input size="small" v-model="item.diagnosisName" placeholder="诊断名称：" style="width: 300px"></el-input>
								<span class="pos-a" style="right: 60px">得分：<el-input type="number" size="small" v-model="item.diagnosisScore" placeholder="得分" style="width: 62px"></el-input></span>
								<a href="javascript:;" class="floatRight delete" @click="deleteRow(zhenduan.support,index)">删除</a>
							</p>
							<p class="reason clearfix">支持依据<span class="floatRight" @click="showReasonLog('zhenduan',index)">添加依据</span></p>
							<el-table :data="item.supportQuestions" :show-header="false">
					    		<el-table-column
							      type="index"
							      label="序号"
							      width="50">
							    </el-table-column>
						        <el-table-column prop="questionName">
						        	
						        </el-table-column>
		
						        <el-table-column label="得分" width="120">
						        	<template slot-scope="scope">
						        		<el-input type="number" v-model="scope.row.score" size="small" placeholder="得分" style="width: 62px"></el-input>
						        	</template>
						        </el-table-column>
						        <el-table-column width="100px" label="操作">
						        	<template slot-scope="scope">
						        		
								        <el-button
								          title="删除"
								          type="text" @click.native.prevent="deleteRow(item.supportQuestions,scope.$index)">
								          <i class="el-icon-delete"></i></el-button>
						        	</template>
						        </el-table-column>
						    </el-table>
						</div>
					</el-tab-pane>
					<el-tab-pane label="鉴别诊断" name="鉴别诊断">
						<div class="zhenduanItem" v-for="(item,index) in zhenduan.unsupport">
							<p class="clearfix p-10">{{index+1}},鉴别诊断名称：<el-input size="small" v-model="item.diagnosisName" placeholder="鉴别诊断名称：" style="width: 300px"></el-input>
								<span class="pos-a" style="right: 100px">得分：<el-input type="number" size="small" v-model="item.diagnosisScore" placeholder="得分" style="width: 62px"></el-input></span>
								<a href="javascript:;" class="floatRight delete" @click="deleteRow(zhenduan.unsupport,index)">删除</a>
							</p>
							<p class="reason clearfix">支持依据<span class="floatRight" @click="showReasonLog('unsupport',index)">添加</span></p>
							<el-table :data="item.supportQuestions" :show-header="false">
					    		<el-table-column
							      type="index"
							      label="序号"
							      width="50">
							    </el-table-column>
						        <el-table-column prop="questionName">
						        	
						        </el-table-column>
		
						        <el-table-column label="得分" width="120">
						        	<template slot-scope="scope">
						        		<el-input type="number" size="small" v-model="scope.row.score" placeholder="得分" style="width: 62px"></el-input>
						        	</template>
						        </el-table-column>
						        <el-table-column width="100px" label="操作">
						        	<template slot-scope="scope">
						        		
								        <el-button
								          title="删除"
								          type="text" @click.native.prevent="deleteRow(item.supportQuestions,scope.$index)">
								          <i class="el-icon-delete"></i></el-button>
						        	</template>
						        </el-table-column>
						    </el-table>
							<p class="reason clearfix">排除理由<span class="floatRight" @click="showReasonLog('unsupport',index,'no')">添加</span></p>
							<el-table :data="item.unSupportQuestions" :show-header="false">
					    		<el-table-column
							      type="index"
							      label="序号"
							      width="50">
							    </el-table-column>
						        <el-table-column prop="questionName">
						        	
						        </el-table-column>
		
						        <el-table-column label="得分" width="120">
						        	<template slot-scope="scope">
						        		<el-input type="number" v-model="scope.row.score" placeholder="得分" style="width: 60px"></el-input>
						        	</template>
						        </el-table-column>
						        <el-table-column width="100px" label="操作">
						        	<template slot-scope="scope">
						        		
								        <el-button
								          title="删除"
								          type="text" @click.native.prevent="deleteRow(item.unSupportQuestions,scope.$index)">
								          <i class="el-icon-delete"></i></el-button>
						        	</template>
						        </el-table-column>
						    </el-table>
						</div>
						
					</el-tab-pane>
				</el-tabs>
		    </el-tab-pane>
		    <el-tab-pane label="处置" name="处置">
				<el-tabs tab-position="left" v-model="activeClass2">
		    		<el-tab-pane v-for="(item,index) in chuzhi" :key="item.diagnosisName" :label="item.diagnosisName+'('+item.supportQuestions.length+')'" :name="item.diagnosisName">
						<el-table :data="item.supportQuestions">
				    		<el-table-column
						      type="index"
						      label="序号"
						      width="50">
						    </el-table-column>
					        <el-table-column :label="item.diagnosisName">
					        	<template slot-scope="scope">
									<el-input size="small" v-model="scope.row.questionName" placeholder="处置名称"></el-input>
					        	</template>
					        </el-table-column>
	
					        <el-table-column label="得分" width="120">
					        	<template slot-scope="scope">
					        		<el-input type="number" size="small" v-model="scope.row.score" placeholder="得分" style="width: 62px"></el-input>
					        	</template>
					        </el-table-column>
					        <el-table-column width="100px" label="操作">
					        	<template slot-scope="scope">
					        		
							        <el-button
							          title="删除"
							          type="text" @click.native.prevent="deleteRow(item.supportQuestions,scope.$index)">
							          <i class="el-icon-delete"></i></el-button>
					        	</template>
					        </el-table-column>
					    </el-table>
					</el-tab-pane>
				
				</el-tabs>
		    </el-tab-pane>
		</el-tabs>
		
		<!-- 添加依据弹出框 -->
		<el-dialog
		  title="添加依据"
		  :visible.sync="dialogVisibleTree"
		  width="600px"
		  @close="dialogClose">
		  	<el-collapse accordion>
		  		<div v-for="item in data" class="m-b-20" :key="item.id">
					<el-collapse-item>
						<template slot="title">
						    <p style="color: rgb(245, 108, 108);font-size: 16px;"><i class="header-icon el-icon-menu"></i> {{item.name}} </p>
						</template>
						<div v-for="list in item.children" :key="list.id">
							<el-alert
							    :title="list.name"
							    :closable="false"
							    class="m-t-20"
							    >
							</el-alert>
							<el-checkbox-group v-model="checkReason" @change="handleCheckChange">
								<el-checkbox v-for="i in list.parms" :label="i" :key="i.questionId" class="m-t-20" :disabled="noCheckReasonId.indexOf(i.questionId) > -1"><span>[{{item.name}}]</span> {{i.questionName}}
							    </el-checkbox>
							</el-checkbox-group>

						</div>
						
					</el-collapse-item>
				</div>
		  	</el-collapse>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisibleTree = false">取 消</el-button>
			    <el-button type="primary" @click="reasonSure">确 定</el-button>
			</span>
		</el-dialog>
		<div class="clearfix m-t-20">
			<el-button type="success" round class="floatRight m-l-10" size="small" @click="save('1')"> 发 布 </el-button>
			<el-button type="primary" round class="floatRight " size="small" @click="save('0')"> 保 存 </el-button>
		</div>
    </div>
</template>
<script>
import draggable from 'vuedraggable';//拖拽排序组件
import {recordApi} from '@/services/apis/record/record'
export default {
	name: 'setRecord',
	components: {
	    draggable
	},
	data () {

	    return {
	    	loading:true,
	    	params:{},  //入参
	    	dialogVisibleTree: false,
	    	activeName:'',
	    	activeClass:'',
	    	activeClass1:'',
	    	activeClass2:'',
	    	currentZhenduan: '',//当前诊断
	    	currentZhenduanNum: '',////当前诊断序号
	    	isNo: '', //排除理由
	    	checkReason:[],//选择的依据
	    	noCheckReason:[],//不可选的依据(已经选过的)
	    	noCheckReasonId:[],
	    	formInline:{
	    		gender:'',
	    		age:'',
	    		time:20,
	    		grade:"0",
	    		disease:'',
	    		symptoms:'',
	    		chiefComplaint:'',
	    		mrKey:'',
			    profession:'',
			    hospitalizedTime:'',
	    	},
	        data:[], //问诊，查体，院前检查的问题
	        zhenduan:{  //诊断数据
	        },
	        chuzhi:[],
	        patientId:'',
	    }
	},
	mounted() {

		this.formInline.disease = this.$route.query.disease;
		if (this.$route.query.type == 'edit') {
			recordApi.listSampleDetailBysample({
				sampleId:this.$route.query.sampleId
			}).then(response=>{
				this.setDefaultData(response.data.data);

				this.formInline.mrKey = response.data.data.sampleParms.mrKey;
				this.formInline.profession = response.data.data.sampleParms.profession;
				this.formInline.hospitalizedTime = response.data.data.sampleParms.hospitalizedTime;
			})
		}else{
			recordApi.questionRelationShips({
				diseaseId:this.$route.query.diseaseId,
				patientId:this.$route.query.patientId,
				visitId:this.$route.query.visitId
			}).then(response=>{
				this.setDefaultData(response.data.data);
				this.formInline.mrKey = this.$route.query.mrKey;
				this.formInline.profession = this.$route.query.profession;
				this.formInline.hospitalizedTime = this.$route.query.hospitalizedTime;
				
			})
		}

		//为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
        document.body.ondrop = function (event) {
            event.preventDefault();
            event.stopPropagation();
        }

	},
  	methods: {
  		//设置默认数据
  		setDefaultData(data){
  			this.loading = false;
			this.params = data;
			this.patientId = data.patientId
			this.formInline.gender = data.gender;
			this.formInline.age = data.age;
			this.formInline.chiefComplaint = data.chiefComplaint;
			this.formInline.symptoms = data.symptoms;
			this.formInline.time = data.suggestDuration;
     		this.formInline.grade = data.difficultyDegree;
			this.activeName = data.trees[0].name;
			this.activeClass = data.trees[0].children[0].name;
			this.data = data.trees;
			this.zhenduan = data.zhenduan;
			this.chuzhi = data.chuzhi;
  		},
     	handleClick(){

     	},
     	change(val){
     		//console.log(val)
     	},
     	//点击一级分类
     	tabClick1(tag){
     		if (tag.index == '3') {
     			this.activeClass1 = '诊断';
     		}else if (tag.index == '4') {
     			this.activeClass2 = this.chuzhi[0].diagnosisName;
     		}else{
     			this.activeClass = this.data[tag.index].children[0].name;
     		}
     		
     	},
     	//点击二级分类
     	tabClick2(tag){
     		//this.activeClass = tag.name;
     		//console.log(tag)
     	},
     	//显示依据弹框
     	showReasonLog(type,num,n){
     		this.currentZhenduan = type;
     		this.currentZhenduanNum = num;
     		this.dialogVisibleTree = true;
     		if (n) {
     			this.isNo = 'no';
     		}else{this.isNo = '';}

     		if (this.currentZhenduan == 'zhenduan') {

     			if (this.zhenduan.support[this.currentZhenduanNum].supportQuestions) {}else{
     				this.zhenduan.support[this.currentZhenduanNum].supportQuestions = []
     			}
     			this.noCheckReason = this.zhenduan.support[this.currentZhenduanNum].supportQuestions
     		}else if (this.currentZhenduan == 'unsupport') {
     			if (this.zhenduan.unsupport[this.currentZhenduanNum].supportQuestions) {}else{
     				this.zhenduan.unsupport[this.currentZhenduanNum].supportQuestions = []
     			}
     			if(this.zhenduan.unsupport[this.currentZhenduanNum].unSupportQuestions){}else{
     				this.zhenduan.unsupport[this.currentZhenduanNum].unSupportQuestions = []
     			}

     			this.noCheckReason = this.zhenduan.unsupport[this.currentZhenduanNum].supportQuestions.concat(this.zhenduan.unsupport[this.currentZhenduanNum].unSupportQuestions)

     		}
     		//console.log(this.noCheckReason)
     		this.noCheckReasonId = [];
     		for (var i = 0; i < this.noCheckReason.length; i++) {
     			this.noCheckReasonId.push(this.noCheckReason[i].questionId.toString())
     			//console.log(this.noCheckReason)
     		}
     		
     	},
     	//确定依据
     	reasonSure(){
     		if (this.currentZhenduan == 'zhenduan') {
     			for (var i = 0; i < this.checkReason.length; i++) {
     				this.zhenduan.support[this.currentZhenduanNum].supportQuestions.push({
     					questionId: this.checkReason[i].questionId,
     					questionName: this.checkReason[i].questionName,
     					score: '0'
     				})
     			}
     		}else if (this.currentZhenduan == 'unsupport') {
     			if (this.isNo == 'no') {
     				for (var i = 0; i < this.checkReason.length; i++) {
	     				this.zhenduan.unsupport[this.currentZhenduanNum].unSupportQuestions.push({
	     					questionId: this.checkReason[i].questionId,
	     					questionName: this.checkReason[i].questionName,
	     					score: '0'
	     				})
	     			}
     			}else{
     				for (var i = 0; i < this.checkReason.length; i++) {
	     				this.zhenduan.unsupport[this.currentZhenduanNum].supportQuestions.push({
	     					questionId: this.checkReason[i].questionId,
	     					questionName: this.checkReason[i].questionName,
	     					score: '0'
	     				})
	     			}
     			}
     		}
     		this.dialogVisibleTree = false;
     	},
     	dialogClose(){
     		this.checkReason = [];
     	},
     	handleCheckChange(val){
     		this.checkReason = val
     	},
     	//删除依据
     	deleteRow(rows,index){
     		this.$confirm('确定删除该项目?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	rows.splice(index, 1);
		        this.$message({
		            type: 'success',
		            message: '删除成功!'
		        });
	        }).catch(() => {
	                  
	        });
      
     		
     	},
     	//保存
     	save(type){
     		this.loading = true;
     		this.params.symptoms = this.formInline.symptoms;
     		this.params.chiefComplaint = this.formInline.chiefComplaint;
     		this.params.suggestDuration = this.formInline.time;
     		this.params.difficultyDegree = this.formInline.grade;
     		this.params.status = type;

     		this.$set(this.params, "sampleParms",{
     			mrKey:this.formInline.mrKey,
			    profession:this.formInline.profession,
			    hospitalizedTime:this.formInline.hospitalizedTime,
     		})
     
        	if (this.$route.query.type == 'edit') {
     			recordApi.updateRecord({
					sampleId:this.$route.query.sampleId,
					relationJson:JSON.stringify(this.params)
				}).then(response=>{
					this.loading = false;
					
					this.$message({
			            type: 'success',
			            message: '保存成功!'
			        });
				})
     		}else{
     			recordApi.addDiseaseRecord({
					diseaseId:this.$route.query.diseaseId,
					relationJson:JSON.stringify(this.params)
				}).then(response=>{
					this.loading = false;
					this.$router.push({name:'list'})
					this.$message({
			            type: 'success',
			            message: '保存成功!'
			        });
				})
     		}
	      
     		
     	},
     	//行拖拽
	    datadragEnd (evt) {
            evt.preventDefault();
 
        },
	    open(){

	    	window.open(process.env.HOST+'search/bysy/casehistory.html?pid='+this.patientId+'&sex='+this.formInline.gender+'&age='+this.formInline.age+'&occup='+this.formInline.profession+'&mrKey='+this.formInline.mrKey+'&sonlist=default&datelist='+this.formInline.hospitalizedTime+'&form=AI', '_blank', 'height=600, width=1000, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no') 
	    },
	    openImg(){
	    	window.open('http://10.2.98.65/ZFP-XDS/Main?DomainId=1.2.156.112636.1.1.1.3.1&PatientId='+this.patientId, '_blank', 'height=600, width=1000, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no') 
	    }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.setRecord{
	.el-button.el-button--text{
		font-size: 18px;
		.el-icon-delete,.delete{
			color: red;
		}
	}
	.delete{
		color: red;
		line-height: 32px;
	}
	.zhenduanItem{
		border: 1px #ccc solid;
		padding: 10px;
		margin-top: 10px;
	}
	.reason{
		background: #f4f4f5;
		padding: 8px;
		span{
			color: #409eff;
			cursor: pointer;
		}
	}
	.questionList{
		border-bottom: 1px #f0f0f0 solid;
		td{
			padding: 2px 5px;
			vertical-align: middle;
		}
		
	}
}

</style>