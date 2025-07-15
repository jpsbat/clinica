<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      :permanent="$vuetify.display.mdAndUp"
      :temporary="$vuetify.display.smAndDown"
      width="280"
    >
      <v-list-item class="pa-4">
        <template #prepend>
          <v-icon size="32" color="primary">mdi-hospital</v-icon>
        </template>
        <v-list-item-title class="text-h6 font-weight-bold">
          Clínica Terapia
        </v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list nav density="compact">
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          rounded="xl"
          class="ma-2"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar app flat border>
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        class="d-md-none"
      ></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <!-- Notifications -->
      <v-btn icon class="mr-2">
        <v-badge dot color="error">
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>

      <!-- User Menu -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            class="text-none"
          >
            <v-avatar size="32" class="mr-2">
              <v-img :src="user.avatar"></v-img>
            </v-avatar>
            <div class="d-none d-sm-flex flex-column align-start">
              <span class="text-body-2 font-weight-medium">{{ user.name }}</span>
              <span class="text-caption text-medium-emphasis">{{ user.role }}</span>
            </div>
            <v-icon class="ml-2">mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-card min-width="200">
          <v-list>
            <v-list-item :prepend-avatar="user.avatar">
              <v-list-item-title>{{ user.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list>
            <v-list-item prepend-icon="mdi-account" title="Meu Perfil"></v-list-item>
            <v-list-item prepend-icon="mdi-cog" title="Configurações"></v-list-item>
            <v-divider></v-divider>
            <v-list-item
              prepend-icon="mdi-logout"
              title="Sair"
              @click="logout"
            ></v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <slot></slot>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const drawer = ref(true)
const user = ref({})

const menuItems = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    to: '/'
  },
  {
    title: 'Agendamentos',
    icon: 'mdi-calendar',
    to: '/agendamentos'
  },
  {
    title: 'Pacientes',
    icon: 'mdi-account-group',
    to: '/pacientes'
  },
  {
    title: 'Funcionários',
    icon: 'mdi-account-tie',
    to: '/funcionarios'
  },
  {
    title: 'Terapias',
    icon: 'mdi-medical-bag',
    to: '/terapias'
  },
  {
    title: 'Financeiro',
    icon: 'mdi-currency-usd',
    to: '/financeiro'
  },
  {
    title: 'Relatórios',
    icon: 'mdi-chart-line',
    to: '/relatorios'
  },
  {
    title: 'Configurações',
    icon: 'mdi-cog',
    to: '/configuracoes'
  }
]

const logout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(() => {
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
  } else {
    router.push('/login')
  }
})
</script>