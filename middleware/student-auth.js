// Chỉ phiên sinh viên (role = 'student') mới vào được khu /student; còn lại về trang đăng nhập sinh viên.
// Lưu ý: đây chỉ là điều hướng. Bảo mật thật nằm ở API server (requireStudentSession).
export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, user } = useUserSession()
  if (!loggedIn.value || user.value?.role !== 'student') {
    // Đường dẫn trang đăng nhập khai ở runtimeConfig.public.studentLoginPath (mặc định /login)
    return navigateTo(useRuntimeConfig().public.studentLoginPath || '/login')
  }
})
