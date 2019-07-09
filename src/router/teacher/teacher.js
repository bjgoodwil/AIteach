// 资源概览


const Teacher = resolve => require([ '@/views/teacher/teacherList'],resolve)
//let roleName = JSON.parse(localStorage.getItem("uerInfo"))?JSON.parse(localStorage.getItem("uerInfo")).roleName : '管理员';
export default [
	{
		path: 'teacher',
		name: 'teacher',
		component: Teacher,
		beforeEnter(to,from,next){
			if (JSON.parse(localStorage.getItem("uerInfo")).role.roleName != '管理员') {
				alert("您的权限不能访问该页面")
			}else{
				next()
			}
        }
	}
]