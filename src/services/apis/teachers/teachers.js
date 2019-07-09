import axios from "../../index";
export const teachersApi = {
    //教师列表
    list(data) {
        return axios({
            url: '/teachai/med/user/selectTeacher.json',
            method: 'post',
            data: data
        });
    },
    //新增和编辑教师
    addOrEdit(data) {
        return axios({
            url: '/teachai/med/user/reg.json',
            method: 'post',
            data: data
        });
    },
    //修改教师密码
    updatePassword(data) {
        return axios({
            url: '/teachai/med/user/updatePasswordForTeacher.json',
            method: 'post',
            data: data
        });
    },
    //删除教师
    delete(data) {
        return axios({
            url: '/teachai/med/user/delTeacher.json',
            method: 'post',
            data: data
        });
    },
    //权限类查询类列表
    selectPer(data) {
        return axios({
            url: '/teachai/med/user/selectPer.json',
            method: 'post',
            data: data
        });
    },
}