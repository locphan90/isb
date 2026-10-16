<template>
  <div class="setting-page">
    <ProfileFieldSettingForm schema-key="student" :schema-groups="studentProfileSchema.groups" />
  </div>
</template>

<script setup>
import { studentProfileSchema } from '~/data/schemas/studentProfileSchema.js'

definePageMeta({ title: 'Setting - Student Data Display' })
</script>
