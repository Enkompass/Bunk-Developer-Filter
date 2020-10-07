export default {
  data: () => ({
    editedItem: {},
    editedIndex: -1,
    dialog: {
      form: false
    },
    busy: false
  }),
  created () {
    this.editedItem = JSON.parse(JSON.stringify(this.defaultItem || {}))
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.table.data.indexOf(item)
      this.editedItem = JSON.parse(JSON.stringify(item))
      this.dialog.form = true
    },
    deleteItem (item) {
      this.editedItem = JSON.parse(JSON.stringify(item))
      this.dialog.confirm = true
    },
    async confirm () {
      this.busy = true

      try {
        await this.deleteById(this.editedItem.id)
        this.close()
        this.fetchData()
        this.dialog.confirm = false
      } catch (err) {
      } finally {
        this.busy = false
      }
    },
    add () {
      this.editedIndex = -1
      this.dialog.form = true
      this.disabledForm = false
      this.editedItem = JSON.parse(JSON.stringify(this.defaultItem || { id: -1 }))
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
    },
    async save () {
      this.errors = {}

      if (!this.$refs.form.validate()) {
        return
      }

      this.disabledForm = true
      this.busy = true

      try {
        await this.save_api(this.editedItem)
        this.close()
        this.fetchData()
      } catch (err) {
        if (err.response) {
          this.errors = err.response.data.errors || {}
        }
      } finally {
        this.busy = false
      }
      this.selected = null
    },
    close () {
      if (this.$refs.form) {
        this.$refs.form.reset()
      }
      this.errors = {}
      this.dialog.form = false
      this.dialog.confirm = false
      this.editedItem = JSON.parse(JSON.stringify(this.defaultItem || {}))
      this.editedIndex = -1
    }
  }
}
