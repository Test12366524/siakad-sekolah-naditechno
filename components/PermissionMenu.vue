<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  menu: {
    type: Object,
    required: true,
    default: {
      operations: [],
    },
  },
});

const menuChecked = ref(false);
const permissions = ref<any>([]);

const emit = defineEmits(["update:modelValue"]);

const updateParent = () => {
  if (!props.menu.parent_id) return;

  if (!menuChecked.value) {
    emit(
      "update:modelValue",
      props.modelValue.filter((val) => val != `${props.menu.parent_title}_VIEW`)
    );
  } else {
    emit("update:modelValue", [
      ...props.modelValue,
      `${props.menu.parent_title}_VIEW`,
    ]);
  }
};

onMounted(() => {
  props.modelValue?.forEach((val) => {
    // If any of the operations exist in the modelValue, mark the corresponding checkbox as checked
    if (props.menu.operations.find((op: any) => op.value === val)) {
      menuChecked.value = props.menu.id;
      permissions.value.push(val);
    }
  });

  watch(menuChecked, () => {
    if (!menuChecked.value) {
      permissions.value = [];
    } else if (!permissions.value.length) {
      permissions.value = props.menu.operations.map(
        (operation: any) => operation.value
      );
    }

    updateParent();
  });

  watch(permissions, () => {
    if (permissions.value.length && !menuChecked.value) {
      menuChecked.value = props.menu.id;
    }

    const updatedModelValue = [
      ...props.modelValue.filter(
        (val) => !props.menu.operations.some((op: any) => op.value === val)
      ),
      ...permissions.value,
    ];
    emit("update:modelValue", updatedModelValue);
  });
});
</script>

<template>
  <!-- Row for menu and CRUD actions -->
  <tr v-if="!menu.childs || !menu.childs.length">
    <!-- Menu column -->
    <td class="align-middle" style="min-width: 300px">
      <VCheckbox
        :value="menu.id"
        :label="menu.title"
        v-model="menuChecked"
        class="menu-checkbox"
      />
    </td>

    <!-- CRUD actions column -->
    <td class="align-middle">
      <div class="d-flex flex-wrap">
        <div
          v-for="operation in menu.operations"
          :key="operation.value"
          class="me-3 my-1"
        >
          <VCheckbox
            v-model="permissions"
            :value="operation.value"
            :label="operation.label"
            class="operation-checkbox"
          />
        </div>
      </div>
    </td>
  </tr>
  <tr v-else>
    <td colspan="2" class="text-h5 my-6">{{ menu.title }}</td>
  </tr>
  <PermissionMenu
    v-for="menu in menu.childs ?? []"
    :key="menu.id"
    :menu="menu"
    :modelValue="modelValue"
    @update:modelValue="(newVal) => $emit('update:modelValue', newVal)"
  ></PermissionMenu>
</template>
