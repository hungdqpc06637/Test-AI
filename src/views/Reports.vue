<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import * as echarts from 'echarts'
import moment from 'moment'

// Lấy dữ liệu từ store
const dashboardStore = useDashboardStore()
const { chartData } = dashboardStore

// Khai báo các ref và biến
const dateRange = ref<[moment.Moment, moment.Moment]>([
  moment('2025-01-01'),
  moment('2025-03-31')
])

const reportType = ref<string>('revenue')
const loading = ref(false)

// Tùy chọn báo cáo
const reportOptions = [
  { label: 'Doanh thu', value: 'revenue' },
  { label: 'Người dùng', value: 'users' },
  { label: 'Đơn hàng', value: 'orders' }
]

// Tùy chọn khoảng thời gian
const periodOptions = [
  { label: 'Ngày', value: 'day' },
  { label: 'Tuần', value: 'week' },
  { label: 'Tháng', value: 'month' },
  { label: 'Quý', value: 'quarter' },
  { label: 'Năm', value: 'year' }
]

const selectedPeriod = ref('month')

// Mảng lưu trữ các chart để xử lý resize
const charts: echarts.ECharts[] = []

// Hàm khởi tạo báo cáo
const generateReport = () => {
  loading.value = true

  // Giả lập gọi API
  setTimeout(() => {
    // Xoá mảng charts cũ
    charts.splice(0, charts.length)
    initRevenueChart()
    initUserGrowthChart()
    initSalesDistributionChart()
    loading.value = false
  }, 1000)
}

// Hàm khởi tạo chart doanh thu
const initRevenueChart = () => {
  const chartDom = document.getElementById('report-revenue-chart')
  if (!chartDom) return

  const chart = echarts.init(chartDom)
  charts.push(chart)

  const option = {
    title: {
      text: 'Báo cáo doanh thu',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c} triệu VND'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.revenueData.categories
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} tr'
      }
    },
    series: [
      {
        name: 'Doanh thu',
        type: 'bar',
        data: chartData.revenueData.series[0].data,
        itemStyle: {
          color: '#1890ff'
        },
        emphasis: {
          itemStyle: {
            color: '#40a9ff'
          }
        },
        markLine: {
          data: [
            { type: 'average', name: 'Trung bình' }
          ]
        }
      }
    ]
  }

  chart.setOption(option)
}

// Hàm khởi tạo chart người dùng
const initUserGrowthChart = () => {
  const chartDom = document.getElementById('report-user-chart')
  if (!chartDom) return

  const chart = echarts.init(chartDom)
  charts.push(chart)

  const option = {
    title: {
      text: 'Báo cáo người dùng',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Người dùng mới', 'Người dùng hoạt động'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.userGrowthData.categories
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Người dùng mới',
        type: 'line',
        data: chartData.userGrowthData.series[0].data,
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#722ed1'
        },
        itemStyle: {
          color: '#722ed1'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(114, 46, 209, 0.5)' },
            { offset: 1, color: 'rgba(114, 46, 209, 0.1)' }
          ])
        }
      },
      {
        name: 'Người dùng hoạt động',
        type: 'line',
        data: chartData.userGrowthData.series[1].data,
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#fa8c16'
        },
        itemStyle: {
          color: '#fa8c16'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(250, 140, 22, 0.5)' },
            { offset: 1, color: 'rgba(250, 140, 22, 0.1)' }
          ])
        }
      }
    ]
  }

  chart.setOption(option)
}

// Hàm khởi tạo chart phân bố doanh số
const initSalesDistributionChart = () => {
  const chartDom = document.getElementById('report-sales-chart')
  if (!chartDom) return

  const chart = echarts.init(chartDom)
  charts.push(chart)

  const option = {
    title: {
      text: 'Phân bố doanh số',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      data: chartData.salesDistributionData.series.map(item => item.name)
    },
    series: [
      {
        name: 'Doanh số',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: chartData.salesDistributionData.series.map(item => ({
          value: item.value,
          name: item.name
        }))
      }
    ]
  }

  chart.setOption(option)
}
const formatDate = (date: string) => {
  return moment(date).format('DD/MM/YYYY')
}


// Hàm xuất báo cáo
const exportReport = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    window.alert('Báo cáo đã được xuất thành công!')
  }, 1000)
}

// Dữ liệu tóm tắt báo cáo
const summaryData = computed(() => {
  return {
    totalRevenue: '126.5M VND',
    totalUsers: '4,385',
    totalOrders: '758',
    averageOrderValue: '166.9K VND',
    conversionRate: '6.8%'
  }
})

// Hàm xử lý resize cho tất cả các chart
const handleResize = () => {
  charts.forEach(chart => chart.resize())
}

onMounted(() => {
  generateReport()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
<template>
  <div class="reports-container">
    <!-- Report Controls -->
    <a-card :bordered="false" class="filter-card">
      <a-form layout="inline">
        <a-form-item label="Loại báo cáo">
          <a-select v-model:value="reportType" style="width: 200px">
            <a-select-option v-for="option in reportOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Khoảng thời gian">
          <a-range-picker v-model:value="dateRange" format="YYYY-MM-DD" :placeholder="['Từ ngày', 'Đến ngày']" />
        </a-form-item>

        <a-form-item label="Đơn vị thời gian">
          <a-select v-model:value="selectedPeriod" style="width: 120px">
            <a-select-option v-for="option in periodOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" @click="generateReport" :loading="loading">
            Tạo báo cáo
          </a-button>
          <a-button style="margin-left: 8px" @click="exportReport" :loading="loading">
            <template #icon><download-outlined /></template>
            Xuất báo cáo
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- Report Summary -->
    <a-row :gutter="[16, 16]" class="summary-row">
      <a-col :xs="24" :sm="12" :md="12" :lg="8">
        <a-card :bordered="false">
          <a-statistic title="Tổng doanh thu" :value="summaryData.totalRevenue" :value-style="{ color: '#1890ff' }">
            <template #prefix>
              <money-collect-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="12" :lg="8">
        <a-card :bordered="false">
          <a-statistic title="Tổng người dùng" :value="summaryData.totalUsers" :value-style="{ color: '#722ed1' }">
            <template #prefix>
              <user-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="12" :lg="8">
        <a-card :bordered="false">
          <a-statistic title="Tổng đơn hàng" :value="summaryData.totalOrders" :value-style="{ color: '#52c41a' }">
            <template #prefix>
              <shopping-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- Report Charts -->
    <a-row :gutter="[16, 16]" class="chart-row">
      <a-col :span="24">
        <a-card :bordered="false" class="chart-card">
          <div id="report-revenue-chart" class="chart"></div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" class="chart-row">
      <a-col :xs="24" :lg="12">
        <a-card :bordered="false" class="chart-card">
          <div id="report-user-chart" class="chart"></div>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="12">
        <a-card :bordered="false" class="chart-card">
          <div id="report-sales-chart" class="chart"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Report Details -->
    <a-card :bordered="false" title="Chi tiết báo cáo" class="details-card">
      <a-descriptions bordered>
        <a-descriptions-item label="Khoảng thời gian">
          {{ dateRange[0].format('DD/MM/YYYY') }} - {{ dateRange[1].format('DD/MM/YYYY') }}

        </a-descriptions-item>
        <a-descriptions-item label="Loại báo cáo">
          {{reportOptions.find(o => o.value === reportType)?.label}}
        </a-descriptions-item>
        <a-descriptions-item label="Đơn vị thời gian">
          {{periodOptions.find(o => o.value === selectedPeriod)?.label}}
        </a-descriptions-item>
        <a-descriptions-item label="Giá trị đơn hàng trung bình">
          {{ summaryData.averageOrderValue }}
        </a-descriptions-item>
        <a-descriptions-item label="Tỷ lệ chuyển đổi">
          {{ summaryData.conversionRate }}
        </a-descriptions-item>
        <a-descriptions-item label="Ngày tạo báo cáo">
          {{ new Date().toLocaleDateString('vi-VN') }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<style scoped>
.reports-container {
  width: 100%;
}

.filter-card {
  margin-bottom: 16px;
}

.summary-row {
  margin-bottom: 16px;
}

.chart-row {
  margin-bottom: 16px;
}

.chart-card {
  height: 100%;
}

.chart {
  height: 400px;
  width: 100%;
}

.details-card {
  margin-bottom: 16px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .chart {
    height: 300px;
  }

  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }
}
</style>
