<template>
  <div id="topLineChart" class="mx-auto" />
</template>
<script type="text/javascript">
export default {
  name: 'TopLineChart',
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
      this.myChart = this.$echarts.init(document.getElementById('topLineChart'))
      this.myChart.setOption({
        color: ['#0D7684', '#0E1D3B'],
        tooltip: {
          trigger: 'axis',
          formatter: '{c}名'
        },
        xAxis: [
          {
            type: 'category',
            data: this.data.label,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '人数(名)',
            min: 0,
            axisLabel: {
              formatter: (value) => {
                return value.toLocaleString()
              }
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: 4,
            data: this.data.value
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
    #topLineChart
      width: 100%
      height: 350px
  @media #{map-get($display-breakpoints, 'md-and-up')}
    #topLineChart
      width: 100%
      height: 450px

</style>
