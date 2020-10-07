<template>
  <div id="weekChart" class="mx-auto" />
</template>

<script>
export default {
  name: 'WeekChart',
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
      this.myChart = this.$echarts.init(document.getElementById('weekChart'))
      this.myChart.setOption({
        color: ['#0d7684', '#86bac1', '#9d931f', '#cec98f', '#0e1d3b', '#868e9d', '#e6e8eb'],
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
            data: this.data.price.map((item, index) => {
              return {
                value: item,
                name: this.data.weeks[index]
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
    #weekChart
      width: 100%
      height: 250px
  @media #{map-get($display-breakpoints, 'md-and-up')}
    #weekChart
      width: 100%
      height: 350px

</style>
