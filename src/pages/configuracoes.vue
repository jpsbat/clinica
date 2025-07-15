<template>
  <DashboardLayout>
    <v-container>
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold">Configurações</h1>
          <p class="text-subtitle-1 text-medium-emphasis">Gerencie as configurações do sistema</p>
        </div>
        <v-btn color="primary" @click="saveAllSettings">
          <v-icon start>mdi-content-save</v-icon>
          Salvar Alterações
        </v-btn>
      </div>

      <v-row>
        <!-- Menu lateral de configurações -->
        <v-col cols="12" md="3">
          <v-card>
            <v-list nav density="compact">
              <v-list-item
                v-for="section in configSections"
                :key="section.value"
                :title="section.title"
                :prepend-icon="section.icon"
                :value="section.value"
                @click="activeSection = section.value"
                :active="activeSection === section.value"
                rounded="xl"
                class="ma-2"
              ></v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- Conteúdo das configurações -->
        <v-col cols="12" md="9">
          <!-- Configurações Gerais -->
          <v-card v-if="activeSection === 'general'">
            <v-card-title>Configurações Gerais</v-card-title>
            <v-card-text>
              <v-form>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="settings.general.clinicName"
                      label="Nome da Clínica"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="settings.general.cnpj"
                      label="CNPJ"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="settings.general.address"
                      label="Endereço"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="settings.general.phone"
                      label="Telefone"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="settings.general.email"
                      label="E-mail"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-file-input
                      label="Logo da Clínica"
                      variant="outlined"
                      prepend-icon="mdi-image"
                      accept="image/*"
                    ></v-file-input>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Configurações de Agendamento -->
          <v-card v-if="activeSection === 'scheduling'">
            <v-card-title>Configurações de Agendamento</v-card-title>
            <v-card-text>
              <v-form>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="settings.scheduling.sessionDuration"
                      label="Duração Padrão da Sessão (min)"
                      type="number"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="settings.scheduling.intervalBetweenSessions"
                      label="Intervalo Entre Sessões (min)"
                      type="number"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="settings.scheduling.workStartTime"
                      label="Horário de Início"
                      type="time"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="settings.scheduling.workEndTime"
                      label="Horário de Término"
                      type="time"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="settings.scheduling.workDays"
                      :items="weekDays"
                      label="Dias de Funcionamento"
                      variant="outlined"
                      multiple
                      chips
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-switch
                      v-model="settings.scheduling.allowSameDayBooking"
                      label="Permitir agendamento no mesmo dia"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12">
                    <v-switch
                      v-model="settings.scheduling.enableReminders"
                      label="Enviar lembretes automáticos"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" v-if="settings.scheduling.enableReminders">
                    <v-text-field
                      v-model="settings.scheduling.reminderHours"
                      label="Lembrete (horas antes)"
                      type="number"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Configurações de Notificações -->
          <v-card v-if="activeSection === 'notifications'">
            <v-card-title>Configurações de Notificações</v-card-title>
            <v-card-text>
              <v-form>
                <div class="mb-4">
                  <h4 class="text-h6 mb-3">E-mail</h4>
                  <v-switch
                    v-model="settings.notifications.email.enabled"
                    label="Ativar notificações por e-mail"
                    color="primary"
                    class="mb-2"
                  ></v-switch>
                  <v-switch
                    v-model="settings.notifications.email.newAppointment"
                    label="Novos agendamentos"
                    color="primary"
                    :disabled="!settings.notifications.email.enabled"
                  ></v-switch>
                  <v-switch
                    v-model="settings.notifications.email.cancellation"
                    label="Cancelamentos"
                    color="primary"
                    :disabled="!settings.notifications.email.enabled"
                  ></v-switch>
                  <v-switch
                    v-model="settings.notifications.email.payment"
                    label="Pagamentos recebidos"
                    color="primary"
                    :disabled="!settings.notifications.email.enabled"
                  ></v-switch>
                </div>

                <v-divider class="my-4"></v-divider>

                <div class="mb-4">
                  <h4 class="text-h6 mb-3">WhatsApp</h4>
                  <v-switch
                    v-model="settings.notifications.whatsapp.enabled"
                    label="Ativar notificações por WhatsApp"
                    color="primary"
                    class="mb-2"
                  ></v-switch>
                  <v-text-field
                    v-model="settings.notifications.whatsapp.apiKey"
                    label="API Key do WhatsApp"
                    variant="outlined"
                    :disabled="!settings.notifications.whatsapp.enabled"
                    class="mb-2"
                  ></v-text-field>
                  <v-switch
                    v-model="settings.notifications.whatsapp.reminders"
                    label="Lembretes de consulta"
                    color="primary"
                    :disabled="!settings.notifications.whatsapp.enabled"
                  ></v-switch>
                  <v-switch
                    v-model="settings.notifications.whatsapp.confirmations"
                    label="Confirmações de agendamento"
                    color="primary"
                    :disabled="!settings.notifications.whatsapp.enabled"
                  ></v-switch>
                </div>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Configurações Financeiras -->
          <v-card v-if="activeSection === 'financial'">
            <v-card-title>Configurações Financeiras</v-card-title>
            <v-card-text>
              <v-form>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="settings.financial.currency"
                      :items="currencies"
                      label="Moeda"
                      variant="outlined"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="settings.financial.taxRate"
                      label="Taxa de Imposto (%)"
                      type="number"
                      step="0.01"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="settings.financial.paymentMethods"
                      :items="paymentMethods"
                      label="Formas de Pagamento Aceitas"
                      variant="outlined"
                      multiple
                      chips
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-switch
                      v-model="settings.financial.allowPartialPayments"
                      label="Permitir pagamentos parciais"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12">
                    <v-switch
                      v-model="settings.financial.autoGenerateInvoices"
                      label="Gerar notas fiscais automaticamente"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="settings.financial.lateFeePercentage"
                      label="Taxa de Juros por Atraso (%)"
                      type="number"
                      step="0.01"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="settings.financial.gracePeriodDays"
                      label="Período de Carência (dias)"
                      type="number"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Configurações de Segurança -->
          <v-card v-if="activeSection === 'security'">
            <v-card-title>Configurações de Segurança</v-card-title>
            <v-card-text>
              <v-form>
                <v-row>
                  <v-col cols="12">
                    <h4 class="text-h6 mb-3">Política de Senhas</h4>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="settings.security.minPasswordLength"
                      label="Tamanho Mínimo da Senha"
                      type="number"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="settings.security.passwordExpirationDays"
                      label="Expiração da Senha (dias)"
                      type="number"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-switch
                      v-model="settings.security.requireSpecialChars"
                      label="Exigir caracteres especiais"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12">
                    <v-switch
                      v-model="settings.security.requireNumbers"
                      label="Exigir números"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12">
                    <v-switch
                      v-model="settings.security.enableTwoFactor"
                      label="Autenticação de dois fatores"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12">
                    <v-switch
                      v-model="settings.security.logUserActivity"
                      label="Registrar atividades do usuário"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="settings.security.sessionTimeoutMinutes"
                      label="Timeout da Sessão (minutos)"
                      type="number"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="settings.security.maxLoginAttempts"
                      label="Máximo de Tentativas de Login"
                      type="number"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Backup e Restore -->
          <v-card v-if="activeSection === 'backup'">
            <v-card-title>Backup e Restore</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <h4 class="text-h6 mb-3">Backup Automático</h4>
                  <v-switch
                    v-model="settings.backup.autoBackup"
                    label="Ativar backup automático"
                    color="primary"
                    class="mb-3"
                  ></v-switch>
                  
                  <v-select
                    v-model="settings.backup.frequency"
                    :items="backupFrequencies"
                    label="Frequência do Backup"
                    variant="outlined"
                    :disabled="!settings.backup.autoBackup"
                    class="mb-3"
                  ></v-select>
                  
                  <v-text-field
                    v-model="settings.backup.retentionDays"
                    label="Reter backups por (dias)"
                    type="number"
                    variant="outlined"
                    :disabled="!settings.backup.autoBackup"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-divider class="my-4"></v-divider>
                  <h4 class="text-h6 mb-3">Ações Manuais</h4>
                  
                  <div class="d-flex gap-4 mb-4">
                    <v-btn color="primary" @click="createBackup">
                      <v-icon start>mdi-backup-restore</v-icon>
                      Criar Backup
                    </v-btn>
                    
                    <v-btn color="warning" @click="restoreBackup">
                      <v-icon start>mdi-restore</v-icon>
                      Restaurar Backup
                    </v-btn>
                  </div>

                  <v-alert type="info" variant="tonal">
                    <strong>Último backup:</strong> 14/07/2025 às 23:30<br>
                    <strong>Status:</strong> Sucesso<br>
                    <strong>Tamanho:</strong> 45.2 MB
                  </v-alert>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const activeSection = ref('general')

const configSections = [
  { title: 'Geral', value: 'general', icon: 'mdi-cog' },
  { title: 'Agendamentos', value: 'scheduling', icon: 'mdi-calendar' },
  { title: 'Notificações', value: 'notifications', icon: 'mdi-bell' },
  { title: 'Financeiro', value: 'financial', icon: 'mdi-currency-usd' },
  { title: 'Segurança', value: 'security', icon: 'mdi-shield' },
  { title: 'Backup', value: 'backup', icon: 'mdi-backup-restore' }
]

const weekDays = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo'
]

const currencies = ['BRL - Real', 'USD - Dólar', 'EUR - Euro']
const paymentMethods = ['Dinheiro', 'Cartão de Débito', 'Cartão de Crédito', 'Pix', 'Transferência', 'Boleto']
const backupFrequencies = ['Diário', 'Semanal', 'Mensal']

const settings = ref({
  general: {
    clinicName: 'Clínica Terapia',
    cnpj: '12.345.678/0001-90',
    address: 'Rua das Flores, 123 - Centro',
    phone: '(11) 3456-7890',
    email: 'contato@clinica.com'
  },
  scheduling: {
    sessionDuration: 50,
    intervalBetweenSessions: 10,
    workStartTime: '08:00',
    workEndTime: '18:00',
    workDays: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'],
    allowSameDayBooking: false,
    enableReminders: true,
    reminderHours: 24
  },
  notifications: {
    email: {
      enabled: true,
      newAppointment: true,
      cancellation: true,
      payment: true
    },
    whatsapp: {
      enabled: false,
      apiKey: '',
      reminders: false,
      confirmations: false
    }
  },
  financial: {
    currency: 'BRL - Real',
    taxRate: 15.5,
    paymentMethods: ['Dinheiro', 'Cartão de Crédito', 'Pix'],
    allowPartialPayments: true,
    autoGenerateInvoices: false,
    lateFeePercentage: 2.0,
    gracePeriodDays: 5
  },
  security: {
    minPasswordLength: 8,
    passwordExpirationDays: 90,
    requireSpecialChars: true,
    requireNumbers: true,
    enableTwoFactor: false,
    logUserActivity: true,
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 3
  },
  backup: {
    autoBackup: true,
    frequency: 'Diário',
    retentionDays: 30
  }
})

const saveAllSettings = () => {
  console.log('Salvando todas as configurações:', settings.value)
}

const createBackup = () => {
  console.log('Criando backup manual...')
}

const restoreBackup = () => {
  console.log('Iniciando processo de restore...')
}
</script>