<template>
  <DashboardLayout>
    <v-container>
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold">Funcionários</h1>
          <p class="text-subtitle-1 text-medium-emphasis">Gerencie a equipe da clínica</p>
        </div>
        <v-btn color="primary" @click="openNewEmployeeDialog">
          <v-icon start>mdi-plus</v-icon>
          Novo Funcionário
        </v-btn>
      </div>

      <!-- Cards da equipe -->
      <v-row>
        <v-col
          v-for="employee in employees"
          :key="employee.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card class="h-100">
            <v-card-text class="text-center pa-6">
              <v-avatar size="80" class="mb-4">
                <v-img :src="employee.avatar"></v-img>
              </v-avatar>
              
              <h3 class="text-h6 mb-1">{{ employee.name }}</h3>
              <p class="text-subtitle-2 text-primary mb-2">{{ employee.role }}</p>
              <p class="text-caption text-medium-emphasis mb-3">{{ employee.specialties.join(', ') }}</p>
              
              <v-chip
                :color="employee.status === 'ativo' ? 'success' : 'error'"
                size="small"
                class="mb-3"
              >
                {{ employee.status }}
              </v-chip>
              
              <v-divider class="my-3"></v-divider>
              
              <div class="text-caption text-medium-emphasis">
                <div class="d-flex align-center justify-center mb-1">
                  <v-icon size="small" class="mr-1">mdi-email</v-icon>
                  {{ employee.email }}
                </div>
                <div class="d-flex align-center justify-center mb-1">
                  <v-icon size="small" class="mr-1">mdi-phone</v-icon>
                  {{ employee.phone }}
                </div>
                <div class="d-flex align-center justify-center">
                  <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                  {{ employee.schedule }}
                </div>
              </div>
            </v-card-text>
            
            <v-card-actions class="pa-4 pt-0">
              <v-btn size="small" variant="outlined" @click="viewEmployee(employee)">
                Ver Detalhes
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                @click="editEmployee(employee)"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Dialog para funcionário -->
      <v-dialog v-model="employeeDialog" max-width="600px">
        <v-card>
          <v-card-title>
            {{ editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário' }}
          </v-card-title>
          
          <v-card-text>
            <v-form ref="employeeForm" v-model="validForm">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="employeeForm.name"
                    label="Nome Completo"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="employeeForm.email"
                    label="E-mail"
                    type="email"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="employeeForm.phone"
                    label="Telefone"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="employeeForm.role"
                    :items="roleOptions"
                    label="Cargo"
                    variant="outlined"
                    required
                  ></v-select>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="employeeForm.schedule"
                    label="Horário de Trabalho"
                    variant="outlined"
                    placeholder="Ex: 08:00 - 17:00"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12">
                  <v-select
                    v-model="employeeForm.specialties"
                    :items="specialtyOptions"
                    label="Especialidades"
                    variant="outlined"
                    multiple
                    chips
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="closeEmployeeDialog">Cancelar</v-btn>
            <v-btn color="primary" @click="saveEmployee">Salvar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const employeeDialog = ref(false)
const editingEmployee = ref(false)
const validForm = ref(false)
const employeeForm = ref({})

const roleOptions = [
  'Fisioterapeuta',
  'Psicólogo',
  'Fonoaudiólogo',
  'Terapeuta Ocupacional',
  'Psicopedagogo',
  'Recepcionista',
  'Administrador'
]

const specialtyOptions = [
  'Fisioterapia Neurológica',
  'Fisioterapia Ortopédica',
  'Psicologia Infantil',
  'Psicologia Clínica',
  'Fonoaudiologia Infantil',
  'Terapia Ocupacional Pediátrica',
  'Psicopedagogia Clínica'
]

const employees = ref([
  {
    id: 1,
    name: 'Dr. Carlos Lima',
    role: 'Fisioterapeuta',
    email: 'carlos@clinica.com',
    phone: '(11) 98765-1001',
    avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
    specialties: ['Fisioterapia Neurológica', 'Fisioterapia Ortopédica'],
    schedule: '08:00 - 17:00',
    status: 'ativo'
  },
  {
    id: 2,
    name: 'Dra. Ana Costa',
    role: 'Psicóloga',
    email: 'ana@clinica.com',
    phone: '(11) 98765-1002',
    avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
    specialties: ['Psicologia Infantil', 'Psicologia Clínica'],
    schedule: '09:00 - 18:00',
    status: 'ativo'
  },
  {
    id: 3,
    name: 'Dra. Paula Silva',
    role: 'Fonoaudióloga',
    email: 'paula@clinica.com',
    phone: '(11) 98765-1003',
    avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
    specialties: ['Fonoaudiologia Infantil'],
    schedule: '08:00 - 16:00',
    status: 'ativo'
  },
  {
    id: 4,
    name: 'Dr. Roberto Santos',
    role: 'Terapeuta Ocupacional',
    email: 'roberto@clinica.com',
    phone: '(11) 98765-1004',
    avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
    specialties: ['Terapia Ocupacional Pediátrica'],
    schedule: '13:00 - 22:00',
    status: 'ativo'
  }
])

const openNewEmployeeDialog = () => {
  editingEmployee.value = false
  employeeForm.value = {
    name: '',
    email: '',
    phone: '',
    role: '',
    schedule: '',
    specialties: []
  }
  employeeDialog.value = true
}

const editEmployee = (employee) => {
  editingEmployee.value = true
  employeeForm.value = { ...employee }
  employeeDialog.value = true
}

const closeEmployeeDialog = () => {
  employeeDialog.value = false
  employeeForm.value = {}
}

const saveEmployee = () => {
  console.log('Salvando funcionário:', employeeForm.value)
  closeEmployeeDialog()
}

const viewEmployee = (employee) => {
  console.log('Visualizar funcionário:', employee)
}
</script>