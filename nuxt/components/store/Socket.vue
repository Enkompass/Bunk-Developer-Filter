<template>
  <div />
</template>

<script>
export default {
  name: 'Socket',
  data: () => ({
  }),
  created () {
    /* console.log(this.$socket)
    this.$socket.$subscribe('receive_order', (payload) => {
      console.log(payload)
    })
    this.$socket.emit('connected', { uid: '12345', title: 'title' })
    this.$socket.on('success', (data) => {
      this.$notify.success({
        title: 'Accepting',
        message: JSON.stringify(data.message)
      })
    })
    this.$socket.on('receive_order', (data) => {
      this.$notify.success({
        title: 'Socket',
        message: JSON.stringify(data)
      })
    }) */
  }
}
</script>
