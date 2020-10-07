export default {
  data: () => ({
    rules:
      {
        required: value => !!value || '必須値',
        email: (value) => {
          const pattern = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return !value || pattern.test(value) || 'Eメールが無効です'
        },
        min: v => v.length >= 8 || '最低8字',
        max: v => v.length <= 120 || '最大120文字',
        number: (v) => {
          const reg = /^\d+$/
          return !v || reg.test(v) || '半角で入力してください'
        },
        discount: (value, price) => {
          if (!value || !price) {
            return true
          }
          const parseValue = parseInt(value)
          const parsePrice = parseInt(price)
          return parseValue <= (parsePrice * 0.5) || '※定価の最大50%まで可'
        },
        minValue: v => v >= 5 || 'This field must be over 5',
        minLength: v => v.length >= 10 || 'Min 10 characters',
        maxLength: v => v.length <= 50 || 'Max 50 characters',
        percentage: v => (v >= 1 && v <= 100) || 'This filed must be between 0 and 100',
        ip_address: (v) => {
          const regIp = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9]*[A-Za-z0-9])$/
          // const regExpIp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
          // const regExpHostname = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9]*[A-Za-z0-9])$/
          return !v || regIp.test(v) || 'You entered an invalid Ip'
        },
        isValidUrl: (string) => {
          let url
          try {
            url = new URL(string)
          } catch (e) {
            return 'You Must enter the valid link'
          }
          return url.protocol === 'http:' || url.protocol === 'https:' || '有効なリンクを入力する必要があります'
        }
      }
  }),
  methods: {
    getDay (date) {
      return this.$moment(date).format('D')
    }
  }
}
