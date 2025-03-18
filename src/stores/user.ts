import { defineStore } from 'pinia'

export interface User {
  id: number
  name: string
  email: string
  role: string
  status: boolean
  avatar?: string
}

interface UserState {
  currentUser: User | null
  users: User[]
  loading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    currentUser: null,
    users: [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'Admin',
        status: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'
      },
      {
        id: 2,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Manager',
        status: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2'
      },
      {
        id: 3,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'User',
        status: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3'
      },
      {
        id: 4,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'User',
        status: false,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4'
      },
      {
        id: 5,
        name: 'Alice Brown',
        email: 'alice@example.com',
        role: 'User',
        status: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5'
      }
    ],
    loading: false
  }),
  
  getters: {
    getUserById: (state) => (id: number) => {
      return state.users.find(user => user.id === id)
    },
    activeUsers: (state) => {
      return state.users.filter(user => user.status)
    },
    userCount: (state) => {
      return state.users.length
    }
  },
  
  actions: {
    setCurrentUser(user: User) {
      this.currentUser = user
    },
    
    addUser(user: Omit<User, 'id'>) {
      const newId = Math.max(0, ...this.users.map(u => u.id)) + 1
      this.users.push({
        id: newId,
        ...user,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newId}`
      })
    },
    
    updateUser(id: number, userData: Partial<User>) {
      const index = this.users.findIndex(user => user.id === id)
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...userData }
      }
    },
    
    deleteUser(id: number) {
      this.users = this.users.filter(user => user.id !== id)
    },
    
    login(email: string, password: string) {
      this.loading = true
      // Simulate API call
      setTimeout(() => {
        const user = this.users.find(u => u.email === email)
        if (user) {
          this.currentUser = user
        }
        this.loading = false
      }, 1000)
    },
    
    logout() {
      this.currentUser = null
    }
  }
})
