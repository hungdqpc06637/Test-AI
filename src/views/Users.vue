<script setup lang="ts">
import { ref, reactive, computed, h } from 'vue'
import type { TableColumnsType } from 'ant-design-vue'
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons-vue'
import { useUserStore, type User } from '@/stores/user'
import AButton from 'ant-design-vue/lib/button'

const userStore = useUserStore()
const users = computed(() => userStore.users)
const loading = ref(false)

// Form state
const formState = reactive({
  visible: false,
  isEdit: false,
  editId: null as number | null,
  form: {
    name: '',
    email: '',
    role: 'User',
    status: true
  },
  rules: {
    name: [{ required: true, message: 'Vui lòng nhập tên' }],
    email: [
      { required: true, message: 'Vui lòng nhập email' },
      { type: 'email', message: 'Email không hợp lệ' }
    ],
    role: [{ required: true, message: 'Vui lòng chọn vai trò' }]
  }
})

// Search state
const searchText = ref('')
const filteredUsers = computed(() => {
  if (!searchText.value) return users.value

  const searchLower = searchText.value.toLowerCase()
  return users.value.filter(user =>
    user.name.toLowerCase().includes(searchLower) ||
    user.email.toLowerCase().includes(searchLower) ||
    user.role.toLowerCase().includes(searchLower)
  )
})

// Table columns
const columns: TableColumnsType = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80
  },
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name',
    sorter: (a: User, b: User) => a.name.localeCompare(b.name)
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email'
  },
  {
    title: 'Vai trò',
    dataIndex: 'role',
    key: 'role',
    filters: [
      { text: 'Admin', value: 'Admin' },
      { text: 'Manager', value: 'Manager' },
      { text: 'User', value: 'User' }
    ],
    onFilter: (value: any, record: User) => record.role === value
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    filters: [
      { text: 'Hoạt động', value: true },
      { text: 'Vô hiệu', value: false }
    ],
    onFilter: (value: any, record: User) => record.status === value,
    customRender: ({ text }) => {
      return h(
        'span',
        {
          style: {
            color: text ? '#52c41a' : '#f5222d',
            display: 'flex',
            alignItems: 'center'
          }
        },
        [
          h(text ? CheckCircleOutlined : CloseCircleOutlined, {
            style: { marginRight: '8px' }
          }),
          text ? 'Hoạt động' : 'Vô hiệu'
        ]
      )
    }
  },
  {
    title: 'Thao tác',
    key: 'action',
    width: 120,
    customRender: ({ record }) => {
      return h('div', { style: { display: 'flex', gap: '8px' } }, [
        h(
          AButton,
          {
            type: 'primary',
            shape: 'circle',
            size: 'small',
            onClick: () => handleEdit(record as User)
          },
          [h(EditOutlined)]
        ),
        h(
          AButton,
          {
            type: 'primary',
            danger: true,
            shape: 'circle',
            size: 'small',
            onClick: () => handleDelete(record as User)
          },
          [h(DeleteOutlined)]
        )
      ])
    }
  }
]

// Role options
const roleOptions = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Manager', value: 'Manager' },
  { label: 'User', value: 'User' }
]

// Handle add user
const handleAdd = () => {
  formState.visible = true
  formState.isEdit = false
  formState.editId = null
  formState.form = {
    name: '',
    email: '',
    role: 'User',
    status: true
  }
}

// Handle edit user
const handleEdit = (user: User) => {
  formState.visible = true
  formState.isEdit = true
  formState.editId = user.id
  formState.form = {
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  }
}

// Handle delete user
const handleDelete = (user: User) => {
  // Show confirmation dialog
  const modal = window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.name}"?`);
  if (modal) {
    userStore.deleteUser(user.id);
  }
}

// Form submit
const formRef = ref()
const handleSubmit = () => {
  formRef.value.validate().then(() => {
    loading.value = true

    setTimeout(() => {
      if (formState.isEdit && formState.editId !== null) {
        userStore.updateUser(formState.editId, formState.form)
      } else {
        userStore.addUser(formState.form)
      }

      formState.visible = false
      loading.value = false
    }, 500)
  })
}

// Form cancel
const handleCancel = () => {
  formState.visible = false
}
</script>

<template>
  <div class="users-container">
    <div class="users-header">
      <a-input-search v-model:value="searchText" placeholder="Tìm kiếm người dùng" style="width: 300px" enter-button />
      <a-button type="primary" @click="handleAdd">
        <template #icon><user-outlined /></template>
        Thêm người dùng
      </a-button>
    </div>

    <!-- Users Table -->
    <a-table :dataSource="filteredUsers" :columns="columns" :loading="loading" :pagination="{ pageSize: 10 }"
      :rowKey="(record: User) => record.id" />

    <!-- Add/Edit User Modal -->
    <a-modal :title="formState.isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'" :open="formState.visible"
      :confirmLoading="loading" @ok="handleSubmit" @cancel="handleCancel">
      <a-form ref="formRef" :model="formState.form" :rules="formState.rules" layout="vertical">
        <a-form-item label="Tên" name="name">
          <a-input v-model:value="formState.form.name" placeholder="Nhập tên người dùng" />
        </a-form-item>

        <a-form-item label="Email" name="email">
          <a-input v-model:value="formState.form.email" placeholder="Nhập email" />
        </a-form-item>

        <a-form-item label="Vai trò" name="role">
          <a-select v-model:value="formState.form.role" placeholder="Chọn vai trò">
            <a-select-option v-for="option in roleOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Trạng thái" name="status">
          <a-switch v-model:checked="formState.form.status" />
          <span style="margin-left: 8px">{{ formState.form.status ? 'Hoạt động' : 'Vô hiệu' }}</span>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.users-container {
  width: 100%;
}

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .users-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
