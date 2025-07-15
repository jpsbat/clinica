<template>
  <DashboardLayout>
    <v-container>
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold">Relatórios</h1>
          <p class="text-subtitle-1 text-medium-emphasis">Análises e relatórios da clínica</p>
        </div>
        <v-btn color="primary" @click="exportReport">
          <v-icon start>mdi-download</v-icon>
          Exportar Relatório
        </v-btn>
      </div>

      <!-- Filtros dos relatórios -->
      <v-card class="mb-6">
        <v-card-title>Filtros</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="reportType"
                :items="reportTypes"
                label="Tipo de Relatório"
                variant="outlined"
                density="compact"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="dateFrom"
                label="Data Inicial"
                type="date"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="dateTo"
                label="Data Final"
                type="date"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-btn color="primary" block @click="generateReport">
                Gerar Relatório
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Relatórios em abas -->
      <v-card>
        <v-tabs v-model="activeTab" bg-color="primary">
          <v-tab value="financial">Financeiro</v-tab>
          <v-tab value="appointments">Agendamentos</v-tab>
          <v-tab value="patients">Pacientes</v-tab>
          <v-tab value="performance">Desempenho</v-tab>
        </v-tabs>

        <v-tabs-window v-model="activeTab">
          <!-- Relatório Financeiro -->
          <v-tabs-window-item value="financial">
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-card variant="outlined">
                    <v-card-title>Resumo Financeiro</v-card-title>
                    <v-card-text>
                      <div class="d-flex justify-space-between align-center mb-3">
                        <span>Total de Receitas:</span>
                        <span class="text-h6 text-success">R$ 28.500,00</span>
                      </div>
                      <div class="d-flex justify-space-between align-center mb-3">
                        <span>Total de Despesas:</span>
                        <span class="text-h6 text-error">R$ 12.300,00</span>
                      </div>
                      <v-divider class="my-3"></v-divider>
                      <div class="d-flex justify-space-between align-center">
                        <span class="font-weight-bold">Lucro Líquido:</span>
                        <span class="text-h5 text-primary font-weight-bold">R$ 16.200,00</span>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card variant="outlined">
                    <v-card-title>Receitas por Terapia</v-card-title>
                    <v-card-text>
                      <div
                        v-for="therapy in revenueByTherapy"
                        :key="therapy.name"
                        class="d-flex justify-space-between align-center mb-2"
                      >
                        <div class="d-flex align-center">
                          <v-avatar :color="therapy.color" size="24" class="mr-2">
                            <v-icon size="12" color="white">{{ therapy.icon }}</v-icon>
                          </v-avatar>
                          <span>{{ therapy.name }}</span>
                        </div>
                        <span class="font-weight-medium">R$ {{ therapy.revenue }}</span>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Gráfico de evolução financeira -->
              <v-card variant="outlined" class="mt-4">
                <v-card-title>Evolução Financeira</v-card-title>
                <v-card-text>
                  <div class="text-center pa-12">
                    <v-icon size="64" color="grey-lighten-2">mdi-chart-areaspline</v-icon>
                    <p class="text-h6 mt-4 text-grey">Gráfico de Evolução Mensal</p>
                    <p class="text-body-2 text-grey">Receitas e despesas dos últimos 6 meses</p>
                  </div>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-tabs-window-item>

          <!-- Relatório de Agendamentos -->
          <v-tabs-window-item value="appointments">
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <v-icon size="48" color="primary" class="mb-2">mdi-calendar-check</v-icon>
                      <h3 class="text-h4 font-weight-bold">{{ appointmentStats.total }}</h3>
                      <p class="text-subtitle-2">Total de Agendamentos</p>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <v-icon size="48" color="success" class="mb-2">mdi-check-circle</v-icon>
                      <h3 class="text-h4 font-weight-bold">{{ appointmentStats.completed }}</h3>
                      <p class="text-subtitle-2">Consultas Realizadas</p>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <v-icon size="48" color="error" class="mb-2">mdi-cancel</v-icon>
                      <h3 class="text-h4 font-weight-bold">{{ appointmentStats.cancelled }}</h3>
                      <p class="text-subtitle-2">Consultas Canceladas</p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Taxa de ocupação por terapeuta -->
              <v-card variant="outlined" class="mt-4">
                <v-card-title>Taxa de Ocupação por Terapeuta</v-card-title>
                <v-card-text>
                  <div
                    v-for="therapist in therapistOccupancy"
                    :key="therapist.name"
                    class="mb-4"
                  >
                    <div class="d-flex justify-space-between align-center mb-1">
                      <span class="font-weight-medium">{{ therapist.name }}</span>
                      <span>{{ therapist.occupancy }}%</span>
                    </div>
                    <v-progress-linear
                      :model-value="therapist.occupancy"
                      :color="getOccupancyColor(therapist.occupancy)"
                      height="8"
                      rounded
                    ></v-progress-linear>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Horários mais procurados -->
              <v-card variant="outlined" class="mt-4">
                <v-card-title>Horários Mais Procurados</v-card-title>
                <v-card-text>
                  <div class="text-center pa-12">
                    <v-icon size="64" color="grey-lighten-2">mdi-chart-bar</v-icon>
                    <p class="text-h6 mt-4 text-grey">Gráfico de Horários</p>
                    <p class="text-body-2 text-grey">Distribuição de agendamentos por horário</p>
                  </div>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-tabs-window-item>

          <!-- Relatório de Pacientes -->
          <v-tabs-window-item value="patients">
            <v-card-text>
              <v-row>
                <v-col cols="12" md="3">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <v-icon size="48" color="primary" class="mb-2">mdi-account-group</v-icon>
                      <h3 class="text-h4 font-weight-bold">{{ patientStats.total }}</h3>
                      <p class="text-subtitle-2">Total de Pacientes</p>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="3">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <v-icon size="48" color="success" class="mb-2">mdi-account-check</v-icon>
                      <h3 class="text-h4 font-weight-bold">{{ patientStats.active }}</h3>
                      <p class="text-subtitle-2">Pacientes Ativos</p>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="3">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <v-icon size="48" color="info" class="mb-2">mdi-account-plus</v-icon>
                      <h3 class="text-h4 font-weight-bold">{{ patientStats.newThisMonth }}</h3>
                      <p class="text-subtitle-2">Novos este Mês</p>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="3">
                  <v-card variant="outlined">
                    <v-card-text class="text-center">
                      <v-icon size="48" color="warning" class="mb-2">mdi-account-clock</v-icon>
                      <h3 class="text-h4 font-weight-bold">{{ patientStats.avgAge }}</h3>
                      <p class="text-subtitle-2">Idade Média</p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Distribuição por faixa etária -->
              <v-card variant="outlined" class="mt-4">
                <v-card-title>Distribuição por Faixa Etária</v-card-title>
                <v-card-text>
                  <div
                    v-for="ageGroup in ageDistribution"
                    :key="ageGroup.range"
                    class="d-flex justify-space-between align-center mb-3"
                  >
                    <span>{{ ageGroup.range }}</span>
                    <div class="d-flex align-center">
                      <v-progress-linear
                        :model-value="ageGroup.percentage"
                        color="primary"
                        height="20"
                        style="width: 200px;"
                        class="mr-3"
                      ></v-progress-linear>
                      <span class="font-weight-medium">{{ ageGroup.count }} ({{ ageGroup.percentage }}%)</span>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Pacientes por terapia -->
              <v-card variant="outlined" class="mt-4">
                <v-card-title>Pacientes por Tipo de Terapia</v-card-title>
                <v-card-text>
                  <div class="text-center pa-12">
                    <v-icon size="64" color="grey-lighten-2">mdi-chart-donut</v-icon>
                    <p class="text-h6 mt-4 text-grey">Gráfico de Pizza</p>
                    <p class="text-body-2 text-grey">Distribuição de pacientes por terapia</p>
                  </div>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-tabs-window-item>

          <!-- Relatório de Desempenho -->
          <v-tabs-window-item value="performance">
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-card variant="outlined">
                    <v-card-title>KPIs Principais</v-card-title>
                    <v-card-text>
                      <div class="mb-4">
                        <div class="d-flex justify-space-between align-center mb-1">
                          <span>Taxa de Ocupação Geral</span>
                          <span class="font-weight-bold text-success">85%</span>
                        </div>
                        <v-progress-linear model-value="85" color="success" height="8"></v-progress-linear>
                      </div>

                      <div class="mb-4">
                        <div class="d-flex justify-space-between align-center mb-1">
                          <span>Satisfação dos Pacientes</span>
                          <span class="font-weight-bold text-primary">4.8/5</span>
                        </div>
                        <v-progress-linear model-value="96" color="primary" height="8"></v-progress-linear>
                      </div>

                      <div class="mb-4">
                        <div class="d-flex justify-space-between align-center mb-1">
                          <span>Taxa de Cancelamento</span>
                          <span class="font-weight-bold text-warning">12%</span>
                        </div>
                        <v-progress-linear model-value="12" color="warning" height="8"></v-progress-linear>
                      </div>

                      <div class="mb-4">
                        <div class="d-flex justify-space-between align-center mb-1">
                          <span>Pontualidade</span>
                          <span class="font-weight-bold text-info">92%</span>
                        </div>
                        <v-progress-linear model-value="92" color="info" height="8"></v-progress-linear>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card variant="outlined">
                    <v-card-title>Comparativo Mensal</v-card-title>
                    <v-card-text>
                      <div class="d-flex justify-space-between align-center mb-3">
                        <span>Consultas Realizadas</span>
                        <div class="text-right">
                          <div class="font-weight-bold">156</div>
                          <div class="text-success text-caption">+15% vs mês anterior</div>
                        </div>
                      </div>

                      <div class="d-flex justify-space-between align-center mb-3">
                        <span>Novos Pacientes</span>
                        <div class="text-right">
                          <div class="font-weight-bold">12</div>
                          <div class="text-success text-caption">+25% vs mês anterior</div>
                        </div>
                      </div>

                      <div class="d-flex justify-space-between align-center mb-3">
                        <span>Receita Média por Consulta</span>
                        <div class="text-right">
                          <div class="font-weight-bold">R$ 145</div>
                          <div class="text-success text-caption">+8% vs mês anterior</div>
                        </div>
                      </div>

                      <div class="d-flex justify-space-between align-center">
                        <span>Tempo Médio de Tratamento</span>
                        <div class="text-right">
                          <div class="font-weight-bold">8 sessões</div>
                          <div class="text-info text-caption">Sem alteração</div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Tendências -->
              <v-card variant="outlined" class="mt-4">
                <v-card-title>Tendências e Insights</v-card-title>
                <v-card-text>
                  <v-alert type="success" variant="tonal" class="mb-3">
                    <strong>Crescimento:</strong> A clínica teve um crescimento de 15% em consultas realizadas este mês.
                  </v-alert>
                  
                  <v-alert type="info" variant="tonal" class="mb-3">
                    <strong>Horário de Pico:</strong> O período das 14h às 16h tem a maior demanda de agendamentos.
                  </v-alert>
                  
                  <v-alert type="warning" variant="tonal" class="mb-3">
                    <strong>Atenção:</strong> Taxa de cancelamento de 12% pode ser reduzida com lembretes automáticos.
                  </v-alert>
                  
                  <v-alert type="error" variant="tonal">
                    <strong>Oportunidade:</strong> Fisioterapia tem lista de espera. Considere contratar mais profissionais.
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
    </v-container>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const activeTab = ref('financial')
const reportType = ref('Geral')
const dateFrom = ref('')
const dateTo = ref('')

const reportTypes = [
  'Geral',
  'Financeiro',
  'Agendamentos',
  'Pacientes',
  'Terapeutas',
  'Terapias'
]

const revenueByTherapy = ref([
  { name: 'Fisioterapia', revenue: '12.500', color: 'blue', icon: 'mdi-bone' },
  { name: 'Psicologia', revenue: '8.750', color: 'purple', icon: 'mdi-brain' },
  { name: 'Fonoaudiologia', revenue: '4.200', color: 'green', icon: 'mdi-ear-hearing' },
  { name: 'Terapia Ocupacional', revenue: '3.050', color: 'orange', icon: 'mdi-hand-heart' }
])

const appointmentStats = ref({
  total: 186,
  completed: 156,
  cancelled: 22,
  pending: 8
})

const therapistOccupancy = ref([
  { name: 'Dr. Carlos Lima', occupancy: 92 },
  { name: 'Dra. Ana Costa', occupancy: 88 },
  { name: 'Dra. Paula Silva', occupancy: 75 },
  { name: 'Dr. Roberto Santos', occupancy: 82 }
])

const patientStats = ref({
  total: 156,
  active: 142,
  newThisMonth: 12,
  avgAge: 34
})

const ageDistribution = ref([
  { range: '0-17 anos', count: 45, percentage: 29 },
  { range: '18-35 anos', count: 52, percentage: 33 },
  { range: '36-50 anos', count: 38, percentage: 24 },
  { range: '51+ anos', count: 21, percentage: 14 }
])

const getOccupancyColor = (value) => {
  if (value >= 90) return 'success'
  if (value >= 70) return 'warning'
  return 'error'
}

const generateReport = () => {
  console.log('Gerando relatório:', {
    type: reportType.value,
    dateFrom: dateFrom.value,
    dateTo: dateTo.value
  })
}

const exportReport = () => {
  console.log('Exportando relatório atual')
}
</script>