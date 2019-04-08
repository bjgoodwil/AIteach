// 资源概览

//疾病列表
const Case = resolve => require([ '@/views/case/case'],resolve)
//添加疾病
const AddCase = resolve => require([ '@/views/case/addCase'],resolve)
//疾病详情
const CaseInfo = resolve => require([ '@/views/case/caseInfo'],resolve)

export default [
	{
		path: 'case',
		name: 'case',
		component: Case
	},{
		path: 'addCase',
		name: 'addCase',
		component: AddCase
	},{
		path: 'caseInfo',
		name: 'caseInfo',
		component: CaseInfo
	}
]