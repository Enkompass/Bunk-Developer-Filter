<template>
  <div id="timelyChart" class="mx-auto" />
</template>

<script>
export default {
  name: 'TimelyChart',
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
      this.myChart = this.$echarts.init(document.getElementById('timelyChart'))
      this.myChart.setOption({
        color: ['#0d7684', '#3d919c', '#6dacb5', '#9ec8ce', '#cfe4e6', '#9d931f', '#b1a94c', '#c4be79', '#d8d4a5', '#ebe9d2', '#0e1d3b', '#3e4a62', '#6e7789', '#9fa5b1'],
        tooltip: {
          trigger: 'item',
          formatter: '{c}'
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
            data: this.data.map(item => item.percentage)
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
    #timelyChart
      width: 100%
      height: 200px
  @media #{map-get($display-breakpoints, 'md-and-up')}
    #timelyChart
      width: 100%
      height: 300px

</style>
