// server/utils/studentPaths.js
// Đường dẫn trang của site sinh viên, lấy từ runtimeConfig.public (khai ở nuxt.config.ts của app sinh viên)
// để đổi tiền tố (/student hay không) chỉ cần sửa một chỗ.
export const studentPaths = (event) => {
  const c = useRuntimeConfig(event).public
  return {
    login: c.studentLoginPath || '/login',
    home: c.studentHomePath || '/profile',
  }
}
