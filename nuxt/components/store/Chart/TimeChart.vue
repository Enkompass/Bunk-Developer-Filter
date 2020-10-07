<template>
  <div id="timeChart" class="mx-auto" />
</template>

<script>
export default {
  name: 'TimeChart',
  props: {
    data: {
      type: Object,
      default: () => ({})
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
      this.myChart = this.$echarts.init(document.getElementById('timeChart'))
      this.myChart.setOption({
        color: ['#0d7684', '#9d931f', '#0e1d3b', '#868e9d'],
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: ['65%', '70%'],
            center: ['30%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.data.data.map((item) => {
              return {
                value: item.price,
                name: item.label
              }
            })
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
    #timeChart
      width: 100%
      height: 250px
  @media #{map-get($display-breakpoints, 'md-and-up')}
    #timeChart
      width: 100%
      height: 350px

</style>
