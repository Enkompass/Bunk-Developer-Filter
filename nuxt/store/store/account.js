export const actions = {
  changePassword (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/auth/change_pass', params)
        .then(resolve)
        .catch(reject)
    })
  },
  sendSMSCode ({ commit }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/auth/send_sms_verify_code', params)
        .then(resolve)
        .catch(reject)
    })
  },
  changeAccountInfos (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/auth/change_account_infos', params)
        .then(resolve)
        .catch(reject)
    })
  },
  confirmVerifyCode (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/auth/confirm_verify_code', params)
        .then((res) => {
          resolve(res.data.status)
        })
        .catch(reject)
    })
  },
  resendCode ({ commit }, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/auth/resend_verify_code', params)
        .then(resolve)
        .catch(reject)
    })
  },
  saveInfos (ctx, { $axios, params }) {
    return new Promise((resolve, reject) => {
      $axios.post('store/auth/save_infos', params)
        .then(resolve)
        .catch(reject)
    })
  },
  // eslint-disable-next-line no-empty-pattern
  updateImages ({}, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('store/auth/update_image', params)
        .then(resolve)
        .catch(reject)
    })
  }
}
