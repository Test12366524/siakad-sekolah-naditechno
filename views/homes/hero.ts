export const validationTypes = {
  ts: `<script lang="ts" setup>
import { VForm } from 'vuetify/components/VForm'

const requiredField = ref('')
const refForm = ref<VForm>()

const basicEditorContent = ref(\`
<p>
  This is a radically reduced version of tiptap. It has support for a document, with paragraphs and text. That's it. It's probably too much for real minimalists though.
</p>
<p>
  The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.  
</p>
\`)
</script>

<template>
  <VForm
    ref="refForm"
    @submit.prevent
  >
    <VRow>
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="requiredField"
          persistent-placeholder
          placeholder="This field is required"
          :rules="[requiredValidator]"
        />
      </VCol>

      <div>
        <TiptapEditor
          v-model="basicEditorContent"
          class="border rounded"
        />
      </div>

      <VCol cols="12">
        <VBtn
          type="submit"
          @click="refForm?.validate()"
        >
          Submit
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<style lang="scss">
.ProseMirror {
  block-size: 200px;
  outline: none;
  overflow-y: auto;
  padding-inline: 0.5rem;
}
</style>
`,
  js: `<script setup>
import { VForm } from 'vuetify/components/VForm'

const requiredField = ref('')
const refForm = ref()

const basicEditorContent = ref(\`
<p>
  This is a radically reduced version of tiptap. It has support for a document, with paragraphs and text. That's it. It's probably too much for real minimalists though.
</p>
<p>
  The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.  
</p>
\`)
</script>

<template>
  <VForm
    ref="refForm"
    @submit.prevent
  >
    <VRow>
      <VCol
        cols="12"
        md="6"
      >
        <VTextField
          v-model="requiredField"
          persistent-placeholder
          placeholder="This field is required"
          :rules="[requiredValidator]"
        />
      </VCol>
      <div>
        <TiptapEditor
          v-model="basicEditorContent"
          class="border rounded"
        />
      </div>
      <VCol cols="12">
        <VBtn
          type="submit"
          @click="refForm?.validate()"
        >
          Submit
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
<style lang="scss">
.ProseMirror {
  block-size: 200px;
  outline: none;
  overflow-y: auto;
  padding-inline: 0.5rem;
}
</style>
`,
}
