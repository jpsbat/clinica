<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="pa-8 text-center" elevation="8">
              <v-icon size="120" color="error" class="mb-4">
                mdi-lock-alert
              </v-icon>
              
              <v-card-title class="text-h4 mb-2">
                Acesso Negado
              </v-card-title>
              
              <v-card-text class="text-body-1 mb-6">
                Você não tem permissão para acessar esta página. 
                É necessário fazer login para continuar.
              </v-card-text>
              
              <v-btn
                color="primary"
                size="large"
                @click="goToLogin"
                class="mb-3"
              >
                <v-icon left>mdi-login</v-icon>
                Fazer Login
              </v-btn>
              
              <br>
              
              <v-btn
                variant="text"
                color="primary"
                @click="goToHome"
              >
                Voltar ao Início
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const goToHome = () => {
  router.push('/')
}
</script>