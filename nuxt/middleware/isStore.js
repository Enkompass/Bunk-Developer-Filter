export default function ({ store, redirect }) {
  if (store.state.auth.user.user.role !== 'store') {
    return redirect('/admin/top')
  }
}
