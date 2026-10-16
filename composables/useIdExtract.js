import { extractVnId } from '~/data/repositories/idExtractRepository'

export function useIdExtract() {
  const loading = ref(false)
  const snackbar = useSnackbarStore()

  async function extract(files) {
    loading.value = true
    try {
      return await extractVnId(files)
    } catch (err) {
      snackbar.trigger({
        message: err?.data?.statusMessage || err?.statusMessage || 'Extraction failed.',
        color: 'error',
      })
      return null
    } finally {
      loading.value = false
    }
  }

  return { loading, extract }
}