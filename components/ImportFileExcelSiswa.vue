<script setup>
import { ref } from 'vue'

const props = defineProps({
  path: String,
})

const emit = defineEmits(['done'])

const fileInput = ref(null)

const formData = ref({
  file: null,
})

async function submit() {
  const { success, message } = await useApi(props.path, {
    method: 'POST',
    withLoader: true,
    withNotif: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData.value,
  })

  if (success) {
    emit('done', message)
    fileInput.value.value = ''
    formData.value = {
      file: null,
    }
  }
}

function triggerFileInput() {
  fileInput.value.click() // Programmatically click the hidden file input
}

function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    formData.value.file = file
    // submit()
  }
}
</script>

<template>
  <div>
    <!-- Hidden file input triggered by button click -->
    <input
      ref="fileInput"
      type="file"
      accept=".xls, .xlsx"
      @change="handleFileChange"
    >

    <!-- Button to trigger file input -->
    <VBtn
      color="success-darken-1"
      @click="triggerFileInput"
    >
      <VIcon
        end
        icon="ri-download-2-line"
        class="mr-1"
      />
      Import Data
    </VBtn>
  </div>
</template>
