<template>
    <v-card>
      <v-card-text>
        <div class="table-container">
          <v-data-table
            :headers="headers"
            :items="cotizaciones"
            class="elevation-1"
            :search="search"
            :loading="loading"
            :sort-by="[{ key: 'Cliente_Nombre', order: 'asc' }]"
            loading-text="Cargando... Espere por favor"
          >
            <template v-slot:top>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
                @input="handleSearch"
              ></v-text-field>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  import { listcotizaciones } from '@/api/cotizacionService';
  import store from '@/store';
  
  export default {
    name: 'CotizacionesTable',
    data() {
      return {
        search: '',
        loading: false,
        headers: [
          { title: 'Fecha de Emisión', key: 'Fecha_Emision', align: 'start' },
          { title: 'Fecha de Vencimiento', key: 'Fecha_Vencimiento' },
          { title: 'Cliente', key: 'Cliente_Nombre' },
          { title: 'Total', key: 'Total' },
          { title: 'Estado', key: 'Estado' },
        ],
        cotizaciones: [],
      };
    },
    created() {
      this.fetchCotizaciones();
    },
    methods: {
      async fetchCotizaciones() {
        this.loading = true;
        try {
          const token = store.state.token;
          const response = await listcotizaciones(token);
          this.cotizaciones = response.data.data.map(cotizacion => ({
            Fecha_Emision: new Date(cotizacion.Fecha_Emision).toLocaleDateString(),
            Fecha_Vencimiento: new Date(cotizacion.Fecha_Vencimiento).toLocaleDateString(),
            Cliente_Nombre: cotizacion.Cliente_Nombre,
            Total: `${cotizacion.Total} USD`,
            Estado: cotizacion.Estado,
          }));
        } catch (error) {
          console.error('Error fetching cotizaciones:', error);
        } finally {
          this.loading = false;
        }
      },
      handleSearch() {
        this.loading = true;
        setTimeout(async () => {
          await this.fetchCotizaciones(); 
          this.loading = false;
        }, 500); 
      },
    },
  };
  </script>
  
  <style scoped>
  .table-container {
    max-height: 700px; 
    overflow-y: auto;
  }
  </style>
  