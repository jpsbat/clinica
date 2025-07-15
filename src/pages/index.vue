<template>
  <DashboardLayout>
    <v-container>
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold">Dashboard</h1>
          <p class="text-subtitle-1 text-medium-emphasis">Visão geral da clínica</p>
        </div>
        <v-chip color="success" variant="elevated">
          <v-icon start>mdi-circle</v-icon>
          Sistema Online
        </v-chip>
      </div>

      <!-- Cards de estatísticas -->
      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex justify-space-between">
                <div>
                  <p class="text-subtitle-2 text-medium-emphasis mb-1">Agendamentos Hoje</p>
                  <p class="text-h4 font-weight-bold">12</p>
                  <p class="text-success text-caption">
                    <v-icon size="small">mdi-trending-up</v-icon>
                    +8% desde ontem
                  </p>
                </div>
                <v-avatar color="primary" size="56">
                  <v-icon size="28">mdi-calendar-today</v-icon>
                </v-avatar>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex justify-space-between">
                <div>
                  <p class="text-subtitle-2 text-medium-emphasis mb-1">Pacientes Ativos</p>
                  <p class="text-h4 font-weight-bold">156</p>
                  <p class="text-success text-caption">
                    <v-icon size="small">mdi-trending-up</v-icon>
                    +12% este mês
                  </p>
                </div>
                <v-avatar color="success" size="56">
                  <v-icon size="28">mdi-account-group</v-icon>
                </v-avatar>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex justify-space-between">
                <div>
                  <p class="text-subtitle-2 text-medium-emphasis mb-1">Funcionários</p>
                  <p class="text-h4 font-weight-bold">8</p>
                  <p class="text-info text-caption">
                    <v-icon size="small">mdi-minus</v-icon>
                    Sem alterações
                  </p>
                </div>
                <v-avatar color="info" size="56">
                  <v-icon size="28">mdi-account-tie</v-icon>
                </v-avatar>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex justify-space-between">
                <div>
                  <p class="text-subtitle-2 text-medium-emphasis mb-1">Receita Mensal</p>
                  <p class="text-h4 font-weight-bold">R$ 28.5k</p>
                  <p class="text-success text-caption">
                    <v-icon size="small">mdi-trending-up</v-icon>
                    +15% este mês
                  </p>
                </div>
                <v-avatar color="warning" size="56">
                  <v-icon size="28">mdi-currency-usd</v-icon>
                </v-avatar>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- Próximos agendamentos -->
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
              <span>Próximos Agendamentos</span>
              <v-btn color="primary" variant="outlined" size="small">
                Ver Todos
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            
            <v-list>
              <v-list-item
                v-for="appointment in upcomingAppointments"
                :key="appointment.id"
                :prepend-avatar="appointment.avatar"
              >
                <v-list-item-title>{{ appointment.patient }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ appointment.therapy }} • {{ appointment.time }}
                </v-list-item-subtitle>
                
                <template #append>
                  <v-chip
                    :color="appointment.status === 'confirmado' ? 'success' : 'warning'"
                    size="small"
                    variant="elevated"
                  >
                    {{ appointment.status }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- Atividades recentes -->
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Atividades Recentes</v-card-title>
            <v-divider></v-divider>
            
            <v-timeline density="compact" class="pa-4">
              <v-timeline-item
                v-for="activity in recentActivities"
                :key="activity.id"
                :dot-color="activity.color"
                size="small"
              >
                <div class="mb-2">
                  <div class="font-weight-medium">{{ activity.title }}</div>
                  <div class="text-caption text-medium-emphasis">{{ activity.time }}</div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const upcomingAppointments = ref([
  {
    id: 1,
    patient: 'Maria Silva',
    therapy: 'Fisioterapia',
    time: '09:00',
    status: 'confirmado',
    avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
  },
  {
    id: 2,
    patient: 'João Santos',
    therapy: 'Psicologia',
    time: '10:30',
    status: 'pendente',
    avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg'
  },
  {
    id: 3,
    patient: 'Ana Costa',
    therapy: 'Fonoaudiologia',
    time: '14:00',
    status: 'confirmado',
    avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg'
  },
  {
    id: 4,
    patient: 'Pedro Lima',
    therapy: 'Terapia Ocupacional',
    time: '15:30',
    status: 'confirmado',
    avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg'
  }
])

const recentActivities = ref([
  {
    id: 1,
    title: 'Novo paciente cadastrado',
    time: 'há 2 minutos',
    color: 'success'
  },
  {
    id: 2,
    title: 'Agendamento confirmado',
    time: 'há 15 minutos',
    color: 'info'
  },
  {
    id: 3,
    title: 'Pagamento recebido',
    time: 'há 1 hora',
    color: 'warning'
  },
  {
    id: 4,
    title: 'Consulta finalizada',
    time: 'há 2 horas',
    color: 'primary'
  }
])
</script>