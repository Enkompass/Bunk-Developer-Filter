<template>
  <div id="mixChart" class="mx-auto" />
</template>
<script type="text/javascript">
export default {
  name: 'MixChart',
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
      this.myChart = this.$echarts.init(document.getElementById('mixChart'))
      this.myChart.setOption({
        color: ['#0D7684', '#0E1D3B'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: this.data.days,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '売上(円)',
            min: 0,
            axisLabel: {
              formatter: (value) => {
                return value.toLocaleString()
              }
            }
          },
          {
            type: 'value',
            name: '受注件数',
            min: 0,
            axisLabel: {
              formatter: (value) => {
                return value.toLocaleString()
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '売上(円)',
            type: 'bar',
            barWidth: 4,
            data: this.data.price
          },
          {
            name: '受注件数',
            type: 'line',
            symbolSize: 8,
            yAxisIndex: 1,
            data: this.data.order_count
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
    #mixChart
      width: 100%
      height: 250px
  @media #{map-get($display-breakpoints, 'md-and-up')}
    #mixChart
      width: 100%
      height: 350px

</style>
