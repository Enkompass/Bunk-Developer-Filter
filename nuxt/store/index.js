const moment = require('moment')

export const state = () => ({
  success: {},
  error: {},
  errors: {},
  user: null,
  theme: 'light',
  modal: true,
  business_hour_valid: false,
  next_path: '',
  upload_url: 'http://18.220.134.54:5000/api/v1/5d4fb20b3000005c111099e3'
})

export const mutations = {
  setSuccess (state, success) {
    state.success = success
  },
  setError (state, error) {
    state.error = error
  },
  setErrors (state, errors) {
    state.errors = errors
  },
  SET_THEME (state, theme) {
    state.theme = theme
  },
  UNSET_USER (state) {
    state.auth.user = null
    state.auth.loggedIn = false
  },
  SET_USER (state, user) {
    state.auth.user = user
  },
  SET_MODAL_SHOW (state, data) {
    state.modal = data
  },
  SET_BUSINESS_VALID (state, data) {
    state.business_hour_valid = data
  },
  SET_NEXT_PATH (state, data) {
    state.next_path = data
  }
}

export const getters = {
  loggedIn: state => state.auth.user !== null && state.auth.user !== false,
  loggedUser: state => state.auth.user,
  darkTheme: state => state.theme === 'dark',
  error: state => state.error,
  next_path: state => state.next_path,
  is_opened: (state) => {
    if (state.auth.user) {
      if (state.auth.user.user['BusinessHours.start_time'] === null) {
        const weekday = moment().weekday()
        if (state.auth.user.user.weekdays[weekday % 7] === '1') {
          const hours = JSON.parse(state.auth.user.user.business_hours)
          const curTime = moment()
          const startTime = moment(`${moment().format('YYYY-MM-DD')} ${hours[weekday % 7][0]}`)
          const endTime = moment(`${moment().format('YYYY-MM-DD')} ${hours[weekday % 7][1]}`)
          if (hours[weekday % 7].length === 4) {
            const secStartTime = moment(`${moment().format('YYYY-MM-DD')} ${hours[weekday % 7][2]}`)
            const secEndTime = moment(`${moment().format('YYYY-MM-DD')} ${hours[weekday % 7][3]}`)
            return curTime.isBetween(startTime, endTime) || curTime.isBetween(secStartTime, secEndTime)
          }
          return curTime.isBetween(startTime, endTime)
        }
        return false
      }
      const curTime = moment()
      const startTime = moment(`${moment().format('YYYY-MM-DD')} ${state.auth.user.user['BusinessHours.start_time']}`)
      const endTime = moment(`${moment().format('YYYY-MM-DD')} ${state.auth.user.user['BusinessHours.end_time']}`)
      return curTime.isBetween(startTime, endTime)
    }
  },
  open_hours: (state) => {
    if (state.auth.user) {
      if (state.auth.user.user['BusinessHours.start_time'] === null) {
        const weekday = moment().weekday()
        if (state.auth.user.user.weekdays[weekday % 7] === '1') {
          const hours = JSON.parse(state.auth.user.user.business_hours)
          if (hours[weekday % 7].length === 2) {
            return [hours[weekday % 7][0] + '-' + hours[weekday % 7][1]]
          } else if (hours[weekday % 7].length === 4) {
            return [
              hours[weekday % 7][0] + '-' + hours[weekday % 7][1],
              hours[weekday % 7][2] + '-' + hours[weekday % 7][3]
            ]
          }
        }
        return []
      }
      if (!state.auth.user.user['BusinessHours.dinner_start_time']) {
        return [state.auth.user.user['BusinessHours.start_time'] + '-' + state.auth.user.user['BusinessHours.end_time']]
      }
      return [
        state.auth.user.user['BusinessHours.start_time'] + '-' + state.auth.user.user['BusinessHours.end_time'],
        state.auth.user.user['BusinessHours.dinner_start_time'] + '-' + state.auth.user.user['BusinessHours.dinner_end_time']
      ]
    }
  },
  imageUploadUrl: state => state.upload_url,
  modal_showing: state => state.modal
}

export const actions = {
  handleHttpResponse ({ commit }, response) {
    commit('setSuccess', response)
  },
  handleHttpError ({ commit }, err) {
    commit('setError', err)
  },
  handleValidationErrors ({ commit }, errors) {
    commit('setErrors', errors)
  },
  handleSignedOut ({ commit }) {
    commit('UNSET_USER')
  },
  setNextPath ({ commit, data }) {
    commit('SET_NEXT_PATH', data)
  },
  setBusiness ({ commit, data }) {
    commit('SET_BUSINESS_VALID', data)
  },
  setModalShow ({ commit }, data) {
    commit('SET_MODAL_SHOW', data)
  },
  refreshUserData ({ commit }, data) {
    commit('SET_USER', data)
  },
  setTheme ({ commit }, theme) {
    commit('SET_THEME', theme)
  },
  setLimit ({ commit }, data) {
    commit('SET_LIMIT', data)
  }
}
