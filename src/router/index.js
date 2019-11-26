import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Index from '@/views/index'

Vue.use(Router)
//登陆
import Login from '@/views/login/login'
//个人中心
import My from './my/my'
//映射表
import MapTable from './mapTable/mapTable'
//提问库
import Problem from './problem/problem'
// 病种
import Case from './case/case'
// 虚拟病历
import Record from './record/record'
//学生管理
import Students from './students/students'
//教师管理
import Teacher from './teacher/teacher'
//统计
import Stat from './stat/statistics'

const router = new Router({
	//mode: 'history',
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
			    ...My,
				...Problem,
				...Case,
				...Record,
				...MapTable,
				...Students,
				...Teacher,
				...Stat
			],
			meta:{
	            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的,暂时设置为false，否则不能进入home
	        }
		}
	]
})

/**
 * 路由拦截
 * @param  {[type]} (to, from, next [即将要进入的目标 路由对象，当前导航正要离开的路由，]
 * @return {[type]}      [description]
 */
router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requireAuth)){  // 判断该路由是否需要登录权限
        if (localStorage.getItem("uerId")) {
        	/* 路由发生变化修改页面title */
          next();
        }else{
        	next({
	            path: '/login',
	            query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
	        })
        }
    }
    else {
        next();
    }
    // if (to.name == 'login') {
    // 	next({
    //         path: '/',
    //     })
    // }
});
export default router;