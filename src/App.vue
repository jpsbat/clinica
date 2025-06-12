<template>
  <v-app :theme="currentTheme">
    <v-navigation-drawer v-model="isDrawerOpen">
      <v-list>
        <v-list-subheader>Menu</v-list-subheader>
        <v-list-item prepend-icon="mdi-home">Home</v-list-item>
        <v-list-item prepend-icon="mdi-account">Usuários</v-list-item>

        <v-list-group value="Users">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-account-circle"
              title="Clientes"
            ></v-list-item>
          </template>

          <v-list-item prepend-icon="mdi-currency-usd">Vendas</v-list-item>
          <v-list-item prepend-icon="mdi-chart-line">Relatórios</v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar flat class="border-b">
      <v-app-bar-nav-icon
        @click="isDrawerOpen = !isDrawerOpen"
      ></v-app-bar-nav-icon>
      <v-app-bar-title>Vuetify</v-app-bar-title>

      <template #append>
        <v-btn 
          icon 
          @click="toggleTheme" 
          class="mr-2"
          :title="currentTheme === 'dark' ? 'Modo claro' : 'Modo escuro'"
        >
          <v-icon>{{ currentTheme === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>

        <v-btn icon class="mr-4">
          <v-badge dot color="info">
            <v-icon icon="mdi-bell-outline"></v-icon>
          </v-badge>
        </v-btn>

        <v-menu>
          <template #activator="{ props }">
            <v-avatar v-bind="props">
              <v-img
                cover
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCuWLApG23v_W87aTLjCEsZ5El2o9hQgRx6g&s"
              ></v-img>
            </v-avatar>
          </template>

          <v-card min-width="200px">
            <v-list :lines="false" density="compact" nav>
              <v-list-item prepend-icon="mdi-account">
                <v-list-item-title>Meu Perfil</v-list-item-title>
              </v-list-item>
              <v-list-item prepend-icon="mdi-heart-outline">
                <v-list-item-title>Favoritos</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </template>
    </v-app-bar>

    <v-main>
      <v-container>
        <h1>Dashboard</h1>

        <v-card flat class="border mb-4">
          <div class="d-flex justify-space-between">
            <v-card-title>Últimos usuários</v-card-title>

            <v-card-title>
              <v-btn prepend-icon="mdi-plus" @click="isDialogOpen = true" size="small" :ripple="true">Adicionar Usuário</v-btn>
              <v-dialog v-model="isDialogOpen" width="600px">
                <v-card>
                  <v-card-title>Adicionar Usuário</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col>
                        <v-text-field variant="outlined" label="Nome" :rules="nameRules"></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field variant="outlined" label="E-mail" :rules="emailRules"></v-text-field>
                      </v-col>
                    </v-row>

                    <v-select variant="outlined" label="Cargo" :items="['GOAT', 'Alien', 'Cachaceiro']"></v-select>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" @click="isDialogOpen = false">Cancelar</v-btn>
                    <v-btn color="success">Salvar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card-title>
          </div>

          <v-table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Cargo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cristiano Ronaldo</td>
                <td>cristiano@ronaldo.com</td>
                <td>GOAT</td>
                <td>
                  <v-btn prepend-icon="mdi-pencil" color="primary">Editar</v-btn>
                </td>
              </tr>
              <tr>
                <td>Lionel Messi</td>
                <td>lionel@messi.com</td>
                <td>Alien</td>
                <td>
                  <v-btn prepend-icon="mdi-pencil" color="primary">Editar</v-btn>
                </td>
              </tr>
              <tr>
                <td>Neymar Jr.</td>
                <td>neymar@jr.com</td>
                <td>Cachaceiro</td>
                <td>
                  <v-btn prepend-icon="mdi-pencil" color="primary">Editar</v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <v-row>
          <v-col cols="12" md="4" lg="3">
            <v-card>
              <v-img
                class="align-end text-white"
                src="https://img.redbull.com/images/c_limit,w_1500,h_1000/f_auto,q_auto/redbullcom/2018/07/10/69dcfced-2948-406f-9878-8f5a711ce7d0/cristianoronaldo"
              >
                <v-card-title>The GOAT</v-card-title>
              </v-img>

              <v-card-subtitle class="pt-3">
                Cristiano Ronaldo
              </v-card-subtitle>

              <v-card-text>
                <div>Jogador de futebol</div>

                <div>Ele é o milior</div>
              </v-card-text>

              <v-card-actions>
                <v-btn variant="outlined" color="primary" text>Follow</v-btn>
                <v-btn color="secondary" text>Message</v-btn>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-share</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" lg="3">
            <v-card>
              <v-img
                class="align-end text-white"
                src="https://s2-ge.glbimg.com/IegSwvonyRvdf0HsydbRpRAqgVs=/0x0:819x1024/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2022/m/0/TyvyVFRZCkXuqA062mqA/whatsapp-image-2022-11-26-at-20.20.59.jpeg"
              >
                <v-card-title>The Alien</v-card-title>
              </v-img>

              <v-card-subtitle class="pt-3"> Lionel Messi </v-card-subtitle>

              <v-card-text>
                <div>Jogador de futebol</div>

                <div>Ele é o segundo milior</div>
              </v-card-text>

              <v-card-actions>
                <v-btn variant="outlined" color="primary" text>Follow</v-btn>
                <v-btn color="secondary" text>Message</v-btn>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-share</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="4" lg="3">
            <v-card>
              <v-img
                class="align-end text-white"
                src="https://images.ctfassets.net/3mv54pzvptwz/5gMFM7EkKcQSiZRcemkuTk/eb1aab1b744d9c65b05a2a65e67133ca/54309793446_bcbeccf726_o.jpg"
              >
                <v-card-title>The CACHACEIRO</v-card-title>
              </v-img>

              <v-card-subtitle class="pt-3"> Neymar Jr. </v-card-subtitle>

              <v-card-text>
                <div>Jogador de futebol</div>

                <div>Ele é o terceiro milior</div>
              </v-card-text>

              <v-card-actions>
                <v-btn variant="outlined" color="primary" text>Follow</v-btn>
                <v-btn color="secondary" text>Message</v-btn>
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-share</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const isDrawerOpen = ref(false);
const isDialogOpen = ref(false);
const currentTheme = ref('dark');

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark';
};

const nameRules = [
  value => {
    if (value) return true;

    return "Nome é obrigatório";
  },
  value => {
    if (value.length >= 3) return true;

    return "Nome deve ter pelo menos 3 caracteres";
  }
]

const emailRules = [
  value => {
    if (value) return true;

    return "E-mail é obrigatório";
  },
  value => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(value)) return true;

    return "E-mail inválido";
  }
]
</script>
