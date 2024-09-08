<template>
    <v-container>
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Lista de Clientes</h1>
        <v-btn color="primary" @click="dialog = true">Crear</v-btn>
      </div>
      <ClientesTable />
      <CrearClienteModal v-model:dialog="dialog" />
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import ClientesTable from '@/components/clientes/ClientesTable.vue';
 import CrearClienteModal from '@/components/clientes/CrearClienteModal.vue'; // Modal para crear cliente
  
  // Estado para controlar la apertura del modal
  const dialog = ref(false);
  </script>
  
  <style scoped>
  /* Estilos opcionales */
  </style>
  