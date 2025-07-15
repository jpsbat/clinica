<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="8" md="4">
            <v-card class="pa-6" elevation="8">
              <v-card-title class="text-center mb-4">
                <v-icon size="48" color="primary" class="mb-2">mdi-hospital</v-icon>
                <h2 class="text-h4">Clínica</h2>
                <p class="text-subtitle-1 text-medium-emphasis">Sistema de Gerenciamento</p>
              </v-card-title>

              <v-form @submit.prevent="login" ref="loginForm">
                <v-text-field
                  v-model="email"
                  label="E-mail"
                  type="email"
                  prepend-inner-icon="mdi-email"
                  variant="outlined"
                  :rules="emailRules"
                  :error-messages="emailErrorMessage"
                  required
                  class="mb-2"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  label="Senha"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword"
                  variant="outlined"
                  :rules="passwordRules"
                  :error-messages="passwordErrorMessage"
                  required
                  class="mb-4"
                ></v-text-field>

                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  :loading="loading"
                  :disabled="!isFormValid"
                  class="mb-4"
                >
                  Entrar
                </v-btn>

                <div class="text-center">
                  <v-btn variant="text" size="small" color="primary">
                    Esqueci minha senha
                  </v-btn>
                </div>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    
    <!-- Toast Container -->
    <ToastContainer />
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useField, useForm } from 'vee-validate'
import { email as emailValidator, required, min } from '@vee-validate/rules'
import ToastContainer from '@/components/ToastContainer.vue'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { success, error } = useToast()

// Configuração do VeeValidate
const { handleSubmit, resetForm } = useForm()

const { value: email, errorMessage: emailErrorMessage } = useField('email', value => {
  if (!value) return 'E-mail é obrigatório'
  if (!emailValidator(value)) return 'E-mail deve ser válido'
  return true
}, {
  initialValue: 'admin@clinica.com'
})

const { value: password, errorMessage: passwordErrorMessage } = useField('password', value => {
  if (!value) return 'Senha é obrigatória'
  if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres'
  return true
}, {
  initialValue: '123456'
})

const showPassword = ref(false)
const loading = ref(false)
const loginForm = ref(null)

const emailRules = [
  v => !!v || 'E-mail é obrigatório',
  v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido'
]

const passwordRules = [
  v => !!v || 'Senha é obrigatória',
  v => v.length >= 6 || 'Senha deve ter pelo menos 6 caracteres'
]

const isFormValid = computed(() => {
  return email.value && 
         password.value && 
         !emailErrorMessage.value && 
         !passwordErrorMessage.value
})

const login = handleSubmit(async (values) => {
  loading.value = true
  
  try {
    // Simular login
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (values.email === 'admin@clinica.com' && values.password === '123456') {
      // Salvar dados do usuário no localStorage (mock)
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Dr. João Silva',
        email: 'admin@clinica.com',
        role: 'Administrador',
        avatar: 'https://cdn.vuetifyjs.com/images/john.jpg'
      }))
      
      success('Login realizado com sucesso!')
      
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      error('Credenciais inválidas. Verifique seu e-mail e senha.')
    }
  } catch (err) {
    error('Erro interno do servidor. Tente novamente.')
  } finally {
    loading.value = false
  }
})
</script>