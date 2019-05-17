// 资源概览


const Students = resolve => require([ '@/views/students/studentsList'],resolve)

export default [
	{
		path: 'students',
		name: 'students',
		component: Students
	}
]