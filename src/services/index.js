'use strict'
import router from '../router'
import axios from 'axios'
import qs from 'qs'

//import Cookies from 'js-cookie'
import {MessageBox} from 'element-ui';


let instance = axios.create({

    baseURL: process.env.BASE_API,  //在config中配置
    timeout: 60000,  //请求超时
    withCredentials: false, //加了这段就可以跨域了
    transformRequest: [function (data) { // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
                //data = qs.stringify(data)
                return data
    }]
});
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    let exp = 1000*60*60*2; // 2小时的秒数
    let overtime = localStorage.getItem("overtime");
    if(overtime && (new Date().getTime() - overtime) > exp) {
        // 如果(当前时间 - 存储的元素在创建时候设置的时间) > 过期时间 
        //window.location.href = window.location.host+"/login"
        router.push({path: "/login"})
        localStorage.clear();
    }else{
        localStorage.setItem("overtime", new Date().getTime());
    }
    //console.log(config)
    let token=localStorage.getItem('token') || ''
    // 在发送请求之前做些什么
    config.headers['Accept'] = '*/*';
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    config.headers['token'] = token;
    //上传影像的请求头
    if (config.data && config.data.jianchaUpload) {
        config.headers['Content-Type'] = 'multipart/form-data';
        let formData = new FormData();
        for (let i in config.data ) {
            if (i != 'jianchaUpload') {
                formData.append(i,config.data[i]);
            }
        }
        config.data = formData;
    }else{
        if (config.data && config.data.token) {
            config.headers['Content-Type'] = 'application/json';
            config.data = JSON.stringify({
                userId:"liruidong",
                sourceId:"882adee3c1af5bbb9aef08c923718c6f",
                targetId:"1747959d56e9aee1d81ae31ba3c92d18"
            })
        }else{
            config.data = qs.stringify(config.data)
        }
    }

    // if(config.method=='post'){  //设置固定入参
    //     config.data = {
    //         ...config.data,
    //         _t: Date.parse(new Date())/1000,
    //     }
    // }else if(config.method=='get'){
    //     config.params = {
    //         _t: Date.parse(new Date())/1000,
    //         ...config.params
    //     }
    // }


    return config;
    
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {

    if (response.status != 200 ) {
      
        MessageBox({
            message: response.data,
            type: 'error',
            showConfirmButton: false,
            duration: 5 * 1000
        });

    };
    return response;
    

}, function (error) {

    //  对响应错误做点什么
    MessageBox({
        message: error,
        type: 'error',
        showConfirmButton: false,
        duration: 5 * 1000
    });
    return Promise.reject(error);
});

export default instance;