// 资源概览


const MapTable = resolve => require([ '@/views/mapTable/mapTable'],resolve)

export default [
	{
		path: 'mapTable',
		name: 'mapTable',
		component: MapTable,
		// beforeEnter(to,from,next){
  //           alert("您的权限不能访问该页面")
  //       }
	}
]