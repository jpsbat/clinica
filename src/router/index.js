import { createRouter, createWebHistory } from 'vue-router'
import { useToast } from '@/composables/useToast'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/pages/unauthorized.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/pages/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/agendamentos',
    name: 'Agendamentos',
    component: () => import('@/pages/agendamentos.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pacientes',
    name: 'Pacientes',
    component: () => import('@/pages/pacientes.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/funcionarios',
    name: 'Funcionários',
    component: () => import('@/pages/funcionarios.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/terapias',
    name: 'Terapias',
    component: () => import('@/pages/terapias.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/financeiro',
    name: 'Financeiro',
    component: () => import('@/pages/financeiro.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/relatorios',
    name: 'Relatórios',
    component: () => import('@/pages/relatorios.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/configuracoes',
    name: 'Configurações',
    component: () => import('@/pages/configuracoes.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Guards de autenticação
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user')
  const isAuthenticated = !!user

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Usar toast para mostrar mensagem de erro
    const { warning } = useToast()
    warning('Você precisa fazer login para acessar esta página')
    next('/unauthorized')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router