// 资源概览


const MapTable = resolve => require([ '@/views/mapTable/mapTable'],resolve)

export default [
	{
		path: 'mapTable',
		name: 'mapTable',
		component: MapTable
	}
]