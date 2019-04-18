import axios from "../../index";
export const recordApi = {
    //新增病例
    addDiseaseRecord(data) {
        return axios({
            url: '/teachai/med/disease/addDiseaseRecord.json',
            method: 'post',
            data: data
        });
    },
    //根据疾病id及状态查病历
    listRecord(data) {
        return axios({
            url: '/teachai/med/disease/listDiseaseRecordByDiseaseId.json',
            method: 'post',
            data: data
        });
    },
    //修改病例状态
    updateRecordStatus(data) {
        return axios({
            url: '/teachai/med/disease/updateDiseaseRecordStatus.json',
            method: 'post',
            data: data
        });
    },
    //修改病例
    updateRecord(data) {
        return axios({
            url: '/teachai/med/disease/updateDiseaseRecordByDiseaseId.json',
            method: 'post',
            data: data
        });
    },
    //获取病例所有信息
    listSampleDetailBysample(data) {
        return axios({
            url: '/teachai/med/disease/listSampleDetailBysampleId.json',
            method: 'post',
            data: data
        });
    },
    //获取结构化病例
    questionRelationShips(data) {
        return axios({
            url: '/teachai/med/disease/listDiseaseQuestionRelationShipsAndAnswer.json',
            method: 'post',
            data: data
        });
    },
    //保存病例
    addDiseaseRecord(data) {
        return axios({
            url: '/teachai/med/disease/addDiseaseRecord.json',
            method: 'post',
            data: data
        });
    },
    //删除病例
    deleteDiseaseRecord(data) {
        return axios({
            url: '/teachai/med/disease/deleteDiseaseRecordByDiseaseId.json',
            method: 'post',
            data: data
        });
    },
    //判断病例重复
    sampleAreRepeat(data) {
        return axios({
            url: '/teachai/med/disease/sampleAreRepeat.json',
            method: 'post',
            data: data
        });
    },
}