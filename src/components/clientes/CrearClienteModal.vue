<template>
    <v-dialog v-model="localDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Crear Cliente</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Nombre" v-model="nombre" />
          <v-text-field label="Correo Electrónico" v-model="correo" />
          <v-text-field label="Teléfono" v-model="telefono" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="crearCliente">Crear</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { createCliente } from '@/api/clienteService';
  import store from '@/store';
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    dialog: Boolean,
  });
  const emit = defineEmits(['update:dialog']);
  
  // Variables reactivas para el formulario
  const nombre = ref('');
  const correo = ref('');
  const telefono = ref('');
  
  // Sincronizar estado del modal
  const localDialog = ref(props.dialog);
  watch(() => props.dialog, (newVal) => {
    localDialog.value = newVal;
  });
  
  // Función para crear cliente
  const crearCliente = async () => {
    const token = store.state.token;
    const payload = {
      nombre: nombre.value,
      correo: correo.value,
      telefono: telefono.value,
    };
  
    try {
      const response = await createCliente(token, payload);
      console.log('Cliente creado con éxito:', response.data);
      
      // Cerrar el modal después de crear el cliente
      close();
  
      // Limpiar los campos del formulario
      nombre.value = '';
      correo.value = '';
      telefono.value = '';
      
    } catch (error) {
      console.error('Error al crear el cliente:', error);
    }
  };
  
  // Función para cerrar el modal
  const close = () => {
    emit('update:dialog', false); // Emitir evento para cerrar el modal en el componente padre
  };
  </script>
  
  <style scoped>
  /* Estilos opcionales */
  </style>
  