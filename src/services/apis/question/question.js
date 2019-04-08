import axios from "../../index";
export const question = {
    //问题分类列表
    classifyList(data) {
        return axios({
            url: '/teachai/med/question/classifyList.json',
            method: 'post',
            data: data
        });
    },
    //获取所有问题
    questionListAll(data) {
        return axios({
            url: '/teachai/med/question/questionListAll.json',
            method: 'post',
            data: data
        });
    },
    //问题列表
    questionList(data) {
        return axios({
            url: '/teachai/med/question/questionList.json',
            method: 'post',
            data: data
        });
    },
    //添加问题
    addQuestion(data) {
        return axios({
            url: '/teachai/med/question/addQuestion.json',
            method: 'post',
            data: data
        });
    },
    //修改问题
    updateQuestion(data) {
        return axios({
            url: '/teachai/med/question/updateQuestion.json',
            method: 'post',
            data: data
        });
    },
    //删除问题
    deleteQuestion(data) {
        return axios({
            url: '/teachai/med/question/deleteQuestion.json',
            method: 'post',
            data: data
        });
    },
    //获取映射路径
    getModelList(data) {
        return axios({
            url: '/teachai/med/question/getModelList.json',
            method: 'post',
            data: data
        });
    },
}