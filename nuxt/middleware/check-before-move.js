export default function ({ store, app }) {
  store.app.router.beforeEach((to, from, next) => {
    if (from.name === 'store-business_hours' && store.state.business_hour_valid === false) {
      store.commit('SET_NEXT_PATH', to.path)
      if (store.state.modal) {
        next()
      } else {
        app.$bus.$emit('notification.warning', {
          title: 'まだ変更を保存していません',
          subtitle: '戻って「保存」ボタンを押してから、ページを離れてください。'
        })
        next(false)
      }
    } else {
      next()
    }
  })
}
