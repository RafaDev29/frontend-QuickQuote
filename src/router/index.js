import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            meta: {
                title: "Home",
                requiresAuth: true
            },
            path: "/",
            component: () => import("@/layouts/MasterLayout.vue"),
            children: [
                {
                    name: "cotizaciones",
                    path: "cotizaciones",
                    component: () => import("@/views/CotizacionView.vue"),
                }
            ]
        },
        {
            meta: {
                title: "Login"
            },
            path: "/login",
            name: "login",
            component: () => import("@/views/LoginView.vue")
        },
        // Añadir una ruta por defecto para redirigir a login si no está autenticado
        {
            path: '/:pathMatch(.*)*', // Cualquier ruta no especificada
            redirect: '/login' // Redirigir a login
        }
    ]
})

// Navigation Guard  
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !store.state.isAuthenticated) {
        // Si la ruta requiere autenticación y el usuario no está autenticado, redirigir al login
        next({ name: 'login' });
    } else if (to.name === 'login' && store.state.isAuthenticated) {
        // Si el usuario ya está autenticado y trata de acceder al login, redirigir según su rol
        if (store.state.role === "administrador") {
            next({ name: 'cotizaciones' });
        } else if (store.state.role === "vendedor") {
            next({ name: 'cotizaciones' });
        } else {
            next();
        }
    } else if (to.path === '/' && store.state.isAuthenticated) {
        // Si el usuario está autenticado y accede a la raíz, redirigir según su rol
        if (store.state.role === "administrador") {
            next({ name: 'cotizaciones' });
        } else if (store.state.role === "vendedor") {
            next({ name: 'cotizaciones' });
        } else {
            next();
        }
    } else {
        // Si no hay ninguna condición que lo bloquee, permitir el acceso a la ruta solicitada
        next();
    }
});

export default router;
