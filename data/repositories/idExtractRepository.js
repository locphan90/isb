export async function extractVnId(files) {
  const body = new FormData()
  // API nhận 1 PDF hoặc 1-2 ảnh (mặt trước + mặt sau)
  files.forEach((f) => body.append('files', f, f.name))
  return await $fetch('/api/extract-vn-id', { method: 'POST', body })
}