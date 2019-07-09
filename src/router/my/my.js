// 资源概览


const My = resolve => require([ '@/views/my/my'],resolve)

export default [
	{
		path: 'my',
		name: 'my',
		component: My
	}
]