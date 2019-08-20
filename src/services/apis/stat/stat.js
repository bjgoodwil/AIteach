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
}