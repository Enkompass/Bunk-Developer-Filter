<template>
  <div id="methodByChart" class="mx-auto" />
</template>

<script>
export default {
  name: 'MethodByChart',
  props: {
    data: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    myChart: null
  }),
  mounted () {
    this.echartsInit1()
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  beforeDestroy () {
    // Unregister the event listener before destroying this Vue instance
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize () {
      this.myChart.resize()
    },
    echartsInit1 () {
      this.myChart = this.$echarts.init(document.getElementById('methodByChart'))
      this.myChart.setOption({
        color: ['#0d7684', '#9d931f', '#0e1d3b'],
        tooltip: {
          trigger: 'item',
          formatter: '{c} ({d}%)'
        },
        legend: {
          show: false
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['70%', '75%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            },
            data: this.data.map(item => ({
              value: item.price,
              name: item.method
            }))
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="sass">
  @import '../../../node_modules/vuetify/src/styles/styles'

  @media #{map-get($display-breakpoints, 'sm-and-down')}
    #methodByChart
      width: 100%
      height: 200px
  @media #{map-get($display-breakpoints, 'md-and-up')}
    #methodByChart
      width: 100%
      height: 300px

</style>
