<template>
  <div class="hello">
    <div ref="editorElem" style="text-align:left;"></div>
    <el-button @click="setHtml">默认按钮</el-button>
  </div>
</template>

<script>
import E from "wangeditor";
export default {
  name: 'HelloWorld',
  data () {
    return {
      editor: null,
      editorContent: '...'
    }
  },
  mounted() {
    
    this.editor = new E(this.$refs.editorElem);
    // 编辑器的事件，每次改变会获取其html内容
    this.editor.customConfig.onchange = html => {
      this.editorContent = html;
    };
    this.editor.customConfig.menus = [
      // 菜单配置
      // 'head', // 标题
      // 'bold', // 粗体
      // 'fontSize', // 字号
      // 'fontName', // 字体
      // 'italic', // 斜体
      // 'underline', // 下划线
      // 'strikeThrough', // 删除线
      // 'foreColor', // 文字颜色
      // 'backColor', // 背景颜色
      'link', // 插入链接
      // 'list', // 列表
      // 'justify', // 对齐方式
      // 'quote', // 引用
      // 'emoticon', // 表情
      // 'image', // 插入图片
      // 'table', // 表格
      // 'code', // 插入代码
      // 'undo', // 撤销
      // 'redo' // 重复
    ];
    this.editor.create(); // 创建富文本实例
    this.editor.txt.html('<p>入CCU后患者<a href="5" target="_blank">胸痛持续不缓解</a>，予吗啡3mg静脉冲入后2min症状逐渐好转，后安静入睡，未诉不适。异舒吉<a href="4" target="_blank">30ug/min</a>静脉泵入，心电监护示血压110/60mmHg，心率65次/分，氧饱和度100%。查体:颈静脉无怒张。双肺呼吸音清，未闻及干湿罗音。心率62次/分，心律齐，心音有力，A2=P2，各瓣膜听诊区未闻及杂音，未闻及心包摩擦音。腹软无压痛、反跳痛，肠鸣音正常，4次/分。双下肢无水肿。 TIMI评分:5分；GRACE评分103分；CRUSADE评分26分。 化验回报: 2017-08-08 生化:快速丙氨酸氨基转移酶 22(U/L)，快速肌酸激酶同工酶MB 75(U/L)↑，快速肌酸激酶 515(U/L)↑，快速钾 3.3(mmol/L)↓，快速肌酐 67(umol/L)； 2017-08-08 急查肌钙蛋白T 0.271(ng/ml)↑，急查N末端脑钠肽前体 172(pg/ml)↑； 2017-08-08 D-二聚体定量 0.03(μg/ml)； 2017-08-08 血常规:白细胞 10.36(*10^9/L)↑，血红蛋白 133(g/L)，血小板 197(*10^9/L)，中性粒细胞百分数 74.6(%)；&nbsp;&nbsp;&nbsp;<br></p>')
  },
  methods: {
    setHtml(){
        let l = [];
        //console.log(this.editorContent);
        var as = document.getElementsByTagName('a');
        for(var i=0,j=as.length;i<j;i++){
            let a = {
                name:as[i].innerHTML,
                score:as[i].attributes["href"].value 
            }

            l.push(a)
        }
        console.log(l)
        console.log(this.editor.txt.html())
    }
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
