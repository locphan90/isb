<!--
  Dùng:
    <ProfileFieldSettingForm schema-key="student" :schema-groups="studentProfileSchema.groups" />
-->
<template>
  <div class="form-card">
    <div class="field">
      <label class="label">Menu</label>
      <select v-model="selectedMenuKey" @change="onSelect">
        <option value="" disabled>— select menu —</option>
        <option v-for="d in deptMenus" :key="d.key" :value="d.key">
          {{ d.parentLabel ? `${d.parentLabel} — ${d.label}` : d.label }}
        </option>
      </select>
    </div>

    <template v-if="selectedMenuKey">
      <div class="divider" />
      <div class="section-heading">Data groups displayed</div>
      <label v-for="g in schemaGroups" :key="g.key" class="check-row">
        <input type="checkbox" v-model="fields[g.key]" />
        <span>{{ g.label }}</span>
      </label>

      <div class="divider" />
      <div class="actions">
        <v-btn :loading="saving" @click="save">Save</v-btn>
      </div>
    </template>
  </div>
</template>

<script setup>
import { menuItems } from '~/config/menu.js'

const props = defineProps({
  schemaKey: { type: String, required: true },
  schemaGroups: { type: Array, required: true },
})

const { loadSettings, saveSettings } = useStudentProfileSettings()

// Tự tìm mọi menu có fieldSchema === schemaKey (kể cả menu con lồng nhiều cấp)
function collectDeptMenus(items, parentLabel = '') {
  let result = []
  for (const item of items) {
    if (item.fieldSchema === props.schemaKey) {
      result.push({ key: item.key, label: item.label, parentLabel })
    }
    if (item.children) {
      result = result.concat(collectDeptMenus(item.children, item.label))
    }
  }
  return result
}
const deptMenus = collectDeptMenus(menuItems)

const snackbar = useSnackbarStore()

const selectedMenuKey = ref('')
const fields = reactive({})
const saving = ref(false)

async function onSelect() {
  for (const k of Object.keys(fields)) delete fields[k]
  if (!selectedMenuKey.value) return

  const current = await loadSettings(selectedMenuKey.value)
  for (const g of props.schemaGroups) {
    fields[g.key] = current?.[g.key] === true
  }
}

async function save() {
  saving.value = true
  try {
    await saveSettings(selectedMenuKey.value, { ...fields })
    snackbar.trigger({ message: 'Saved.', color: 'success' })
  } catch (e) {
    snackbar.trigger({ message: e.message || 'Failed to save.', color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.form-card {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 520px;
}

.label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.35rem;
}

select {
  padding: 0.45rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 15px;
  width: 100%;
}

.divider {
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 0;
}

.section-heading {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  cursor: pointer;
  font-size: 0.92rem;
  color: #334155;
}
.check-row input { cursor: pointer; accent-color: #0855e3; }

.actions { padding-top: 0.25rem; }
</style>