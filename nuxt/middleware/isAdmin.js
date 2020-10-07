export default function ({ store, redirect, app }) {
  app.$bus.$emit('refresh_admin_badge', {})
  if (store.state.auth.user.user.role !== 'admin') {
    return redirect('/store/top')
  }
}
