import Vue from 'vue'
import numeral from 'numeral'
import moment from 'moment'

Vue.filter('thousandFormat', (value, suffix = '') => {
  return numeral(value).format('0,0') + suffix
})

Vue.filter('currency', (value, currency = '¥', prefix = true) => {
  return (prefix ? currency : '') + numeral(Math.abs(value)).format('0,0') + (prefix ? '' : currency)
})

Vue.filter('floatCurrency', (value, currency = '¥') => {
  return currency + numeral(value).format('0,0.00')
})

Vue.filter('formatPhoneNumber', (str) => {
  const cleaned = ('' + str).replace(/\D/g, '')
  const match = cleaned.length === 10 ? cleaned.match(/^(\d{3})(\d{3})(\d{4})$/) : cleaned.match(/^(\d{3})(\d{4})(\d{4})$/)
  if (match) {
    return match[1] + '-' + match[2] + '-' + match[3]
  }
  return null
})

Vue.filter('dateFormat', (value) => {
  if (!value) {
    return ''
  }
  return moment(value).format('YYYY/MM/DD')
})

Vue.filter('dateMonthFormat', (value) => {
  if (!value) {
    return ''
  }
  return moment(value).format('YYYY/MM')
})

Vue.filter('timeFormat', (value) => {
  if (!value) {
    return ''
  }
  return moment(value).format('HH:mm')
})

Vue.filter('datetimeFormat', (value) => {
  if (!value) {
    return ''
  }
  return moment(value).format('YYYY/MM/DD HH:mm:ss')
})

Vue.filter('monthFormat', (value) => {
  if (!value) {
    return ''
  }
  return moment(value).format('MM/DD')
})

Vue.filter('yearFormat', (value) => {
  if (!value) {
    return ''
  }
  return moment(value).format('YYYY')
})

Vue.filter('monthDayTimeFormat', (value) => {
  if (!value) {
    return ''
  }
  return moment(value).format('MM/DD HH:mm')
})
