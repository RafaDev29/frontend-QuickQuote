<!-- src/views/CotizacionView.vue -->
<template>
  <v-container>
    <h1>Lista de Cotizaciones</h1>
    <CotizacionesTable />
  </v-container>
</template>

<script setup>
import CotizacionesTable from '@/components/cotizaciones/CotizacionesTable.vue';
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
</style>
