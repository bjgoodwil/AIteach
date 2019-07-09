import axios from "../../index";
export const loginApi = {
    //获取图形验证码
    getCode(data){
        return axios({
            url: '/teachai/med/user/getCaptcha.json',
            method: 'post',
            data: data
        });
    },
    //登陆
    login(data) {
        return axios({
            url: '/teachai/med/user/login.json',
            method: 'post',
            data: data
        });
    },
}