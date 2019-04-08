// 资源概览


const ProblemBase = resolve => require([ '@/views/problem/problemBase'],resolve)

export default [
	{
		path: 'problem',
		name: 'problem',
		component: ProblemBase
	}
]