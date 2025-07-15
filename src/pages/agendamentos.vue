<template>
  <DashboardLayout>
    <v-container>
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold">Agendamentos</h1>
          <p class="text-subtitle-1 text-medium-emphasis">Gerencie consultas e terapias</p>
        </div>
        <v-btn color="primary" @click="openNewAppointmentDialog">
          <v-icon start>mdi-plus</v-icon>
          Novo Agendamento
        </v-btn>
      </div>

      <!-- Filtros -->
      <v-card class="mb-6">
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="search"
                label="Buscar paciente"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filterStatus"
                :items="statusOptions"
                label="Status"
                variant="outlined"
                density="compact"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filterTherapist"
                :items="therapistOptions"
                label="Terapeuta"
                variant="outlined"
                density="compact"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="filterDate"
                label="Data"
                type="date"
                variant="outlined"
                density="compact"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Tabela de agendamentos -->
      <v-card>
        <v-data-table
          :headers="headers"
          :items="filteredAppointments"
          :search="search"
          :loading="loading"
          class="elevation-1"
        >
          <template #item.patient="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="32" class="mr-3">
                <v-img :src="item.avatar"></v-img>
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ item.patient }}</div>
                <div class="text-caption text-medium-emphasis">{{ item.phone }}</div>
              </div>
            </div>
          </template>

          <template #item.datetime="{ item }">
            <div>
              <div class="font-weight-medium">{{ formatDate(item.date) }}</div>
              <div class="text-caption">{{ item.time }}</div>
            </div>
          </template>

          <template #item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="small"
              variant="elevated"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-btn
              icon="mdi-eye"
              size="small"
              variant="text"
              @click="viewAppointment(item)"
            ></v-btn>
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="editAppointment(item)"
            ></v-btn>
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="deleteAppointment(item)"
            ></v-btn>
          </template>
        </v-data-table>
      </v-card>

      <!-- Dialog para novo/editar agendamento -->
      <v-dialog v-model="appointmentDialog" max-width="600px">
        <v-card>
          <v-card-title>
            {{ editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento' }}
          </v-card-title>
          
          <v-card-text>
            <v-form ref="appointmentForm" v-model="validForm">
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="appointmentForm.patientId"
                    :items="patientOptions"
                    item-title="name"
                    item-value="id"
                    label="Paciente"
                    variant="outlined"
                    :rules="[v => !!v || 'Paciente é obrigatório']"
                    required
                  ></v-autocomplete>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="appointmentForm.date"
                    label="Data"
                    type="date"
                    variant="outlined"
                    :rules="[v => !!v || 'Data é obrigatória']"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="appointmentForm.time"
                    label="Horário"
                    type="time"
                    variant="outlined"
                    :rules="[v => !!v || 'Horário é obrigatório']"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12">
                  <v-select
                    v-model="appointmentForm.therapy"
                    :items="therapyOptions"
                    label="Tipo de Terapia"
                    variant="outlined"
                    :rules="[v => !!v || 'Terapia é obrigatória']"
                    required
                  ></v-select>
                </v-col>
                
                <v-col cols="12">
                  <v-select
                    v-model="appointmentForm.therapistId"
                    :items="therapistOptions"
                    item-title="name"
                    item-value="id"
                    label="Terapeuta"
                    variant="outlined"
                    :rules="[v => !!v || 'Terapeuta é obrigatório']"
                    required
                  ></v-select>
                </v-col>
                
                <v-col cols="12">
                  <v-textarea
                    v-model="appointmentForm.notes"
                    label="Observações"
                    variant="outlined"
                    rows="3"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="closeAppointmentDialog">Cancelar</v-btn>
            <v-btn 
              color="primary" 
              @click="saveAppointment"
              :disabled="!validForm"
            >
              Salvar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const loading = ref(false)
const search = ref('')
const filterStatus = ref('')
const filterTherapist = ref('')
const filterDate = ref('')
const appointmentDialog = ref(false)
const editingAppointment = ref(false)
const validForm = ref(false)
const appointmentForm = ref({})

const headers = [
  { title: 'Paciente', key: 'patient', sortable: true },
  { title: 'Data/Hora', key: 'datetime', sortable: true },
  { title: 'Terapia', key: 'therapy', sortable: true },
  { title: 'Terapeuta', key: 'therapist', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

const appointments = ref([
  {
    id: 1,
    patient: 'Maria Silva',
    phone: '(11) 98765-4321',
    avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
    date: '2025-07-15',
    time: '09:00',
    therapy: 'Fisioterapia',
    therapist: 'Dr. Carlos Lima',
    status: 'confirmado'
  },
  {
    id: 2,
    patient: 'João Santos',
    phone: '(11) 98765-4322',
    avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
    date: '2025-07-15',
    time: '10:30',
    therapy: 'Psicologia',
    therapist: 'Dra. Ana Costa',
    status: 'pendente'
  },
  {
    id: 3,
    patient: 'Ana Costa',
    phone: '(11) 98765-4323',
    avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
    date: '2025-07-15',
    time: '14:00',
    therapy: 'Fonoaudiologia',
    therapist: 'Dra. Paula Silva',
    status: 'confirmado'
  },
  {
    id: 4,
    patient: 'Pedro Lima',
    phone: '(11) 98765-4324',
    avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
    date: '2025-07-16',
    time: '15:30',
    therapy: 'Terapia Ocupacional',
    therapist: 'Dr. Roberto Santos',
    status: 'cancelado'
  }
])

const statusOptions = ['confirmado', 'pendente', 'cancelado', 'concluído']
const therapyOptions = ['Fisioterapia', 'Psicologia', 'Fonoaudiologia', 'Terapia Ocupacional', 'Psicopedagogia']

const therapistOptions = ref([
  { id: 1, name: 'Dr. Carlos Lima' },
  { id: 2, name: 'Dra. Ana Costa' },
  { id: 3, name: 'Dra. Paula Silva' },
  { id: 4, name: 'Dr. Roberto Santos' }
])

const patientOptions = ref([
  { id: 1, name: 'Maria Silva' },
  { id: 2, name: 'João Santos' },
  { id: 3, name: 'Ana Costa' },
  { id: 4, name: 'Pedro Lima' }
])

const filteredAppointments = computed(() => {
  let filtered = appointments.value

  if (filterStatus.value) {
    filtered = filtered.filter(app => app.status === filterStatus.value)
  }

  if (filterTherapist.value) {
    filtered = filtered.filter(app => app.therapist === filterTherapist.value)
  }

  if (filterDate.value) {
    filtered = filtered.filter(app => app.date === filterDate.value)
  }

  return filtered
})

const formatDate = (date) => {
  return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')
}

const getStatusColor = (status) => {
  const colors = {
    'confirmado': 'success',
    'pendente': 'warning',
    'cancelado': 'error',
    'concluído': 'info'
  }
  return colors[status] || 'grey'
}

const openNewAppointmentDialog = () => {
  editingAppointment.value = false
  appointmentForm.value = {
    patientId: '',
    date: '',
    time: '',
    therapy: '',
    therapistId: '',
    notes: ''
  }
  appointmentDialog.value = true
}

const editAppointment = (appointment) => {
  editingAppointment.value = true
  appointmentForm.value = { ...appointment }
  appointmentDialog.value = true
}

const closeAppointmentDialog = () => {
  appointmentDialog.value = false
  appointmentForm.value = {}
}

const saveAppointment = () => {
  console.log('Salvando agendamento:', appointmentForm.value)
  closeAppointmentDialog()
}

const viewAppointment = (appointment) => {
  console.log('Visualizar agendamento:', appointment)
}

const deleteAppointment = (appointment) => {
  if (confirm('Tem certeza que deseja excluir este agendamento?')) {
    const index = appointments.value.findIndex(a => a.id === appointment.id)
    if (index > -1) {
      appointments.value.splice(index, 1)
    }
  }
}
</script>