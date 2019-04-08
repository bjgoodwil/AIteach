import axios from "../index";
export const ywd = {
    //搜索病历
    search(data) {
        return axios({
            url: '/search/bysy/med/ai/mr.json',
            method: 'post',
            data: data
        });
    },
    //映射结构
    variableList(data) {
        return axios({
            url: '/search/bysy/med/ai/getVariableListNew.json',
            method: 'post',
            data: data
        });
    },
}