<template>
  <div class="">
    <div id="echart" style="width:600px;height:400px"></div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {},
  async mounted() {
    var myChart = echarts.init(document.getElementById('echart'))
    const { data: res } = await this.$axios.get('/reports/type/1')
    if (res.meta.status !== 200) {
      return this.showMessage('error', res.meta.msg)
    }
    var result = _.merge(res.data, this.options)
    myChart.setOption(result)
  }
}
</script>
<style></style>
