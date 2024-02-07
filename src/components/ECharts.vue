<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>

<script lang="ts" setup>
  import { PropType, ref, Ref, watch } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';

  const props = defineProps({
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '4.8rem',
    },
    color: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 时间
    echarts: {
      type: Object,
      default: () => {
        return {};
      },
    },
  });

  const upColor = ref<string>('#ef232a');
  const downColor = ref<string>('#14b143');

  const isShow = ref<boolean>(true);

  // 处理数据
  const calculateMA = (dayCount: number, data: any) => {
    let result: any = [];
    for (let i = 0, len = data.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += +data[i - j][1];
      }
      result.push((sum / dayCount).toFixed(2));
    }
    return result;
  };

  const dates = ref<any>([]);
  const data = ref<any>([]);
  const volumes = ref<any>([]);

  const dataMA1 = ref<any>([]);
  const dataMA5 = ref<any>([]);
  const dataMA10 = ref<any>([]);


  watch(() => props.echarts, (newValue: any) => {
    dates.value = newValue.dataList;
    data.value = newValue.price;
    volumes.value = newValue.volumes;
    dataMA1.value = calculateMA(1, data.value);
    dataMA5.value = calculateMA(5, data.value);
    dataMA10.value = calculateMA(10, data.value);
    CreateCanvas();
  }, { deep: true })

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

  const CreateCanvas = (): void => {
    setOptions({
      animation: isShow.value,
      animationEasing: 'linear',
      axisPointer: {
        link: [
          {
            xAxisIndex: [0, 1]
          }
        ]
      },
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: [0, 1],
          realtime: false,
          start: 100,
          end: 30,
          top: 65,
          height: 20,
          show: false
        },
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 100,
          end: 30,
          top: 30,
          height: 20,
        }
      ],
      xAxis: [
        {
          type: 'category',
          data: dates.value,
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#777' } },
          axisLabel: {
            formatter: function (value: any) {
              return value;
            }
          },
          min: 'dataMin',
          max: 'dataMax',
          axisPointer: {
            show: true
          }
        },
        {
          type: 'category',
          gridIndex: 1,
          data: dates.value,
          boundaryGap: false,
          splitLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          axisLine: { lineStyle: { color: '#777' } },
          min: 'dataMin',
          max: 'dataMax',
          axisPointer: {
            type: 'shadow',
            label: { show: false },
            triggerTooltip: true,
            handle: {
              show: false,
              margin: 30,
              color: '#B80C00'
            }
          }
        }
      ],
      yAxis: [
        {
          scale: true,
          splitNumber: 2,
          axisLine: { lineStyle: { color: '#777' } },
          splitLine: { show: true },
          axisTick: { show: false },
          axisLabel: {
            inside: true,
            formatter: '{value}\n'
          }
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false }
        }
      ],
      visualMap: {
        show: false,
        seriesIndex: 5,
        dimension: 2,
        pieces: [
          {
            value: 1,
            color: upColor.value,
          },
          {
            value: -1,
            color: downColor.value,
          }
        ]
      },
      grid: [
        {
          left: 20,
          right: 20,
          top: 50,
          height: 120
        },
        {
          left: 20,
          right: 20,
          height: 40,
          top: 200
        }
      ],
      series: [
        {
          name: 'Volume',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            color: (params: any) => {
              var colorList;
              if (data.value[params.dataIndex][0] > data.value[params.dataIndex][1]) {
                colorList = downColor.value;
              } else {
                colorList = upColor.value;
              }
              return colorList;
            },
          },
          emphasis: {
            itemStyle: {
              color: '#140'
            },
          },
          data: volumes.value
        },
        {
          type: 'candlestick',
          name: '日K',
          data: data.value,
          itemStyle: {
            color: upColor.value,//'#ef232a',
            color0: downColor.value,//'#14b143',
            borderColor: upColor.value,
            borderColor0: downColor.value
          },
          emphasis: {
            itemStyle: {
              color: 'black',
              color0: '#444',
              borderColor: 'black',
              borderColor0: '#444'
            }
          }
        },
        {
          name: 'MA1',
          type: 'line',
          data: dataMA1.value,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1
          }
        },
        {
          name: 'MA5',
          type: 'line',
          data: dataMA5.value,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1
          }
        },
        {
          name: 'MA10',
          type: 'line',
          data: dataMA10.value,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1
          }
        },
      ]
    });
    isShow.value = false;
  };
</script>

<style lang="less" scoped>
</style>