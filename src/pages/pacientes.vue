<template>
  <DashboardLayout>
    <v-container>
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold">Pacientes</h1>
          <p class="text-subtitle-1 text-medium-emphasis">Gerencie informações dos pacientes</p>
        </div>
        <v-btn color="primary" @click="openNewPatientDialog">
          <v-icon start>mdi-plus</v-icon>
          Novo Paciente
        </v-btn>
      </div>

      <!-- Estatísticas rápidas -->
      <v-row class="mb-6">
        <v-col cols="12" sm="4">
          <v-card>
            <v-card-text>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <p class="text-h4 font-weight-bold">{{ patients.length }}</p>
                  <p class="text-subtitle-2">Total de Pacientes</p>
                </div>
                <v-icon size="40" color="primary">mdi-account-group</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card>
            <v-card-text>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <p class="text-h4 font-weight-bold">{{ activePatients }}</p>
                  <p class="text-subtitle-2">Pacientes Ativos</p>
                </div>
                <v-icon size="40" color="success">mdi-account-check</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card>
            <v-card-text>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <p class="text-h4 font-weight-bold">3</p>
                  <p class="text-subtitle-2">Novos este mês</p>
                </div>
                <v-icon size="40" color="info">mdi-account-plus</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filtros -->
      <v-card class="mb-6">
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="search"
                label="Buscar paciente"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="filterStatus"
                :items="['ativo', 'inativo']"
                label="Status"
                variant="outlined"
                density="compact"
                clearable
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="filterTherapy"
                :items="therapyTypes"
                label="Tipo de Terapia"
                variant="outlined"
                density="compact"
                clearable
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Lista de pacientes -->
      <v-card>
        <v-data-table
          :headers="headers"
          :items="filteredPatients"
          :search="search"
          :loading="loading"
          class="elevation-1"
        >
          <template #item.patient="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="40" class="mr-3">
                <v-img :src="item.avatar"></v-img>
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ item.name }}</div>
                <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
              </div>
            </div>
          </template>

          <template #item.contact="{ item }">
            <div>
              <div>{{ item.phone }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.age }} anos</div>
            </div>
          </template>

          <template #item.therapy="{ item }">
            <v-chip
              v-for="therapy in item.therapies"
              :key="therapy"
              size="small"
              class="mr-1 mb-1"
            >
              {{ therapy }}
            </v-chip>
          </template>

          <template #item.status="{ item }">
            <v-chip
              :color="item.status === 'ativo' ? 'success' : 'error'"
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
              @click="viewPatient(item)"
            ></v-btn>
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="editPatient(item)"
            ></v-btn>
            <v-btn
              icon="mdi-calendar"
              size="small"
              variant="text"
              color="primary"
              @click="scheduleAppointment(item)"
            ></v-btn>
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="deletePatient(item)"
            ></v-btn>
          </template>
        </v-data-table>
      </v-card>

      <!-- Dialog para novo/editar paciente -->
      <v-dialog v-model="patientDialog" max-width="800px">
        <v-card>
          <v-card-title>
            {{ editingPatient ? 'Editar Paciente' : 'Novo Paciente' }}
          </v-card-title>
          
          <v-card-text>
            <v-form ref="patientForm" v-model="validForm">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="patientForm.name"
                    label="Nome Completo"
                    variant="outlined"
                    :rules="[v => !!v || 'Nome é obrigatório']"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="patientForm.email"
                    label="E-mail"
                    type="email"
                    variant="outlined"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="patientForm.phone"
                    label="Telefone"
                    variant="outlined"
                    :rules="[v => !!v || 'Telefone é obrigatório']"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="patientForm.birthDate"
                    label="Data de Nascimento"
                    type="date"
                    variant="outlined"
                    :rules="[v => !!v || 'Data de nascimento é obrigatória']"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="patientForm.cpf"
                    label="CPF"
                    variant="outlined"
                    :rules="[v => !!v || 'CPF é obrigatório']"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="patientForm.gender"
                    :items="['Masculino', 'Feminino', 'Outro']"
                    label="Gênero"
                    variant="outlined"
                    required
                  ></v-select>
                </v-col>
                
                <v-col cols="12">
                  <v-select
                    v-model="patientForm.therapies"
                    :items="therapyTypes"
                    label="Terapias"
                    variant="outlined"
                    multiple
                    chips
                  ></v-select>
                </v-col>
                
                <v-col cols="12">
                  <v-text-field
                    v-model="patientForm.address"
                    label="Endereço"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12">
                  <v-textarea
                    v-model="patientForm.notes"
                    label="Observações Médicas"
                    variant="outlined"
                    rows="3"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="closePatientDialog">Cancelar</v-btn>
            <v-btn 
              color="primary" 
              @click="savePatient"
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
import { ref, computed } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const loading = ref(false)
const search = ref('')
const filterStatus = ref('')
const filterTherapy = ref('')
const patientDialog = ref(false)
const editingPatient = ref(false)
const validForm = ref(false)
const patientForm = ref({})

const headers = [
  { title: 'Paciente', key: 'patient', sortable: true },
  { title: 'Contato', key: 'contact', sortable: true },
  { title: 'Terapias', key: 'therapy', sortable: false },
  { title: 'Última Consulta', key: 'lastAppointment', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

const therapyTypes = ['Fisioterapia', 'Psicologia', 'Fonoaudiologia', 'Terapia Ocupacional', 'Psicopedagogia']

const emailRules = [
  v => !!v || 'E-mail é obrigatório',
  v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido'
]

const patients = ref([
  {
    id: 1,
    name: 'Maria Silva',
    email: 'maria@email.com',
    phone: '(11) 98765-4321',
    age: 35,
    avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
    therapies: ['Fisioterapia', 'Psicologia'],
    lastAppointment: '10/07/2025',
    status: 'ativo'
  },
  {
    id: 2,
    name: 'João Santos',
    email: 'joao@email.com',
    phone: '(11) 98765-4322',
    age: 42,
    avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
    therapies: ['Psicologia'],
    lastAppointment: '08/07/2025',
    status: 'ativo'
  },
  {
    id: 3,
    name: 'Ana Costa',
    email: 'ana@email.com',
    phone: '(11) 98765-4323',
    age: 28,
    avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
    therapies: ['Fonoaudiologia'],
    lastAppointment: '12/07/2025',
    status: 'ativo'
  },
  {
    id: 4,
    name: 'Pedro Lima',
    email: 'pedro@email.com',
    phone: '(11) 98765-4324',
    age: 55,
    avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
    therapies: ['Terapia Ocupacional'],
    lastAppointment: '05/07/2025',
    status: 'inativo'
  }
])

const activePatients = computed(() => {
  return patients.value.filter(p => p.status === 'ativo').length
})

const filteredPatients = computed(() => {
  let filtered = patients.value

  if (filterStatus.value) {
    filtered = filtered.filter(p => p.status === filterStatus.value)
  }

  if (filterTherapy.value) {
    filtered = filtered.filter(p => p.therapies.includes(filterTherapy.value))
  }

  return filtered
})

const openNewPatientDialog = () => {
  editingPatient.value = false
  patientForm.value = {
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    cpf: '',
    gender: '',
    therapies: [],
    address: '',
    notes: ''
  }
  patientDialog.value = true
}

const editPatient = (patient) => {
  editingPatient.value = true
  patientForm.value = { ...patient }
  patientDialog.value = true
}

const closePatientDialog = () => {
  patientDialog.value = false
  patientForm.value = {}
}

const savePatient = () => {
  console.log('Salvando paciente:', patientForm.value)
  closePatientDialog()
}

const viewPatient = (patient) => {
  console.log('Visualizar paciente:', patient)
}

const scheduleAppointment = (patient) => {
  console.log('Agendar consulta para:', patient)
}

const deletePatient = (patient) => {
  if (confirm('Tem certeza que deseja excluir este paciente?')) {
    const index = patients.value.findIndex(p => p.id === patient.id)
    if (index > -1) {
      patients.value.splice(index, 1)
    }
  }
}
</script>