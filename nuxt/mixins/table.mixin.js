export default {
  data: () => ({
    table: {
      data: []
    },
    options: {
      itemsPerPage: 10
    },
    footerProps: {
      'items-per-page-options': [10, 25, 50, 100]
    },
    search: '',
    params: {},
    loading: false
  }),
  computed: {
    total () {
      return this.table.meta ? this.table.meta.total : 0
    }
  },
  watch: {
    options: 'fetchData'
  },
  methods: {
    async fetchData () {
      try {
        this.loading = true
        const { data } = await this.getAll(Object.assign(this.options, { search: this.search }, this.params))
        this.table = data
        this.table.data = this.table.data.filter(item => item.Name.toLowerCase().includes(this.params.search.toLowerCase()))
        if (this.params.type) {
          this.table.data = this.table.data.filter(item => item.Type === this.params.type)
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    }
  }
}
