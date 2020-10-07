export default ({ $axios, store, redirect, app }) => {
  $axios.defaults.timeout = 25000
  $axios.onResponse((res) => {
    app.$bus.$emit('notification.success', res)
    app.$bus.$emit('alert.warning', res)
    return res
  })

  $axios.onError((err) => {
    const { response: { status } } = err
    app.$bus.$emit('notification.error', err)
    if (status === 401) {
      store.commit('UNSET_USER')
      return redirect('/auth/login')
    }
    return Promise.reject(err)
  })
}
