import axios from "../../index";
export const statApi = {
	//学员使用统计
    statisticalSampleUser(data){
        return axios({
            url: '/teachai/med/user/getStatisticalSampleByDate.json',
            method: 'post',
            data: data
        });
    },
    //病例统计
    statisticalSample(data){
        return axios({
            url: '/teachai/med/user/getStatisticalSample.json',
            method: 'post',
            data: data
        });
    },
    //多维度统计
    statisticalScore(data){
        return axios({
            url: '/teachai/med/user/getStudentsScore.json',
            method: 'post',
            data: data
        });
    },
    //操作日志
    operationLog(data){
        return axios({
            url: '/teachai/med/user/getTeacherTimeNumber.json',
            method: 'post',
            data: data
        });
    },
}