<template>
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="clientes"
          class="elevation-1 text-sm"
        >
        </v-data-table>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { listCliente } from '@/api/clienteService';
  import store from '@/store';
  
  const clientes = ref([]);
  const headers = ref([
    { title: 'ID Cliente', value: 'ID_Cliente', align: 'start' },
    { title: 'Nombre', value: 'Nombre' },
    { title: 'Correo Electrónico', value: 'Correo_Electronico' },
    { title: 'Teléfono', value: 'Telefono' }
  ]);
  
  // Función para obtener clientes
  const fetchClientes = async () => {
    try {
      const token = store.state.token;
      const response = await listCliente(token);
      if (response.data && response.data.data) {
        clientes.value = response.data.data.map(cliente => ({
          ID_Cliente: cliente.ID_Cliente,
          Nombre: cliente.Nombre,
          Correo_Electronico: cliente.Correo_Electronico,
          Telefono: cliente.Telefono,
        }));
      }
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };
  
  // Llamar a fetchClientes cuando el componente sea montado
  onMounted(() => {
    fetchClientes();
  });
  </script>
  
  <style scoped>
  /* Estilos opcionales */
  </style>
  