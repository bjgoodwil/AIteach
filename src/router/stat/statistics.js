// 统计


const Statistics = resolve => require([ '@/views/stat/statistics'],resolve)

export default [
	{
		path: 'stat',
		name: 'stat',
		component: Statistics
	}
]