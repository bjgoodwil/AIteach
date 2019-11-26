import {recordApi} from '@/services/apis/record/record';
import {formatDate} from '@/util/dataFormat';
export default {
	name:'mixin',
	data() {
		return {
		   name: 'mixin',
		   maxScore: 5
		}
	},
	created() {
	    console.log('mixin...', this.name);
	},
	mounted() {},
	methods: {
		//限制得分最高为5分
		numberChange(data){
			if (data.questionScore>this.maxScore) {
				data.questionScore = this.maxScore;
			}
		},
		//浏览器打开新窗口
		openWindow(url){
	    	window.open(url, '_blank', 'height=600, width=1000, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
	    },
	    open(){
	    	this.openWindow(process.env.HOST+'search/bysy/casehistory.html?pid='+this.patientId+'&sex='+this.formInline.gender+'&age='+this.formInline.age+'&occup='+this.formInline.profession+'&mrKey='+this.formInline.mrKey+'&sonlist=default&datelist='+this.formInline.hospitalizedTime+'&form=AI')
	    },
	    openImg(){
	    	this.openWindow('http://10.2.98.65/ZFP-XDS/Main?DomainId=1.2.156.112636.1.1.1.3.1&PatientId='+this.patientId)
	    },
	    openBMJ(){
	    	let main = '';
	    	main = process.env.NODE_ENV == 'production'?'http://10.2.3.96:8080':'http://192.168.8.74:8080';
	    	this.openWindow(main+'/search/ZH_CN?q='+this.formInline.disease)
	    },
	    //导出病例
	    exportSample(){
	    	recordApi.exportSampleExcel({
				sampleId:this.$route.query.sampleId
			}).then(response=>{
			    var blob = new Blob([response.data], {type: 'application/vnd.ms-excel;charset=utf-8'});
                var downloadElement = document.createElement('a');
                var href = window.URL.createObjectURL(blob); // 创建下载的链接
                downloadElement.href = href;
                downloadElement.download = this.formInline.chiefComplaint +" - "+ formatDate(new Date(), "yyyy-MM-dd") + '.xlsx'; // 下载后文件名
                document.body.appendChild(downloadElement);
                downloadElement.click(); // 点击下载
                document.body.removeChild(downloadElement); // 下载完成移除元素
                window.URL.revokeObjectURL(href); // 释放掉blob对象
			})
	    }
	},
	computed: {

	}
}