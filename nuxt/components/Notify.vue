<template>
  <div />
</template>

<script>
export default {
  name: 'Notify',
  created () {
    this.$bus.$on('notification.success', (res) => {
      const message = res.data.message || res.message
      if (message) {
        this.$notify.success({
          title: '成功',
          message
        })
      }
    })
    this.$bus.$on('notification.error', (err) => {
      const message = err.response.data.message || err.message
      this.$notify.error({
        title: 'エラー',
        message
      })
    })
  },
  beforeDestroy () {
    this.$bus.$off('notification.success')
    this.$bus.$off('notification.error')
  }
}
</script>
