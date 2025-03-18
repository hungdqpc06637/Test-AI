import { defineStore } from 'pinia'

interface StatCard {
  title: string
  value: number
  prefix?: string
  suffix?: string
  icon: string
  color: string
  percent?: number
  increase?: boolean
}

interface ChartData {
  revenueData: {
    categories: string[]
    series: {
      name: string
      data: number[]
    }[]
  }
  userGrowthData: {
    categories: string[]
    series: {
      name: string
      data: number[]
    }[]
  }
  salesDistributionData: {
    series: {
      name: string
      value: number
    }[]
  }
}

interface Order {
  id: number
  customer: string
  date: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
}

interface DashboardState {
  stats: StatCard[]
  chartData: ChartData
  recentOrders: Order[]
  loading: boolean
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    stats: [
      {
        title: 'Tổng người dùng',
        value: 4385,
        icon: 'user',
        color: '#1890ff',
        percent: 15.8,
        increase: true
      },
      {
        title: 'Doanh thu',
        value: 126500,
        prefix: '₫',
        suffix: 'k',
        icon: 'money-collect',
        color: '#52c41a',
        percent: 8.2,
        increase: true
      },
      {
        title: 'Đơn hàng',
        value: 758,
        icon: 'shopping-cart',
        color: '#722ed1',
        percent: 3.1,
        increase: false
      },
      {
        title: 'Tỷ lệ chuyển đổi',
        value: 6.8,
        suffix: '%',
        icon: 'rise',
        color: '#fa8c16',
        percent: 4.2,
        increase: true
      }
    ],
    chartData: {
      revenueData: {
        categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        series: [
          {
            name: 'Doanh thu',
            data: [35, 41, 62, 42, 58, 63, 60, 66, 78, 76, 86, 95]
          },
          {
            name: 'Chi phí',
            data: [20, 25, 30, 22, 30, 35, 30, 40, 42, 45, 55, 60]
          }
        ]
      },
      userGrowthData: {
        categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        series: [
          {
            name: 'Người dùng mới',
            data: [120, 132, 101, 134, 190, 230, 210, 180, 200, 220, 240, 220]
          },
          {
            name: 'Người dùng hoạt động',
            data: [220, 232, 201, 234, 290, 330, 310, 280, 300, 320, 340, 320]
          }
        ]
      },
      salesDistributionData: {
        series: [
          { name: 'Điện thoại', value: 35 },
          { name: 'Máy tính', value: 20 },
          { name: 'Phụ kiện', value: 18 },
          { name: 'Thiết bị thông minh', value: 15 },
          { name: 'Khác', value: 12 }
        ]
      }
    },
    recentOrders: [
      {
        id: 1001,
        customer: 'Nguyễn Văn A',
        date: '2025-03-15',
        amount: 1250000,
        status: 'completed'
      },
      {
        id: 1002,
        customer: 'Trần Thị B',
        date: '2025-03-16',
        amount: 850000,
        status: 'processing'
      },
      {
        id: 1003,
        customer: 'Lê Văn C',
        date: '2025-03-16',
        amount: 2100000,
        status: 'pending'
      },
      {
        id: 1004,
        customer: 'Phạm Thị D',
        date: '2025-03-17',
        amount: 750000,
        status: 'completed'
      },
      {
        id: 1005,
        customer: 'Hoàng Văn E',
        date: '2025-03-17',
        amount: 1800000,
        status: 'cancelled'
      }
    ],
    loading: false
  }),
  
  getters: {
    totalRevenue: (state) => {
      return state.recentOrders.reduce((sum, order) => sum + order.amount, 0)
    },
    ordersByStatus: (state) => (status: Order['status']) => {
      return state.recentOrders.filter(order => order.status === status)
    }
  },
  
  actions: {
    fetchDashboardData() {
      this.loading = true
      // Simulate API call
      setTimeout(() => {
        // Data is already loaded in state
        this.loading = false
      }, 1000)
    }
  }
})
