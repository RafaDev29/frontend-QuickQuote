<template>
    <v-card>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="productos"
          class="elevation-1 text-sm"
        >
          <!-- Acciones para cada producto -->
          <template v-slot:[`item.actions`]="{ item }">
            <div class="flex gap-1 justify-center">
              <span @click="editItem(item)">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  color="green"
                ></v-btn>
                <v-tooltip activator="parent" location="top">Editar</v-tooltip>
              </span>
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
  import { listProducto } from '@/api/productoService'; // Servicio que obtendrá los productos
  import store from '@/store';
  
  const productos = ref([]);
  const headers = ref([
    { title: 'ID Producto', value: 'ID_Producto', align: 'start' },
    { title: 'Nombre', value: 'Nombre' },
    { title: 'Descripción', value: 'Descripcion' },
    { title: 'Precio Unitario', value: 'Precio_Unitario' },
    // { title: 'Acciones', value: 'actions', align: 'center', sortable: false }
  ]);
  
  // Función para obtener productos
  const fetchProductos = async () => {
    try {
      const token = store.state.token;
      const response = await listProducto(token); // Llamada al servicio de productos
      if (response.data && response.data.data) {
        productos.value = response.data.data.map(producto => ({
          ID_Producto: producto.ID_Producto,
          Nombre: producto.Nombre,
          Descripcion: producto.Descripcion,
          Precio_Unitario: `${producto.Precio_Unitario} USD`,
        }));
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };
  
  // Función para editar un producto
  const editItem = (producto) => {
    console.log("Editar producto:", producto);
  };
  
  // Función para eliminar un producto
  const deleteItem = (producto) => {
    console.log("Eliminar producto:", producto);
  };
  
  // Llamar a fetchProductos cuando el componente sea montado
  onMounted(() => {
    fetchProductos();
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
  