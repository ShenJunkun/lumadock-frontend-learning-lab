import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "./stores/authStore";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      component: () => import("./pages/HomePage.vue"),
      path: "/",
    },
    {
      component: () => import("./pages/CatalogPage.vue"),
      path: "/products",
    },
    {
      component: () => import("./pages/ProductDetailPage.vue"),
      path: "/products/:productId",
    },
    {
      component: () => import("./pages/BookingPage.vue"),
      path: "/book",
    },
    {
      component: () => import("./pages/LearnPage.vue"),
      path: "/learn",
    },
    {
      component: () => import("./pages/LoginPage.vue"),
      path: "/login",
    },
    {
      component: () => import("./pages/AdminPage.vue"),
      meta: { requiresAuth: true },
      path: "/admin",
    },
    {
      component: () => import("./pages/NotFoundPage.vue"),
      path: "/:pathMatch(.*)*",
    },
  ],
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    };
  }
  return true;
});
