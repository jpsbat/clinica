<template>
  <DashboardLayout>
    <v-container>
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold">Terapias</h1>
          <p class="text-subtitle-1 text-medium-emphasis">Gerencie tipos e valores das terapias</p>
        </div>
        <v-btn color="primary" @click="openNewTherapyDialog">
          <v-icon start>mdi-plus</v-icon>
          Nova Terapia
        </v-btn>
      </div>

      <!-- Estatísticas das terapias -->
      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <p class="text-h4 font-weight-bold">{{ therapies.length }}</p>
                  <p class="text-subtitle-2">Tipos de Terapia</p>
                </div>
                <v-icon size="40" color="primary">mdi-medical-bag</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <p class="text-h4 font-weight-bold">45</p>
                  <p class="text-subtitle-2">Sessões este Mês</p>
                </div>
                <v-icon size="40" color="success">mdi-calendar-check</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <p class="text-h4 font-weight-bold">R$ 150</p>
                  <p class="text-subtitle-2">Valor Médio</p>
                </div>
                <v-icon size="40" color="warning">mdi-currency-usd</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <p class="text-h4 font-weight-bold">8.5</p>
                  <p class="text-subtitle-2">Avaliação Média</p>
                </div>
                <v-icon size="40" color="info">mdi-star</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Lista de terapias -->
      <v-row>
        <v-col
          v-for="therapy in therapies"
          :key="therapy.id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card class="h-100">
            <v-card-text>
              <div class="d-flex justify-space-between align-start mb-3">
                <v-avatar :color="therapy.color" size="56">
                  <v-icon size="28" color="white">{{ therapy.icon }}</v-icon>
                </v-avatar>
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn
                      icon="mdi-dots-vertical"
                      size="small"
                      variant="text"
                      v-bind="props"
                    ></v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="editTherapy(therapy)">
                      <v-list-item-title>Editar</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deleteTherapy(therapy)">
                      <v-list-item-title>Excluir</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>

              <h3 class="text-h6 mb-2">{{ therapy.name }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-3">{{ therapy.description }}</p>

              <v-divider class="mb-3"></v-divider>

              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-subtitle-2">Duração:</span>
                <span class="font-weight-medium">{{ therapy.duration }} min</span>
              </div>

              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-subtitle-2">Valor:</span>
                <span class="font-weight-medium text-success">R$ {{ therapy.price }}</span>
              </div>

              <div class="d-flex justify-space-between align-center mb-3">
                <span class="text-subtitle-2">Pacientes Ativos:</span>
                <span class="font-weight-medium">{{ therapy.activePatients }}</span>
              </div>

              <div class="mb-3">
                <div class="d-flex justify-space-between align-center mb-1">
                  <span class="text-subtitle-2">Avaliação:</span>
                  <div class="d-flex align-center">
                    <v-rating
                      :model-value="therapy.rating"
                      size="small"
                      density="compact"
                      readonly
                    ></v-rating>
                    <span class="ml-1 text-caption">({{ therapy.reviews }})</span>
                  </div>
                </div>
              </div>

              <v-chip
                :color="therapy.status === 'ativo' ? 'success' : 'error'"
                size="small"
                variant="elevated"
              >
                {{ therapy.status }}
              </v-chip>
            </v-card-text>

            <v-card-actions>
              <v-btn color="primary" variant="outlined" size="small" block>
                Ver Agendamentos
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Dialog para nova/editar terapia -->
      <v-dialog v-model="therapyDialog" max-width="600px">
        <v-card>
          <v-card-title>
            {{ editingTherapy ? 'Editar Terapia' : 'Nova Terapia' }}
          </v-card-title>
          
          <v-card-text>
            <v-form ref="therapyForm" v-model="validForm">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="therapyForm.name"
                    label="Nome da Terapia"
                    variant="outlined"
                    :rules="[v => !!v || 'Nome é obrigatório']"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12">
                  <v-textarea
                    v-model="therapyForm.description"
                    label="Descrição"
                    variant="outlined"
                    rows="3"
                    :rules="[v => !!v || 'Descrição é obrigatória']"
                    required
                  ></v-textarea>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="therapyForm.duration"
                    label="Duração (minutos)"
                    type="number"
                    variant="outlined"
                    :rules="[v => !!v || 'Duração é obrigatória']"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="therapyForm.price"
                    label="Valor (R$)"
                    type="number"
                    step="0.01"
                    variant="outlined"
                    :rules="[v => !!v || 'Valor é obrigatório']"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="therapyForm.color"
                    :items="colorOptions"
                    label="Cor"
                    variant="outlined"
                    required
                  >
                    <template #item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template #prepend>
                          <v-avatar :color="item.value" size="small"></v-avatar>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="therapyForm.icon"
                    :items="iconOptions"
                    label="Ícone"
                    variant="outlined"
                    required
                  >
                    <template #item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template #prepend>
                          <v-icon>{{ item.value }}</v-icon>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
                
                <v-col cols="12">
                  <v-select
                    v-model="therapyForm.category"
                    :items="categoryOptions"
                    label="Categoria"
                    variant="outlined"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="closeTherapyDialog">Cancelar</v-btn>
            <v-btn 
              color="primary" 
              @click="saveTherapy"
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
import { ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const therapyDialog = ref(false)
const editingTherapy = ref(false)
const validForm = ref(false)
const therapyForm = ref({})

const colorOptions = [
  { title: 'Azul', value: 'blue' },
  { title: 'Verde', value: 'green' },
  { title: 'Roxo', value: 'purple' },
  { title: 'Laranja', value: 'orange' },
  { title: 'Rosa', value: 'pink' },
  { title: 'Vermelho', value: 'red' }
]

const iconOptions = [
  { title: 'Cérebro', value: 'mdi-brain' },
  { title: 'Coração', value: 'mdi-heart' },
  { title: 'Osso', value: 'mdi-bone' },
  { title: 'Ouvido', value: 'mdi-ear-hearing' },
  { title: 'Olho', value: 'mdi-eye' },
  { title: 'Mão', value: 'mdi-hand-heart' }
]

const categoryOptions = [
  'Reabilitação Física',
  'Saúde Mental',
  'Desenvolvimento Infantil',
  'Comunicação',
  'Neurologia'
]

const therapies = ref([
  {
    id: 1,
    name: 'Fisioterapia',
    description: 'Tratamento para reabilitação física e melhoria da mobilidade',
    duration: 50,
    price: 120,
    color: 'blue',
    icon: 'mdi-bone',
    category: 'Reabilitação Física',
    activePatients: 25,
    rating: 4.8,
    reviews: 45,
    status: 'ativo'
  },
  {
    id: 2,
    name: 'Psicologia',
    description: 'Acompanhamento psicológico para crianças, adolescentes e adultos',
    duration: 60,
    price: 150,
    color: 'purple',
    icon: 'mdi-brain',
    category: 'Saúde Mental',
    activePatients: 30,
    rating: 4.9,
    reviews: 62,
    status: 'ativo'
  },
  {
    id: 3,
    name: 'Fonoaudiologia',
    description: 'Tratamento de distúrbios da comunicação e deglutição',
    duration: 45,
    price: 140,
    color: 'green',
    icon: 'mdi-ear-hearing',
    category: 'Comunicação',
    activePatients: 18,
    rating: 4.7,
    reviews: 28,
    status: 'ativo'
  },
  {
    id: 4,
    name: 'Terapia Ocupacional',
    description: 'Desenvolvimento de habilidades para atividades do dia a dia',
    duration: 55,
    price: 130,
    color: 'orange',
    icon: 'mdi-hand-heart',
    category: 'Reabilitação Física',
    activePatients: 22,
    rating: 4.6,
    reviews: 35,
    status: 'ativo'
  },
  {
    id: 5,
    name: 'Psicopedagogia',
    description: 'Apoio para dificuldades de aprendizagem',
    duration: 60,
    price: 160,
    color: 'pink',
    icon: 'mdi-brain',
    category: 'Desenvolvimento Infantil',
    activePatients: 15,
    rating: 4.5,
    reviews: 20,
    status: 'ativo'
  }
])

const openNewTherapyDialog = () => {
  editingTherapy.value = false
  therapyForm.value = {
    name: '',
    description: '',
    duration: '',
    price: '',
    color: '',
    icon: '',
    category: ''
  }
  therapyDialog.value = true
}

const editTherapy = (therapy) => {
  editingTherapy.value = true
  therapyForm.value = { ...therapy }
  therapyDialog.value = true
}

const closeTherapyDialog = () => {
  therapyDialog.value = false
  therapyForm.value = {}
}

const saveTherapy = () => {
  console.log('Salvando terapia:', therapyForm.value)
  closeTherapyDialog()
}

const deleteTherapy = (therapy) => {
  if (confirm('Tem certeza que deseja excluir esta terapia?')) {
    const index = therapies.value.findIndex(t => t.id === therapy.id)
    if (index > -1) {
      therapies.value.splice(index, 1)
    }
  }
}
</script>