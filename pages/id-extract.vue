<script setup>
// Tiêu đề do layouts/default.vue hiển thị, không tự vẽ <h2>
definePageMeta({ title: 'ID Extraction' })

function onSubmit(data) {
  // TODO: gọi repository lưu dữ liệu (xem câu hỏi bên dưới)
  console.log(data)
}
</script>

<template>
  <IdExtractForm @submit="onSubmit" />
</template>