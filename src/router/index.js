import { createRouter, createWebHashHistory } from "vue-router";

export const constantRoutes = [
	{
		path: "/",
		component: () => import("@/pages/index.vue")
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	scrollBehavior: () => ({ top: 0 }),
	routes: constantRoutes,
});

export default router;