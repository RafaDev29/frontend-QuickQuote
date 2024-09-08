<template>
    <v-dialog v-model="localDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Crear Producto</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Nombre del Producto" v-model="nombre" />
          <v-text-field label="Descripción" v-model="descripcion" />
          <v-text-field label="Precio Unitario" v-model="precio" type="number" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="crearProducto">Crear</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, watch, defineEmits, defineProps } from 'vue';
  import { createProducto } from '@/api/productoService'; // Servicio para crear producto
  import store from '@/store';
  
  const props = defineProps({
    modelValue: Boolean, // Cambiamos 'dialog' por 'modelValue' para usar v-model correctamente
  });
  const emit = defineEmits(['update:modelValue']);
  
  const localDialog = ref(props.modelValue);
  const nombre = ref('');
  const descripcion = ref('');
  const precio = ref(null);
  
  // Sincronizar la apertura y cierre del modal con el estado del padre
  watch(() => props.modelValue, (newVal) => {
    localDialog.value = newVal;
  });
  
  // Función para crear producto
  const crearProducto = async () => {
    const token = store.state.token;
    const payload = {
      nombre: nombre.value,
      descripcion: descripcion.value,
      precio: parseFloat(precio.value),
    };
  
    try {
      const response = await createProducto(token, payload);
      console.log('Producto creado con éxito:', response.data);
      
      // Cerrar el modal después de la creación exitosa
      close();
  
      // Limpiar los campos del formulario
      nombre.value = '';
      descripcion.value = '';
      precio.value = null;
      
    } catch (error) {
      console.error('Error al crear el producto:', error);
    }
  };
  
  // Función para cerrar el modal
  const close = () => {
    emit('update:modelValue', false); // Emitir evento para cerrar el modal en el componente padre
  };
  </script>
  
  <style scoped>
  /* Estilos opcionales */
  </style>
  