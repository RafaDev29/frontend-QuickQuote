<template>
  <v-container>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Lista de Productos</h1>
      <v-btn color="primary" @click="dialog = true">Crear</v-btn>
    </div>
    <ProductosTable />
    <CrearProductoModal v-model="dialog" />
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import ProductosTable from '@/components/productos/ProductosTable.vue';
import CrearProductoModal from '@/components/productos/CrearProductoModal.vue';

// Controlar el estado del modal
const dialog = ref(false);
</script>

<style scoped>
/* Estilos opcionales */
</style>
