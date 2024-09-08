<template>
  <div class="containerlogin"> 
    <div class="flex justify-center items-center w-200 h-screen overflow-y-hidden bg-login">
      <div class="w-full h-full">
        <div class="w-200 flex justify-end">
          <h1 class="text-gray-600 pt-10 font-bold text-5xl mr-15"></h1>
        </div>
        <div class="flex justify-start w-full pt-[2rem]">
          <div class="min-w-[30rem] rounded-xl ml-20 pt-1 ">
            <div v-if="statusError" class="flex justify-center">
              <v-alert color="#FF5250" theme="dark" icon="mdi-alert-circle" density="compact" closable class="max-w-[25rem]">
                {{ messageError }}
              </v-alert>
            </div>
            <div class="formLogin"> 
              <FormAuthVue @validate-login="onValidateLogin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'; // Importar useRoute para capturar los parámetros
import FormAuthVue from '@/components/login/FormAuth.vue';
import { authLoginApi } from '@/api/LoginService';

import store from '@/store';

export default {
  components: {
    FormAuthVue
  },
  data: () => ({
    visible: false,
  }),
  setup() {
    const messageError = ref('');
    const statusError = ref(false);
    const router = useRouter();
    const route = useRoute(); // Obtener la ruta actual

  

        const onValidateLogin = async (data) => { // Declarar la función como async
  try {
    const response = await authLoginApi(data);
    const user = response.data.data;
    store.commit('setUsername', user.username);
    store.commit('setToken', user.token);
    store.commit('setRole', user.role);
    store.commit('setIsAuthenticated', true);
    

    
    router.push('/');
  } catch (error) {
    statusError.value = true;
    if (error.response) {
      if (error.response.status === 401) {
        messageError.value = "Las credenciales de usuario no son válidas";
      } else if (error.response.status === 500) {
        messageError.value = "Error 500: Error interno del servidor";
      } else {
        messageError.value = error.response.data.message;
      }
    } else if (error.request) {
      messageError.value = "No se recibió respuesta del servidor";
    } else {
      messageError.value = "Error al configurar la solicitud:", error.message;
    }
  }
};

    // Intenta hacer el login automáticamente si los parámetros están presentes
    onMounted(() => {
      const username = route.query.username; // Capturar el parámetro username
      const password = route.query.password; // Capturar el parámetro password
      
      if (username && password) {
        onValidateLogin({ username, password });
      }
    });



    return {
      onValidateLogin,
      messageError,
      statusError
    };
  }
};
</script>

<style scoped>
.bg-login {
  background-size: cover;
  background-position: bottom;
}

.containerlogin {
  background-color: rgb(230, 237, 247);
}
</style>
