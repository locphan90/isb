// server/routes/auth/student/google.get.js
// Đăng nhập Google cho SINH VIÊN (tách hẳn khỏi /auth/google của admin).
// Cần thêm redirect URI .../auth/student/google vào OAuth client trong Google Cloud Console.
export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['email', 'profile'],
  },
  async onSuccess(event, { user }) {
    const email = user.email?.trim()
    if (!email) return sendRedirect(event, '/student/login?error=no_email')
    if (user.email_verified === false) return sendRedirect(event, '/student/login?error=no_email')

    try {
      const { data, error } = await useSupabaseAdmin(event).rpc('get_student_self', { p_email: email })
      if (error) {
        if ((error.message || '').includes('EMAIL_DUPLICATED')) {
          return sendRedirect(event, '/student/login?error=email_duplicated')
        }
        throw error
      }
      if (!data) {
        console.warn(`[Student Auth] Email ${email} not found in tbl_student.`)
        return sendRedirect(event, '/student/login?error=not_registered')
      }

      await setUserSession(event, {
        user: {
          email,
          name: user.name,
          avatar: user.picture,
          role: 'student',
          mssv: data.mssv,
        },
      })
      return sendRedirect(event, '/student/profile')
    } catch (err) {
      console.error('[Student Auth] Lookup failed:', err?.message || err)
      return sendRedirect(event, '/student/login?error=db_error')
    }
  },
  onError(event, error) {
    console.error('[Student Auth] Google OAuth callback error:', error)
    return sendRedirect(event, '/student/login?error=auth_failed')
  },
})
