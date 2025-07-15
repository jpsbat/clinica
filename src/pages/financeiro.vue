<template>
  <DashboardLayout>
    <v-container>
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold">Financeiro</h1>
          <p class="text-subtitle-1 text-medium-emphasis">Controle financeiro da clínica</p>
        </div>
        <div class="d-flex gap-2">
          <v-btn color="success" @click="openNewReceiptDialog">
            <v-icon start>mdi-plus</v-icon>
            Nova Receita
          </v-btn>
          <v-btn color="error" @click="openNewExpenseDialog">
            <v-icon start>mdi-minus</v-icon>
            Nova Despesa
          </v-btn>
        </div>
      </div>

      <!-- Cards de resumo financeiro -->
      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <p class="text-h4 font-weight-bold text-success">R$ 28.500</p>
                  <p class="text-subtitle-2">Receita Mensal</p>
                  <p class="text-success text-caption">
                    <v-icon size="small">mdi-trending-up</v-icon>
                    +15% vs mês anterior
                  </p>
                </div>
                <v-avatar color="success" size="56">
                  <v-icon size="28">mdi-trending-up</v-icon>
                </v-avatar>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <p class="text-h4 font-weight-bold text-error">R$ 12.300</p>
                  <p class="text-subtitle-2">Despesas Mensais</p>
                  <p class="text-error text-caption">
                    <v-icon size="small">mdi-trending-up</v-icon>
                    +5% vs mês anterior
                  </p>
                </div>
                <v-avatar color="error" size="56">
                  <v-icon size="28">mdi-trending-down</v-icon>
                </v-avatar>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <p class="text-h4 font-weight-bold text-primary">R$ 16.200</p>
                  <p class="text-subtitle-2">Lucro Líquido</p>
                  <p class="text-success text-caption">
                    <v-icon size="small">mdi-trending-up</v-icon>
                    +25% vs mês anterior
                  </p>
                </div>
                <v-avatar color="primary" size="56">
                  <v-icon size="28">mdi-currency-usd</v-icon>
                </v-avatar>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <p class="text-h4 font-weight-bold text-warning">R$ 3.500</p>
                  <p class="text-subtitle-2">Contas a Receber</p>
                  <p class="text-warning text-caption">
                    <v-icon size="small">mdi-clock</v-icon>
                    Vencimento próximo
                  </p>
                </div>
                <v-avatar color="warning" size="56">
                  <v-icon size="28">mdi-clock-alert</v-icon>
                </v-avatar>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- Gráfico de receitas vs despesas -->
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
              <span>Receitas vs Despesas</span>
              <v-select
                v-model="chartPeriod"
                :items="['Últimos 7 dias', 'Último mês', 'Últimos 3 meses']"
                density="compact"
                variant="outlined"
                style="max-width: 200px;"
              ></v-select>
            </v-card-title>
            <v-card-text>
              <div class="text-center pa-12">
                <v-icon size="64" color="grey-lighten-2">mdi-chart-line</v-icon>
                <p class="text-h6 mt-4 text-grey">Gráfico será implementado aqui</p>
                <p class="text-body-2 text-grey">Receitas: R$ 28.500 | Despesas: R$ 12.300</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Resumo por categoria -->
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Despesas por Categoria</v-card-title>
            <v-card-text>
              <div
                v-for="expense in expensesByCategory"
                :key="expense.category"
                class="d-flex justify-space-between align-center mb-3"
              >
                <div class="d-flex align-center">
                  <v-avatar :color="expense.color" size="32" class="mr-3">
                    <v-icon size="16" color="white">{{ expense.icon }}</v-icon>
                  </v-avatar>
                  <div>
                    <div class="font-weight-medium">{{ expense.category }}</div>
                    <div class="text-caption text-medium-emphasis">{{ expense.percentage }}%</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-weight-medium">R$ {{ expense.amount }}</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Últimas transações -->
      <v-card class="mt-6">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Últimas Transações</span>
          <div class="d-flex gap-2">
            <v-btn-toggle v-model="transactionFilter" mandatory>
              <v-btn size="small" value="all">Todas</v-btn>
              <v-btn size="small" value="income">Receitas</v-btn>
              <v-btn size="small" value="expense">Despesas</v-btn>
            </v-btn-toggle>
          </div>
        </v-card-title>

        <v-data-table
          :headers="transactionHeaders"
          :items="filteredTransactions"
          :loading="loading"
          class="elevation-1"
        >
          <template #item.type="{ item }">
            <v-chip
              :color="item.type === 'receita' ? 'success' : 'error'"
              size="small"
              variant="elevated"
            >
              <v-icon
                start
                size="small"
                :icon="item.type === 'receita' ? 'mdi-plus' : 'mdi-minus'"
              ></v-icon>
              {{ item.type }}
            </v-chip>
          </template>

          <template #item.amount="{ item }">
            <span
              :class="item.type === 'receita' ? 'text-success' : 'text-error'"
              class="font-weight-bold"
            >
              {{ item.type === 'receita' ? '+' : '-' }}R$ {{ item.amount }}
            </span>
          </template>

          <template #item.date="{ item }">
            {{ formatDate(item.date) }}
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
              @click="viewTransaction(item)"
            ></v-btn>
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              @click="editTransaction(item)"
            ></v-btn>
          </template>
        </v-data-table>
      </v-card>

      <!-- Dialog para nova receita/despesa -->
      <v-dialog v-model="financialDialog" max-width="600px">
        <v-card>
          <v-card-title>
            {{ dialogType === 'receita' ? 'Nova Receita' : 'Nova Despesa' }}
          </v-card-title>
          
          <v-card-text>
            <v-form ref="financialForm" v-model="validForm">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="financialForm.description"
                    label="Descrição"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="financialForm.amount"
                    label="Valor (R$)"
                    type="number"
                    step="0.01"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="financialForm.date"
                    label="Data"
                    type="date"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="financialForm.category"
                    :items="dialogType === 'receita' ? revenueCategories : expenseCategories"
                    label="Categoria"
                    variant="outlined"
                    required
                  ></v-select>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="financialForm.paymentMethod"
                    :items="paymentMethods"
                    label="Forma de Pagamento"
                    variant="outlined"
                    required
                  ></v-select>
                </v-col>
                
                <v-col cols="12">
                  <v-textarea
                    v-model="financialForm.notes"
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
            <v-btn @click="closeFinancialDialog">Cancelar</v-btn>
            <v-btn 
              :color="dialogType === 'receita' ? 'success' : 'error'"
              @click="saveTransaction"
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
const chartPeriod = ref('Último mês')
const transactionFilter = ref('all')
const financialDialog = ref(false)
const dialogType = ref('receita')
const validForm = ref(false)
const financialForm = ref({})

const transactionHeaders = [
  { title: 'Tipo', key: 'type', sortable: true },
  { title: 'Descrição', key: 'description', sortable: true },
  { title: 'Categoria', key: 'category', sortable: true },
  { title: 'Valor', key: 'amount', sortable: true },
  { title: 'Data', key: 'date', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

const expensesByCategory = ref([
  {
    category: 'Salários',
    amount: '8.500',
    percentage: 69,
    color: 'blue',
    icon: 'mdi-account-group'
  },
  {
    category: 'Aluguel',
    amount: '2.500',
    percentage: 20,
    color: 'orange',
    icon: 'mdi-home'
  },
  {
    category: 'Equipamentos',
    amount: '800',
    percentage: 7,
    color: 'purple',
    icon: 'mdi-medical-bag'
  },
  {
    category: 'Outros',
    amount: '500',
    percentage: 4,
    color: 'grey',
    icon: 'mdi-dots-horizontal'
  }
])

const transactions = ref([
  {
    id: 1,
    type: 'receita',
    description: 'Consulta - Maria Silva',
    category: 'Fisioterapia',
    amount: '120.00',
    date: '2025-07-15',
    status: 'pago',
    paymentMethod: 'Cartão'
  },
  {
    id: 2,
    type: 'receita',
    description: 'Consulta - João Santos',
    category: 'Psicologia',
    amount: '150.00',
    date: '2025-07-15',
    status: 'pendente',
    paymentMethod: 'Pix'
  },
  {
    id: 3,
    type: 'despesa',
    description: 'Salário - Dr. Carlos',
    category: 'Salários',
    amount: '4.500.00',
    date: '2025-07-14',
    status: 'pago',
    paymentMethod: 'Transferência'
  },
  {
    id: 4,
    type: 'despesa',
    description: 'Aluguel da Clínica',
    category: 'Aluguel',
    amount: '2.500.00',
    date: '2025-07-13',
    status: 'pago',
    paymentMethod: 'Boleto'
  }
])

const revenueCategories = ['Fisioterapia', 'Psicologia', 'Fonoaudiologia', 'Terapia Ocupacional', 'Outros']
const expenseCategories = ['Salários', 'Aluguel', 'Equipamentos', 'Material', 'Marketing', 'Outros']
const paymentMethods = ['Dinheiro', 'Cartão', 'Pix', 'Transferência', 'Boleto']

const filteredTransactions = computed(() => {
  if (transactionFilter.value === 'all') return transactions.value
  if (transactionFilter.value === 'income') return transactions.value.filter(t => t.type === 'receita')
  if (transactionFilter.value === 'expense') return transactions.value.filter(t => t.type === 'despesa')
  return transactions.value
})

const formatDate = (date) => {
  return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR')
}

const getStatusColor = (status) => {
  const colors = {
    'pago': 'success',
    'pendente': 'warning',
    'vencido': 'error'
  }
  return colors[status] || 'grey'
}

const openNewReceiptDialog = () => {
  dialogType.value = 'receita'
  financialForm.value = {
    description: '',
    amount: '',
    date: '',
    category: '',
    paymentMethod: '',
    notes: ''
  }
  financialDialog.value = true
}

const openNewExpenseDialog = () => {
  dialogType.value = 'despesa'
  financialForm.value = {
    description: '',
    amount: '',
    date: '',
    category: '',
    paymentMethod: '',
    notes: ''
  }
  financialDialog.value = true
}

const closeFinancialDialog = () => {
  financialDialog.value = false
  financialForm.value = {}
}

const saveTransaction = () => {
  console.log('Salvando transação:', financialForm.value)
  closeFinancialDialog()
}

const viewTransaction = (transaction) => {
  console.log('Visualizar transação:', transaction)
}

const editTransaction = (transaction) => {
  console.log('Editar transação:', transaction)
}
</script>