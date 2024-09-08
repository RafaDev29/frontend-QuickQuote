<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="cotizaciones"
        class="elevation-1 text-sm"
      >
        <!-- Acciones para cada cotización -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="flex gap-1 justify-center">
            <!-- Botón para aprobar -->
            <span @click="aprobarItem(item)">
              <v-btn
                icon="mdi-check-circle"
                size="small"
                variant="text"
                color="blue"
              ></v-btn>
              <v-tooltip activator="parent" location="top">Aprobar</v-tooltip>
            </span>
            <!-- Botón para eliminar -->
            <span @click="deleteItem(item)">
              <v-btn
                icon="mdi-delete-empty"
                size="small"
                variant="text"
                color="red"
              ></v-btn>
              <v-tooltip activator="parent" location="top">Eliminar</v-tooltip>
            </span>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { listcotizaciones, deleteCotizacion, aproveCotizacion } from '@/api/cotizacionService';
import store from '@/store';

const cotizaciones = ref([]);
const loading = ref(false);

const headers = ref([
  { title: 'Fecha de Emisión', value: 'Fecha_Emision', align: 'start' },
  { title: 'Fecha de Vencimiento', value: 'Fecha_Vencimiento' },
  { title: 'Cliente', value: 'Cliente_Nombre' },
  { title: 'Total', value: 'Total' },
  { title: 'Estado', value: 'Estado' },
  { title: 'Acciones', value: 'actions', align: 'center', sortable: false },
]);

// Función para obtener cotizaciones
const fetchCotizaciones = async () => {
  loading.value = true;
  try {
    const token = store.state.token;
    const response = await listcotizaciones(token);
    cotizaciones.value = response.data.data.map(cotizacion => ({
      ID_Cotizacion: cotizacion.ID_Cotizacion,
      Fecha_Emision: new Date(cotizacion.Fecha_Emision).toLocaleDateString(),
      Fecha_Vencimiento: new Date(cotizacion.Fecha_Vencimiento).toLocaleDateString(),
      Cliente_Nombre: cotizacion.Cliente_Nombre,
      Total: `${cotizacion.Total} USD`,
      Estado: cotizacion.Estado,
    }));
  } catch (error) {
    console.error('Error fetching cotizaciones:', error);
  } finally {
    loading.value = false;
  }
};

// Función para aprobar una cotización
const aprobarItem = async (item) => {
  const token = store.state.token;
  if (confirm('¿Estás seguro de que deseas aprobar esta cotización?')) {
    try {
      await aproveCotizacion(token, item.ID_Cotizacion);
      alert('Cotización aprobada con éxito.');
      fetchCotizaciones(); // Volver a cargar las cotizaciones después de la aprobación
    } catch (error) {
      console.error('Error al aprobar la cotización:', error);
    }
  }
};

// Función para eliminar una cotización
const deleteItem = async (item) => {
  const token = store.state.token;
  if (confirm('¿Estás seguro de que deseas eliminar esta cotización?')) {
    try {
      await deleteCotizacion(token, item.ID_Cotizacion);
      cotizaciones.value = cotizaciones.value.filter(
        cotizacion => cotizacion.ID_Cotizacion !== item.ID_Cotizacion
      );
      alert('Cotización eliminada con éxito.');
    } catch (error) {
      console.error('Error al eliminar la cotización:', error);
    }
  }
};

// Llamar a fetchCotizaciones cuando el componente sea montado
onMounted(() => {
  fetchCotizaciones();
});
</script>

<style scoped>
.flex {
  display: flex;
}
.gap-1 {
  gap: 0.25rem;
}
</style>
