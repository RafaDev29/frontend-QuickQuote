<template>
    <v-dialog v-model="localDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Crear Cotización</span>
        </v-card-title>
        <v-card-text>
          <!-- Selección de Cliente -->
          <v-select
            v-model="selectedClienteNombre"
            :items="clienteNombres"
            label="Seleccionar Cliente"
          />
          <v-text-field label="Dirección" v-model="direccion" />
          <v-select
            v-model="moneda"
            :items="['USD', 'EUR']"
            label="Moneda"
          />
          <v-select
            v-model="condicionPago"
            :items="['Contado', 'Crédito']"
            label="Condición de Pago"
          />
          <v-menu
            v-model="menuEmision"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="fechaEmision"
                label="Fecha de Emisión"
                type="date"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="fechaEmision" @input="menuEmision = false"></v-date-picker>
          </v-menu>
  
          <v-menu
            v-model="menuVencimiento"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="fechaVencimiento"
                label="Fecha de Vencimiento"
                type="date"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="fechaVencimiento" @input="menuVencimiento = false"></v-date-picker>
          </v-menu>
  
          <!-- Lista de productos -->
          <v-btn @click="agregarProducto">Agregar Producto</v-btn>
          <div v-for="(producto, index) in productos" :key="index" class="mt-2">
            <v-select
              v-model="producto.nombre"
              :items="productoNombres"
              label="Producto"
            />
            <v-text-field
              v-model="producto.cantidad"
              label="Cantidad"
              type="number"
            />
            <v-btn @click="eliminarProducto(index)" color="red">Eliminar</v-btn>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="crearCotizacion">Crear</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { ref, onMounted, watch } from 'vue';
  import { createCotizaciones } from '@/api/cotizacionService';
  import { listCliente } from '@/api/clienteService';
  import { listProducto } from '@/api/productoService'; // Importamos el servicio de productos
  import store from '@/store';
  
  export default {
    name: 'CrearCotizacionModal',
    props: {
      modelValue: {
        type: Boolean,
        required: true,
      },
    },
    setup(props, { emit }) {
      const localDialog = ref(props.modelValue);
      const clienteNombres = ref([]); // Solo nombres de los clientes
      const selectedClienteNombre = ref(''); // Nombre del cliente seleccionado
      const clientesData = ref([]); // Datos completos de los clientes
      const productoNombres = ref([]); // Solo nombres de los productos
      const productosData = ref([]); // Datos completos de los productos
      const direccion = ref('');
      const moneda = ref('USD');
      const condicionPago = ref('Contado');
      const fechaEmision = ref('');
      const fechaVencimiento = ref('');
      const productos = ref([{ nombre: '', cantidad: null }]); // Nombre y cantidad de productos seleccionados
      const menuEmision = ref(false);
      const menuVencimiento = ref(false);
  
      // Sincronizar con el padre
      watch(() => props.modelValue, (newVal) => {
        localDialog.value = newVal;
      });
  
      watch(localDialog, (newVal) => {
        emit('update:modelValue', newVal);
      });
  
      // Función para cargar los clientes
      const cargarClientes = async () => {
        const token = store.state.token;
        try {
          const response = await listCliente(token);
          clientesData.value = response.data.data;
          clienteNombres.value = clientesData.value.map(cliente => cliente.Nombre); // Extraer solo los nombres
        } catch (error) {
          console.error('Error al obtener la lista de clientes:', error);
        }
      };
  
      // Función para cargar los productos
      const cargarProductos = async () => {
        const token = store.state.token;
        try {
          const response = await listProducto(token);
          productosData.value = response.data.data;
          productoNombres.value = productosData.value.map(producto => producto.Nombre); // Extraer solo los nombres
        } catch (error) {
          console.error('Error al obtener la lista de productos:', error);
        }
      };
  
      // Cargar los clientes y productos cuando el componente se monte
      onMounted(() => {
        cargarClientes();
        cargarProductos();
      });
  
      // Función para encontrar el ID del cliente por su nombre
      const obtenerClienteIdPorNombre = (nombre) => {
        const cliente = clientesData.value.find(cliente => cliente.Nombre === nombre);
        return cliente ? cliente.ID_Cliente : null;
      };
  
      // Función para encontrar el ID del producto por su nombre
      const obtenerProductoIdPorNombre = (nombre) => {
        const producto = productosData.value.find(producto => producto.Nombre === nombre);
        return producto ? producto.ID_Producto : null;
      };
  
      // Función para agregar un nuevo producto
      const agregarProducto = () => {
        productos.value.push({ nombre: '', cantidad: null });
      };
  
      // Función para eliminar un producto
      const eliminarProducto = (index) => {
        productos.value.splice(index, 1);
      };
  
      // Función para crear la cotización
      const crearCotizacion = async () => {
        const token = store.state.token;
        const idCliente = obtenerClienteIdPorNombre(selectedClienteNombre.value);
        if (!idCliente) {
          console.error('No se pudo encontrar el ID del cliente seleccionado.');
          return;
        }
  
        // Convertir los nombres de productos a IDs
        const productosConvertidos = productos.value.map(producto => ({
          idProducto: obtenerProductoIdPorNombre(producto.nombre),
          cantidad: producto.cantidad,
        }));
  
        const payload = {
          idCliente, // Enviar el ID del cliente
          direccion: direccion.value,
          moneda: moneda.value,
          condicionPago: condicionPago.value,
          fechaEmision: fechaEmision.value,
          fechaVencimiento: fechaVencimiento.value,
          productos: productosConvertidos,
        };
  
        try {
          const response = await createCotizaciones(token, payload);
          console.log('Cotización creada con éxito:', response.data);
          close(); // Cerrar el modal después de crear la cotización
        } catch (error) {
          console.error('Error al crear la cotización:', error);
        }
      };
  
      // Función para cerrar el modal
      const close = () => {
        localDialog.value = false;
      };
  
      return {
        localDialog,
        clienteNombres,
        selectedClienteNombre,
        direccion,
        moneda,
        condicionPago,
        fechaEmision,
        fechaVencimiento,
        productos,
        productoNombres,
        menuEmision,
        menuVencimiento,
        close,
        agregarProducto,
        eliminarProducto,
        crearCotizacion,
      };
    },
  };
  </script>
  