<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn class="float-right" color="primary" @click="dialog = true">
          Crear
        </v-btn>
      </v-col>
    </v-row>
    <CotizacionesTable />
    <CrearCotizacionModal v-model:modelValue="dialog" />
  </v-container>
</template>

<script>
import { ref } from 'vue';
import CotizacionesTable from '@/components/cotizaciones/CotizacionesTable.vue';
import CrearCotizacionModal from '@/components/cotizaciones/CrearCotizacionModal.vue';

export default {
  name: 'CotizacionView',
  components: {
    CotizacionesTable,
    CrearCotizacionModal,
  },
  setup() {
    // Controlar el estado del modal
    const dialog = ref(false);

    return {
      dialog,
    };
  },
};
</script>

<style scoped>
.float-right {
  float: right;
  margin-bottom: 20px;
}
</style>
