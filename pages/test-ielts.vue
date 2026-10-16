<script setup>
const file = ref(null);
const loading = ref(false);
const result = ref(null);
const error = ref('');
const elapsed = ref(0);

function onFileChange(e) {
  file.value = e.target.files?.[0] || null;
}

async function submit() {
  if (!file.value) return;
  loading.value = true;
  result.value = null;
  error.value = '';
  const t0 = performance.now();

  try {
    const fd = new FormData();
    fd.append('file', file.value);
    result.value = await $fetch('/api/ielts-reading-vertex', {
      method: 'POST',
      body: fd,
    });
  } catch (e) {
    error.value = e?.data?.statusMessage || e?.statusMessage || e?.message || String(e);
  } finally {
    elapsed.value = Math.round(performance.now() - t0);
    loading.value = false;
  }
}
</script>

<template>
  <div class="wrap">
    <h1>Test IELTS Reading Extract</h1>

    <input type="file" accept="application/pdf,image/*" @change="onFileChange" />
    <button :disabled="!file || loading" @click="submit">
      {{ loading ? 'Đang xử lý...' : 'Gửi' }}
    </button>

    <p v-if="elapsed && !loading">Thời gian: {{ elapsed }} ms</p>
    <p v-if="error" class="err">Lỗi: {{ error }}</p>
    <pre v-if="result">{{ JSON.stringify(result, null, 2) }}</pre>
  </div>
</template>

<style scoped>
.wrap { max-width: 900px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif; }
button { margin-left: .75rem; padding: .4rem 1rem; }
.err { color: #c00; }
pre { background: #111; color: #9f9; padding: 1rem; border-radius: 8px; overflow: auto; max-height: 70vh; }
</style>