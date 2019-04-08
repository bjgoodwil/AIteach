// 虚拟病历

// 病历列表
const List = resolve => require([ '@/views/record/record'],resolve)
// 搜索病历
const Search = resolve => require([ '@/views/record/search'],resolve)
// 搜索结果
const SearchResult = resolve => require([ '@/views/record/searchResult'],resolve)
//结构化病历
const SetRecord = resolve => require([ '@/views/record/setRecord'],resolve)

export default [
	
		{
			path: 'list',
			name: 'list',
			component: List
		},{
			path: 'search',
			name: 'search',
			component: Search
		},{
			path: 'searchResult',
			name: 'searchResult',
			component: SearchResult
		},{
			path: 'setRecord',
			name: 'setRecord',
			component: SetRecord
		}
	
]