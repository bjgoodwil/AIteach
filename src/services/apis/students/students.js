import axios from "../../index";
export const studentsApi = {
    //学生列表
    list(data) {
        return axios({
            url: '/teachai/med/user/listStudentDetail.json',
            method: 'post',
            data: data
        });
    },
    //新增和编辑学生
    addOrEdit(data) {
        return axios({
            url: '/teachai/med/user/editStudentDetail.json',
            method: 'post',
            data: data
        });
    },
    //修改学生密码
    updatePassword(data) {
        return axios({
            url: '/teachai/med/user/updatePassword.json',
            method: 'post',
            data: data
        });
    },
    //删除学生
    delete(data) {
        return axios({
            url: '/teachai/med/user/deleteStudentDetail.json',
            method: 'post',
            data: data
        });
    },
}