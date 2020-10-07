export const state = () => ({
  weather: 'sunny'
})

export const getters = {
  getWeather: state => state.weather
}
export const mutations = {
  setWeather (state, weather) {
    state.weather = weather
  }
}

export const actions = {
  loadWeather ({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_weather')
        .then((res) => {
          commit('setWeather', res.weather)
          resolve(res.weather)
        })
        .catch(reject)
    })
  },
  updateWeather ({ commit }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/update_weather', params)
        .then(resolve)
        .catch(reject)
    })
  },
  getTodays (ctx, { $axios }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/get_todays')
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  },
  getDeliveryInfos (ctx, { $axios }) {
    return new Promise((resolve, reject) => {
      $axios.post('admin/get_delivery_infos')
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  },
  getWeeklyData (ctx, { $axios }) {
    return new Promise((resolve, reject) => {
      $axios.get('admin/get_weekly_data')
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  },
  getTimelyData ({ commit }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('admin/get_timely_data', params)
        .then(resolve)
        .catch(reject)
    })
  }
}
