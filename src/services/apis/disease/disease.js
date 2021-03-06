import axios from "../../index";
export const diseaseApi = {
    //科室分类列表
    listDiseaseType(data) {
        return axios({
            url: '/teachai/med/disease/listDiseaseType.json',
            method: 'post',
            data: data
        });
    },
    //获取疾病所有分类
    diseaseTypesAll(data) {
        return axios({
            url: '/teachai/med/disease/getDiseaseTypesAll.json',
            method: 'post',
            data: data
        });
    },
    //疾病列表
    listDisease(data) {
        return axios({
            url: '/teachai/med/disease/listDisease.json',
            method: 'post',
            data: data
        });
    },
    //新增和修改疾病
    editDisease(data) {
        return axios({
            url: '/teachai/med/disease/editDisease.json',
            method: 'post',
            data: data
        });
    },
    //删除疾病
    deleteDisease(data) {
        return axios({
            url: '/teachai/med/disease/deleteDisease.json',
            method: 'post',
            data: data
        });
    },
    //获取疾病下所有内容
    diseaseWithQuestion(data) {
        return axios({
            url: '/teachai/med/disease/listDiseaseWithQuestion.json',
            method: 'post',
            data: data
        });
    },
    //添加疾病下问题
    addSingleQuestion(data) {
        return axios({
            url: '/teachai/med/disease/addSingleQuestion.json',
            method: 'post',
            data: data
        });
    },
    //首页统计
    firstPageStatistics(data) {
        return axios({
            url: '/teachai/med/statistics/firstPageStatistics.json',
            method: 'post',
            data: data
        });
    },
    //有多少个疾病配置了问题
    hasQuestionDisease(data) {
        return axios({
            url: '/teachai/med/disease/hasQuestionDiseaseStatistics.json',
            method: 'post',
            data: data
        });
    },
}