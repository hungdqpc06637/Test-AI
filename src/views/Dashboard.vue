<script setup lang="ts">
import { ref, onMounted, h, defineComponent } from 'vue'
import type { TableColumnsType } from 'ant-design-vue'
import {
  UserOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  MoneyCollectOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons-vue'
import { useDashboardStore } from '@/stores/dashboard'
import * as echarts from 'echarts'

const dashboardStore = useDashboardStore()
const { stats, chartData, recentOrders } = dashboardStore

onMounted(() => {
  dashboardStore.fetchDashboardData()
  initRevenueChart()
  initUserGrowthChart()
  initSalesDistributionChart()
})

// Revenue chart
const initRevenueChart = () => {
  const chartDom = document.getElementById('revenue-chart')
  if (!chartDom) return

  const chart = echarts.init(chartDom)
  const option = {
    title: {
      text: 'Doanh thu & Chi phí',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Doanh thu', 'Chi phí'],
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
      data: chartData.revenueData.categories
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Doanh thu',
        type: 'line',
        data: chartData.revenueData.series[0].data,
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#1890ff'
        },
        itemStyle: {
          color: '#1890ff'
        }
      },
      {
        name: 'Chi phí',
        type: 'line',
        data: chartData.revenueData.series[1].data,
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#52c41a'
        },
        itemStyle: {
          color: '#52c41a'
        }
      }
    ]
  }

  chart.setOption(option)

  // Handle resize
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// User growth chart
const initUserGrowthChart = () => {
  const chartDom = document.getElementById('user-growth-chart')
  if (!chartDom) return

  const chart = echarts.init(chartDom)
  const option = {
    title: {
      text: 'Tăng trưởng người dùng',
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
        type: 'bar',
        data: chartData.userGrowthData.series[0].data,
        itemStyle: {
          color: '#722ed1'
        }
      },
      {
        name: 'Người dùng hoạt động',
        type: 'bar',
        data: chartData.userGrowthData.series[1].data,
        itemStyle: {
          color: '#fa8c16'
        }
      }
    ]
  }

  chart.setOption(option)

  // Handle resize
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// Sales distribution chart
const initSalesDistributionChart = () => {
  const chartDom = document.getElementById('sales-distribution-chart')
  if (!chartDom) return

  const chart = echarts.init(chartDom)
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
      orient: 'horizontal',
      bottom: 0,
      data: chartData.salesDistributionData.series.map(item => item.name)
    },
    series: [
      {
        name: 'Doanh số',
        type: 'pie',
        radius: ['40%', '70%'],
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

  // Handle resize
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// Get icon component based on icon name
const getIconComponent = (iconName: string) => {
  const icons = {
    'user': UserOutlined,
    'shopping-cart': ShoppingCartOutlined,
    'rise': RiseOutlined,
    'money-collect': MoneyCollectOutlined
  }
  return icons[iconName as keyof typeof icons] || UserOutlined
}

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value)
}

// Get status color
const getStatusColor = (status: string) => {
  const colors = {
    'pending': '#faad14',
    'processing': '#1890ff',
    'completed': '#52c41a',
    'cancelled': '#f5222d'
  }
  return colors[status as keyof typeof colors] || '#000'
}

// Get status text
const getStatusText = (status: string) => {
  const texts = {
    'pending': 'Chờ xử lý',
    'processing': 'Đang xử lý',
    'completed': 'Hoàn thành',
    'cancelled': 'Đã hủy'
  }
  return texts[status as keyof typeof texts] || status
}

// Define table columns
const columns: TableColumnsType = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Khách hàng', dataIndex: 'customer', key: 'customer' },
  { title: 'Ngày', dataIndex: 'date', key: 'date' },
  {
    title: 'Số tiền',
    dataIndex: 'amount',
    key: 'amount',
    customRender: ({ text }) => formatCurrency(text as number)
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }) => {
      return h(
        'span',
        {
          style: {
            color: getStatusColor(text as string),
            padding: '4px 8px',
            backgroundColor: getStatusColor(text as string) + '15',
            borderRadius: '4px'
          }
        },
        getStatusText(text as string)
      )
    }
  }
]
</script>

<template>
  <div class="dashboard-container">
    <!-- Stats Cards -->
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="12" :md="12" :lg="6" v-for="(stat, index) in stats" :key="index">
        <a-card class="stat-card" :bordered="false">
          <div class="stat-icon" :style="{ backgroundColor: stat.color + '15' }">
            <component :is="getIconComponent(stat.icon)" :style="{ color: stat.color }" />
          </div>
          <div class="stat-content">
            <div class="stat-title">{{ stat.title }}</div>
            <div class="stat-value">
              <span v-if="stat.prefix">{{ stat.prefix }}</span>
              {{ stat.value.toLocaleString() }}
              <span v-if="stat.suffix">{{ stat.suffix }}</span>
            </div>
            <div class="stat-percent" :class="{ 'increase': stat.increase, 'decrease': !stat.increase }">
              <component :is="stat.increase ? ArrowUpOutlined : ArrowDownOutlined" />
              {{ stat.percent }}%
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Charts -->
    <a-row :gutter="[16, 16]" class="chart-row">
      <a-col :xs="24" :md="24" :lg="16">
        <a-card :bordered="false" class="chart-card">
          <div id="revenue-chart" class="chart"></div>
        </a-card>
      </a-col>
      <a-col :xs="24" :md="24" :lg="8">
        <a-card :bordered="false" class="chart-card">
          <div id="sales-distribution-chart" class="chart"></div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" class="chart-row">
      <a-col :span="24">
        <a-card :bordered="false" class="chart-card">
          <div id="user-growth-chart" class="chart"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Recent Orders Table -->
    <a-card :bordered="false" title="Đơn hàng gần đây" class="table-card">
      <a-table :dataSource="recentOrders" :columns="columns" :pagination="{ pageSize: 5 }"
        :rowKey="(record: any) => record.id" />
    </a-card>
  </div>
</template>

<style scoped>
.dashboard-container {
  width: 100%;
}

.stat-card {
  display: flex;
  align-items: center;
  height: 100%;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  font-size: 24px;
  margin-right: 16px;
}

.stat-content {
  flex: 1;
}

.stat-title {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 4px;
}

.stat-percent {
  font-size: 12px;
}

.stat-percent.increase {
  color: #52c41a;
}

.stat-percent.decrease {
  color: #f5222d;
}

.chart-row {
  margin-top: 16px;
}

.chart-card {
  height: 100%;
}

.chart {
  height: 300px;
  width: 100%;
}

.table-card {
  margin-top: 16px;
}

/* Dark theme adjustments */
:deep(.dark-theme) .stat-title {
  color: rgba(255, 255, 255, 0.65);
}

:deep(.dark-theme) .ant-card {
  background-color: #1f1f1f;
  color: rgba(255, 255, 255, 0.85);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .stat-value {
    font-size: 20px;
  }


  .chart {
    height: 250px;
  }
}
</style>
