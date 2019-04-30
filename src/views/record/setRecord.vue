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
			    {{formInline.age}} {{formInline.ageunit}}
			</el-form-item>
			<!-- <el-form-item label="职业：">
			    {{formInline.profession}}
			</el-form-item> --> &nbsp;&nbsp;
			<el-button type="primary" round size="small" @click="open">查看病历详情</el-button>
			<el-button type="primary" round size="small" @click="openImg">查看影像</el-button>
			<el-button type="primary" round size="small" @click="openBMJ">BMJ临床实践</el-button><br>
			<el-form-item label="参考时间">
			    <el-input type="number" v-model="formInline.time" placeholder="时间" size="small" style="width: 200px">
					<template slot="append">分钟</template>
			    </el-input>
			</el-form-item>
			<el-form-item label="病历难度">
			    <el-select v-model="formInline.grade" placeholder="活动区域" @change="change" size="small" style="width: 200px">
			      	<el-option label="初级" value="0" ></el-option>
			      	<el-option label="中级" value="1" ></el-option>
			      	<el-option label="高级" value="2" ></el-option>
			    </el-select>
			</el-form-item>
			<el-form-item label="疾病">
			    <el-input v-model="formInline.disease" placeholder="疾病" size="small"></el-input>
			</el-form-item>
			<el-form-item label="症状">
			    <el-input v-model="formInline.symptoms" placeholder="症状" size="small"></el-input>
			</el-form-item>
			<el-form-item label="主诉">
			    <el-input v-model="formInline.chiefComplaint" placeholder="主诉" size="small" style="width: 494px"></el-input>
			</el-form-item>			
		</el-form>
		<el-alert
		    title="评分范围：-1减分项，0分为干扰项，1-5分为得分项"
		    type="error"
		    :closable="false">
		</el-alert>
		<el-button size="small" v-popover:popover class="m-t-10">添加场景</el-button>
		<el-popover
		  ref="popover"
		  placement="right"
		  width="400"
		  trigger="click">
		    <el-select v-model="sceneName" placeholder="请选择场景" @change="change" size="small" style="width: 200px">
		      	<el-option label="查房" value="查房" ></el-option>
		      	<el-option label="手术" value="手术" ></el-option>
		      	<el-option label="出院" value="出院" ></el-option>
		    </el-select>
		    <el-button size="small" @click="addScene">确定</el-button>
		</el-popover>
		<el-tabs type="border-card" v-model="activeScene" @tab-click="tabClick" class="m-t-10"
		    closable @tab-remove="removeScene">
			<el-tab-pane :key="index" :label="scene.name.split('_')[0]+'_'+(index+1)" v-for="(scene,index) in allQuestion.trees" :name="index.toString()">
				<el-button type="primary" round class="addBtn" size="small" @click="showQuestinForm"><i class="el-icon-plus"></i> 添加问题</el-button>
				<el-tabs v-model="activeName" @tab-click="tabClick1">
				    <el-tab-pane v-for="item in scene.children" :key="item.id" :label="item.name" :name="item.id">	
				    	<p v-if="item.name == '查体'" class="history"><span>体格检查：</span>{{allQuestion.chatisrc}}</p>
						<el-tabs tab-position="left" v-model="activeClass">
							<el-tab-pane v-for="(it,eq) in item.children" :key="it.id" :label="it.name+'('+it.parms.length+')'" :name="it.id">
								<div class="scroll-y">
								<p v-if="it.name == '出生史'" class="history"><span>出生史：</span>{{allQuestion.chushengshisrc}}</p>
								<p v-if="it.name == '婚育史'" class="history"><span>婚育史：</span>{{allQuestion.hunyushisrc}}</p>
								<p v-if="it.name == '现病史'" class="history"><span>现病史：</span>{{allQuestion.xianbingshisrc}}</p>
								<p v-if="it.name == '既往史'" class="history"><span>既往史：</span>{{allQuestion.jiwangshisrc}}</p>
								<p v-if="it.name == '个人史'" class="history"><span>个人史：</span>{{allQuestion.gerenshisrc}}</p>
								<p v-if="it.name == '家族史'" class="history"><span>家族史：</span>{{allQuestion.jiazushisrc}}</p>
								
								<table style="width: 100%;">
									<thead>
										<th style="width: 8%">序号</th>
										<th style="width: 34%">{{it.name}}</th>
										<th style="width: 34%">答案</th>
										<th style="width: 8%">得分</th>
										<th style="width: 8%">难度</th>
										<th style="width: 8%">操作</th>
									</thead>
								</table>
								<draggable v-model="it.parms" @update="datadragEnd" :options = "{animation:500}">
									<!-- <transition-group> -->
									<div v-for="(i,index) in it.parms" :key="i.questionName" class="questionList clearfix" style="width: 100%">
										<div style="width: 6%">{{index+1}}</div>
										<div class="questionName" style="width: 35%;"><el-input type="textarea" autosize v-model="i.questionName" placeholder="请输入问题" ></el-input></div>
										<div class="questionAnswer" style="width: 35%;"><el-input type="textarea" autosize v-model="i.questionAnswer instanceof Array?i.questionAnswer.toString().replace(/\[|]/g,''):i.questionAnswer" placeholder="请输入答案"></el-input></div>
										<div style="width: 8%"><el-input v-model="i.questionScore" type="number" size="small" placeholder="得分"></el-input></div>
										<div style="width: 8%">
											<el-select v-model="i.difficultyDegree" placeholder="难度"size="small">
										      	<el-option label="0" value="0" ></el-option>
										      	<el-option label="1" value="1" ></el-option>
										      	<el-option label="2" value="2" ></el-option>
										      	<el-option label="3" value="3" ></el-option>
										    </el-select>
										</div>
										<div style="width: 8%">
											<el-button
									          title="删除"
									          type="text" @click.native.prevent="deleteRow(it.parms,index)">
									          <i class="el-icon-delete"></i></el-button>
										</div> 
										<div style="width: 100%;" v-for="(sub,ind) in i.subQuestionList" v-if="i.subQuestionList">
											<div class="questionList textCenter" style="width: 6%;">{{index+1}}-{{ind+1}}</div>
											<div class="questionList" style="width: 35%;">
												<el-input type="textarea" autosize v-model="sub.questionName" size="small" placeholder="请输入问题"></el-input></div>
											<div class="questionList" style="width: 35%;">
												<el-input type="textarea" autosize v-model="sub.questionAnswer instanceof Array?sub.questionAnswer.toString().replace(/\[|]/g,''):sub.questionAnswer" size="small" placeholder="请输入答案"></el-input></div>
											<div class="questionList" style="width: 8%"><el-input v-model="sub.questionScore" type="number" size="small" placeholder="得分"></el-input></div>
											<div class="questionList" style="width: 8%">
												<el-select v-model="sub.difficultyDegree" placeholder="难度"size="small">
											      	<el-option label="0" value="0" ></el-option>
											      	<el-option label="1" value="1" ></el-option>
											      	<el-option label="2" value="2" ></el-option>
											      	<el-option label="3" value="3" ></el-option>
											    </el-select>
											</div>
											<div class="questionList" style="width: 8%">
												<el-button
										          title="删除"
										          type="text" @click.native.prevent="deleteRow(i.subQuestionList,ind)">
										          <i class="el-icon-delete"></i></el-button>
											</div>
										</div>
									</div>
									<!-- </transition-group> -->
								</draggable>
									
								<p v-if="it.parms.length == 0" class="textCenter m-t-10">暂无数据</p>
								</div>
							</el-tab-pane>
						</el-tabs>
				    </el-tab-pane>
				    <el-tab-pane label="诊断" name="诊断" v-if="activeScene ==0">
				    	<el-tabs tab-position="left" v-model="activeClass">
				    		<el-tab-pane label="诊断" name="诊断">
				    			<div class="scroll-y">
								<div class="zhenduanItem" v-for="(item,index) in zhenduan[activeScene][allQuestion.trees[activeScene].name].support">
									<p class="clearfix p-10 pos-r">{{index+1}},诊断名称：<el-input size="small" v-model="item.diagnosisName" placeholder="诊断名称：" style="width: 300px"></el-input>
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
								</div>
							</el-tab-pane>
							<el-tab-pane label="鉴别诊断" name="鉴别诊断">
								<div class="scroll-y">

								<div class="zhenduanItem" v-for="(item,index) in zhenduan[activeScene][allQuestion.trees[activeScene].name].unsupport">
									<p class="clearfix p-10 pos-r">{{index+1}},鉴别诊断名称：<el-input size="small" v-model="item.diagnosisName" placeholder="鉴别诊断名称：" style="width: 300px"></el-input>
										<span class="pos-a" style="right: 60px">得分：<el-input type="number" size="small" v-model="item.diagnosisScore" placeholder="得分" style="width: 62px"></el-input></span>
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
								</div>
							</el-tab-pane>
						</el-tabs>
				    </el-tab-pane>
				    <el-tab-pane label="处置" name="处置" v-if="activeScene ==0">
						<el-tabs tab-position="left" v-model="activeClass">
				    		<el-tab-pane v-for="(item,index) in chuzhi[activeScene][allQuestion.trees[activeScene].name]" :key="item.diagnosisName" :label="item.diagnosisName+'('+item.supportQuestions.length+')'" :name="item.diagnosisName">
				    			<div class="scroll-y">
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
								</div>
							</el-tab-pane>
						
						</el-tabs>
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
		  		<div v-for="item in gist" class="m-b-20" :key="item.id">
					<el-collapse-item>
						<template slot="title">
						    <p style="color: rgb(245, 108, 108);font-size: 16px;"><i class="header-icon el-icon-menu"></i> {{item.name}} </p>
						</template>
						<div v-for="list in item.children" :key="list.id">
							<el-alert
							    :title="list.name"
							    :closable="false"
							    class="m-t-20">
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
		<!-- 添加问题弹出框 -->
		<el-dialog
		  title="添加问题"
		  :visible.sync="dialogVisibleQuestion"
		  width="600px"
		  @close="dialogClose">
			<el-form label-width="80px" :model="questionForm" class="clearfix">
				<el-form-item label="诊断" v-if="activeName == '诊断'">
					<el-input v-model="questionForm.diagnosisName" placeholder="请输入诊断名称" size="small"></el-input> 
			  	</el-form-item>
			  	<el-form-item label="处置"  v-else-if="activeName == '处置'">
					<el-input v-model="questionForm.diagnosisName" placeholder="请输入处置名称" size="small"></el-input> 
			  	</el-form-item>
			    <div v-else>
					<el-form-item label="问题">
						<el-input v-model="questionForm.questionName" placeholder="请输入问题" size="small"></el-input> 
				  	</el-form-item>
				  	<el-form-item label="答案">
						<el-input v-model="questionForm.questionAnswer" placeholder="请输入答案" size="small"></el-input> 
				  	</el-form-item>
			    </div>
			  	
			  	<el-form-item label="难度" class="floatLeft" style="width: 240px;" >
					<el-select v-model="questionForm.difficultyDegree" placeholder="难度"size="small">
				      	<el-option label="0" value="0" ></el-option>
				      	<el-option label="1" value="1" ></el-option>
				      	<el-option label="2" value="2" ></el-option>
				      	<el-option label="3" value="3" ></el-option>
				    </el-select>
			  	</el-form-item>
			  	<el-form-item label="分数" class="floatRight" style="width: 240px;">
					<el-input v-model="questionForm.questionScore" type="number" placeholder="分数" size="small"></el-input> 
			  	</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisibleQuestion = false">取 消</el-button>
			    <el-button type="primary" @click="addQuestion">确 定</el-button>
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
	    	loading:false,
	    	params:{},  //入参
	    	dialogVisibleTree: false,
	    	dialogVisibleQuestion:false,
	    	activeScene:'0',
	    	activeName:'',
	    	activeClass:'',
	    	currentZhenduan: '',//当前诊断
	    	currentZhenduanNum: '',////当前诊断序号
	    	isNo: '', //排除理由
	    	checkReason:[],//选择的依据
	    	noCheckReason:[],//不可选的依据(已经选过的)
	    	noCheckReasonId:[],
	    	formInline:{
	    		gender:'',
	    		age:'',
	    		ageunit:'',
	    		time:20,
	    		grade:"0",
	    		disease:'',
	    		symptoms:'',
	    		chiefComplaint:'',
	    		mrKey:'',
			    profession:'',
			    hospitalizedTime:'',
	    	},
	    	questionForm:{
	    		classifyId: "",
				difficultyDegree: "0",
				questionAnswer: "",
				questionId: "",
				questionName: "",
				questionPath: "",
				questionScore: "0",
				subQuestionList: [],
				//添加诊断，处置
				diagnosisName:'',
	    	},//添加问题表单
	        allQuestion:[], //问诊，查体，院前检查的问题
	        zhenduan:{  //诊断数据
	        },
	        chuzhi:[],
	        patientId:'',
	        sceneName:'查房',//场景名
	        gist:[],  //依据
	    }
	},
	mounted() {
		this.loading = true;
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
			this.formInline.mrKey = this.$route.query.mrKey ||'';
			this.formInline.profession = this.$route.query.profession ||'';
			this.formInline.hospitalizedTime = this.$route.query.hospitalizedTime ||'';
			if (this.$route.query.type == 'import') {

				this.setDefaultData(this.$route.params);
			}else{
				recordApi.questionRelationShips({
					diseaseId:this.$route.query.diseaseId,
					patientId:this.$route.query.patientId,
					visitId:this.$route.query.visitId,
					sceneName:'入院'
				}).then(response=>{
					if (response.data.errCode == "0") {
		    			this.setDefaultData(response.data.data);
		    		}else{
		    			this.$message({
					        message: response.data.errMsg,
					        type: 'warning'
				        });
				        this.$router.go(-1);
		    		}
				})
			}
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
			this.formInline.ageunit = data.ageunit;
			this.formInline.chiefComplaint = data.chiefComplaint;
			this.formInline.symptoms = data.symptoms;
			this.formInline.time = data.suggestDuration;
     		this.formInline.grade = data.difficultyDegree;
			this.activeName = data.trees[0].children[0].id;
			this.activeClass = data.trees[0].children[0].children[0].id;
			this.allQuestion = data;
			this.zhenduan = data.zhenduan;
			this.chuzhi = data.chuzhi;
			this.gist = this.params.trees[this.activeScene].children;
  		},
  		//添加和删除场景
     	addScene(){
     		this.loading = true;
     		recordApi.questionRelationShips({
				diseaseId:this.$route.query.diseaseId,
				patientId:this.$route.query.patientId,
				visitId:this.$route.query.visitId,
				sceneName:this.sceneName
			}).then(response=>{
				this.loading = false;
				this.params.trees.push(response.data.data.trees[0])
			})
			document.getElementsByClassName('el-popover')[0].style.display = "none"
     	},
     	removeScene(index){
     		if(index == 0){
     			this.$message({
		            type: 'warning',
		            message: '该场景不可删除!'
		        });
     		}else{
     			this.$confirm('确定删除该场景?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        	this.params.trees.splice(index,1)
		        })
     		}
     	},
     	change(val){
     		//console.log(val)
     	},
     	tabClick(tag){
     		this.activeName = this.allQuestion.trees[tag.index].children[0].id;
	    	this.activeClass = this.allQuestion.trees[tag.index].children[0].children[0].id;
     	},
     	//点击一级分类
     	tabClick1(tag){
     		if (this.activeScene == 0) {
	     		if (tag.index == '3') {
	     			this.activeClass = '诊断';
	     		}else if (tag.index == '4') {
	     			this.activeClass = this.chuzhi[this.activeScene][this.allQuestion.trees[this.activeScene].name][0].diagnosisName;
	     		}else{
	     			this.activeClass = this.allQuestion.trees[this.activeScene].children[tag.index].children[0].id;
	     		}
     		}
     	},
     	//显示添加问题弹出框
     	showQuestinForm(){
     		//console.log(this.activeClass)
     		this.dialogVisibleQuestion = true;
     		if (this.activeClass == '诊断') {

     		}else if (this.activeClass == this.chuzhi[0].diagnosisName) {

     		}else{
     			this.questionForm.classifyId = this.activeClass
     		}
     	},
     	addQuestion(){
     		let a = this.params.trees[this.activeScene];
     		if (this.activeName == '诊断') {
     			if (this.activeClass == '诊断') {
     				this.zhenduan[this.activeScene][this.allQuestion.trees[this.activeScene].name].support.push({
     					diagnosisName: this.questionForm.diagnosisName,
						diagnosisScore: this.questionForm.questionScore,
						diagnosisType: "support",
						supportQuestions: []
     				})
     			}else{
     				this.zhenduan[this.activeScene][this.allQuestion.trees[this.activeScene].name].unsupport.push({
     					diagnosisName: this.questionForm.diagnosisName,
						diagnosisScore: this.questionForm.questionScore,
						diagnosisType: "unsupport",
						supportQuestions: [],
						unSupportQuestions: []
     				})
     			}
     		}else if (this.activeName == '处置') {
     			console.log(this.activeClass)
     			for (var i = 0; i < this.chuzhi[this.activeScene][this.allQuestion.trees[this.activeScene].name].length; i++) {
     				if (this.activeClass == this.chuzhi[this.activeScene][this.allQuestion.trees[this.activeScene].name][i].diagnosisName) {
     					this.chuzhi[this.activeScene][this.allQuestion.trees[this.activeScene].name][i].supportQuestions.push({
     						questionName: this.questionForm.diagnosisName,
							score: this.questionForm.questionScore,
     					})
     				}
     			}
     		}else{
     			for (var i = 0; i < a.children.length; i++) {
	        		if (this.activeName == a.children[i].id) {
	        			for (var j = 0; j < a.children[i].children.length; j++) {
	        				if (this.activeClass == a.children[i].children[j].id){
	        					a.children[i].children[j].parms.push(this.questionForm)
	        				}
	        			}
	        		}
	        	}
     		}
        	this.dialogVisibleQuestion = false;
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
     			if (this.zhenduan[this.activeScene][this.allQuestion.trees[this.activeScene].name].support[this.currentZhenduanNum].supportQuestions) {}else{
     				this.zhenduan[this.activeScene][this.allQuestion.trees[this.activeScene].name].support[this.currentZhenduanNum].supportQuestions = []
     			}
     			this.noCheckReason = this.zhenduan[this.activeScene][this.allQuestion.trees[this.activeScene].name].support[this.currentZhenduanNum].supportQuestions
     		}else if (this.currentZhenduan == 'unsupport') {
     			if (this.zhenduan[this.activeScene][this.allQuestion.trees[this.activeScene].name].unsupport[this.currentZhenduanNum].supportQuestions) {}else{
     				this.zhenduan[this.activeScene][this.allQuestion.trees[this.activeScene].name].unsupport[this.currentZhenduanNum].supportQuestions = []
     			}
     			if(this.zhenduan[this.activeScene][this.allQuestion.trees[this.activeScene].name].unsupport[this.currentZhenduanNum].unSupportQuestions){}else{
     				this.zhenduan[this.activeScene][this.allQuestion.trees[this.activeScene].name].unsupport[this.currentZhenduanNum].unSupportQuestions = []
     			}

     			this.noCheckReason = this.zhenduan[this.activeScene][this.allQuestion.trees[this.activeScene].name].unsupport[this.currentZhenduanNum].supportQuestions.concat(this.zhenduan[this.activeScene][this.allQuestion.trees[this.activeScene].name].unsupport[this.currentZhenduanNum].unSupportQuestions)
     		}
     		this.noCheckReasonId = [];
     		for (var i = 0; i < this.noCheckReason.length; i++) {
     			this.noCheckReasonId.push(this.noCheckReason[i].questionId.toString())
     		}
     	},
     	//确定依据
     	reasonSure(){
     		if (this.currentZhenduan == 'zhenduan') {
     			for (var i = 0; i < this.checkReason.length; i++) {
     				this.zhenduan[this.activeScene][this.allQuestion.trees[this.activeScene].name].support[this.currentZhenduanNum].supportQuestions.push({
     					questionId: this.checkReason[i].questionId,
     					questionName: this.checkReason[i].questionName,
     					score: '0'
     				})
     			}
     		}else if (this.currentZhenduan == 'unsupport') {
     			if (this.isNo == 'no') {
     				for (var i = 0; i < this.checkReason.length; i++) {
	     				this.zhenduan[this.activeScene][this.allQuestion.trees[this.activeScene].name].unsupport[this.currentZhenduanNum].unSupportQuestions.push({
	     					questionId: this.checkReason[i].questionId,
	     					questionName: this.checkReason[i].questionName,
	     					score: '0'
	     				})
	     			}
     			}else{
     				for (var i = 0; i < this.checkReason.length; i++) {
	     				this.zhenduan[this.activeScene][this.allQuestion.trees[this.activeScene].name].unsupport[this.currentZhenduanNum].supportQuestions.push({
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
     		if (this.params.diagnosis == '') {
     			this.params.diagnosis = this.formInline.disease
     		}
     		this.params.symptoms = this.formInline.symptoms;
     		this.params.chiefComplaint = this.formInline.chiefComplaint;
     		this.params.suggestDuration = this.formInline.time;
     		this.params.difficultyDegree = this.formInline.grade;
     		this.params.status = type;
     		for (var i = 0; i < this.params.trees.length; i++) {
     			this.params.trees[i].name = '入院_1';
     			this.chuzhi[0]=JSON.parse(JSON.stringify(this.chuzhi[0]).replace(/入院/g,"入院_1"))
     			this.zhenduan[0]=JSON.parse(JSON.stringify(this.zhenduan[0]).replace(/入院/g,"入院_1"))
	    		for (var j = 0; j < this.params.trees[i].children.length; j++) {
	    			for (var k = 0; k < this.params.trees[i].children[j].children.length; k++) {
		    			for (var l = 0; l < this.params.trees[i].children[j].children[k].parms.length; l++) {
			    			this.params.trees[i].children[j].children[k].parms[l].questionNum = l+1
			    		}
		    		}
	    		}
			}
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
     			this.$set(this.params, "sampleParms",{
	     			mrKey:this.formInline.mrKey || '',
				    profession:this.formInline.profession || '',
				    hospitalizedTime:this.formInline.hospitalizedTime || '',
	     		})
     			recordApi.addDiseaseRecord({
					diseaseId:this.$route.query.diseaseId || this.$route.parms.diseaseId,
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
	    },
	    openBMJ(){
	    	let main = '';
	    	if (window.location.host == process.env.HOST) {
	    		main = 'http://10.2.3.96:8080'
	    	}else{
	    		main = 'http://192.168.8.74:8080'
	    	}
	    	window.open(main+'/search/ZH_CN?q='+this.formInline.disease, '_blank', 'height=600, width=1000, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no') 
	    }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.setRecord{
	.el-form-item {
	    margin-bottom: 0;
	}
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
		>div{
			float: left;
		    box-sizing: border-box;
		    padding: 0 4px;
		}
		float: left;
		line-height: 36px;
	}
	.history{
		font-size: 14px;
		margin-bottom: 10px;
		span{
			color: red;
		}
	}
	.el-tabs.el-tabs--left{
		height: 420px;
		.el-tabs__content{
			.scroll-y{
				max-height: 420px;
	    		overflow-y: auto;
			}
		}
	}
}
</style>