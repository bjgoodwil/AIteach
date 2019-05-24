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
			],
			meta:{
	            requireAuth: false,  // 添加该字段，表示进入这个路由是需要登录的,暂时设置为false，否则不能进入home
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
        
          next({
            path: '/login',
            query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })

    }
    else {
        next();
    }
});
export default router;