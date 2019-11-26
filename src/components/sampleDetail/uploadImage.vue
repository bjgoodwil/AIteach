<template>
    <div class="uploadImage">
        <el-button type="text" v-if="questionData.hasDicomImage == 'yes' || questionData.hasImage == 'yes'" @click="checkImage(questionData.id,questionData.hasDicomImage,questionData.hasImage)">查看影像</el-button>
        <el-button type="text" v-if="questionData.hasDicomImage == 'yes' || questionData.hasImage == 'yes'" @click="deleteImage(questionData.id,questionData.hasDicomImage,questionData.hasImage)" style="color: red">删除影像</el-button>
        <el-upload
          v-else
          :id="questionData.id+'_img'" 
          class="upload-demo"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          action=""
          :http-request="(file)=>upLoadImg(file,questionData.id)"
          :on-success="handleImgSuccess"
          :before-upload="beforeImgUpload"
          :file-list="fileList">
          <el-button size="small" type="primary">上传影像</el-button>
          <span>只能上传jpg或zip文件</span>
        </el-upload>
    </div>
</template>

<script>
import Vue from 'vue';
import {recordApi} from '@/services/apis/record/record';
export default {
    name: 'upload-image',
    props: {
        questionData: {     //问题数据
            type: Object,
            default: function () {
                return {};
            }
        },
    },
    data () {
        return {
            hasDicomImage:'no', //'yes'为有dicom,'no'为无
            hasImage:'no', //'yes'为有image,'no'为无
            fileList:[],
        }
    },
    mounted() {

    },
    methods: {
        //浏览器打开新窗口
        openWindow(url){
            window.open(url, '_blank', 'height=600, width=1000, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
        },
        //查看影像
        checkImage(id,hasDicomImage,hasImage){
            if (hasDicomImage == 'yes') {
                this.openWindow(process.env.BASE_API+'/teachai/yingxiang/ImageShare.htm?reportid='+id)
            }else if (hasImage == 'yes') {
                this.openWindow(process.env.BASE_API+'/teachai/yingxiang/dicom/image/'+id+'.jpg')
            }else{return false}
        },
        //文件数量限制
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件`);
        },
        //文件上传方法
        upLoadImg(file,id){
            this.loading = true;
            let imgType = ''
            var testmsg=file.file.name.substring(file.file.name.lastIndexOf('.')+1);

            if (testmsg == 'zip') {
                imgType = 'dicom'
            }else if(testmsg == 'jpg'){
                imgType = 'image'
            }else{
                this.$message.error('只能上传 jpg和zip 文件!');
                return false;
            }
            recordApi.uploadSampleImage({files:file.file,handleId:id,imagetype:imgType,jianchaUpload:true}).then(response=>{
                this.$message({
                    type: 'success',
                    message: '上传成功!'
                });
                this.loading = false;
                if (imgType == 'dicom') {
                    this.questionData.hasDicomImage = 'yes'
                }else if (imgType == 'image') {
                    this.questionData.hasImage = 'yes'
                }else {return false}
                //this.$emit('save',this.$route.query.status);
            })
        },
        handleImgSuccess(res, file) {
            this.$message({
                type: 'success',
                message: '上传成功!'
            });
        },
        //文件上传之前的校验函数
        beforeImgUpload(file) {
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)               
            const extension = testmsg === 'zip'
            const extension2 = testmsg === 'jpg'
            //const isLt2M = file.size / 1024 / 1024 < 2;
            if (!extension && !extension2) {
              this.$message.error('只能上传 jpg和zip 文件!');
            }
            // if (!isLt2M) {
            //   this.$message.error('文件大小不能超过 2MB!');
            // }
            return extension || extension2;
        },
        //删除影像
        deleteImage(id,hasDicomImage,hasImage){
            this.$confirm('确定删除该项目?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                hasDicomImage = 'no',hasImage = 'no';
                recordApi.deleteSampleImage({handleId:id,imagetype:''}).then(response=>{
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.questionData.hasDicomImage = 'no';
                    this.questionData.hasImage = 'no'
                    //this.$emit('save',this.$route.query.status);
                })
            }).catch(() => {});
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
