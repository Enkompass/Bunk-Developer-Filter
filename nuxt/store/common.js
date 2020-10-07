export const state = () => ({
  stores: []
})

export const getters = {
  getStoreItems: state => state.stores
}

export const mutations = {
  setStores (state, stores) {
    state.stores = stores
  }
}

export const actions = {
  loadStoreItem ({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_stores')
        .then((res) => {
          commit('setStores', res.list)
          resolve(true)
        })
        .catch(reject)
    })
  }
}
