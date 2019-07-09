// 资源概览


const MapTable = resolve => require([ '@/views/mapTable/mapTable'],resolve)
//let roleName = JSON.parse(localStorage.getItem("uerInfo"))?JSON.parse(localStorage.getItem("uerInfo")).roleName : '管理员';
export default [
	{
		path: 'mapTable',
		name: 'mapTable',
		component: MapTable,
		beforeEnter(to,from,next){
			if (JSON.parse(localStorage.getItem("uerInfo")).role.roleName != '管理员') {
				alert("您的权限不能访问该页面")
			}else{
				next()
			}
        }
	}
]