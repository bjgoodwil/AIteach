import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Index from '@/views/index'

Vue.use(Router)
//登陆
import MapTable from './mapTable/mapTable'
//映射表
import Login from '@/views/login/login'
//提问库
import Problem from './problem/problem'
// 病种
import Case from './case/case'
// 虚拟病历
import Record from './record/record'
//学生信息
import Students from './students/students'

const router = new Router({
	routes: [
		{
			path: '/hello',
			name: 'hello',
			component: HelloWorld,
		},
		{
			path: '/login',
			name: 'login',
			component: Login,
		},
		{
			path: '/',
			name: 'index',
			component: Index,
			redirect: '/case',
			children: [
				...Problem,
				...Case,
				...Record,
				...MapTable,
				...Students
			]
			
		}
	]
})
export default router;