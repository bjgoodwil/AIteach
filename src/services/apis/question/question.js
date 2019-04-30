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
    //添加子问题
    addSubQuestion(data) {
        return axios({
            url: '/teachai/med/question/addSubQuestion.json',
            method: 'post',
            data: data
        });
    },
    //添加父问题（标准库问题）
    addFatherQuestion(data) {
        return axios({
            url: '/teachai/med/question/addFatherQuestion.json',
            method: 'post',
            data: data
        });
    },
    //修改问题
    updateSubQuestion(data) {
        return axios({
            url: '/teachai/med/question/updateSubQuestion.json',
            method: 'post',
            data: data
        });
    },
    //删除父问题（标准问题库）
    deleteQuestion(data) {
        return axios({
            url: '/teachai/med/question/deleteQuestion.json',
            method: 'post',
            data: data
        });
    },
    //获取问题类型
    standandType(data) {
        return axios({
            url: '/teachai/med/question/listAllStandandTypeName.json',
            method: 'post',
            data: data
        });
    },
    //获取相关子问题
    allSubQuestion(data) {
        return axios({
            url: '/teachai/med/question/listAllSubQuestion.json',
            method: 'post',
            data: data
        });
    },
    //获取所有主问题
    listAllQuestion(data) {
        return axios({
            url: '/teachai/med/question/listAllQuestion.json',
            method: 'post',
            data: data
        });
    },
    
}