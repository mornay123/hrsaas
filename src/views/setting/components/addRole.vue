<template>
  <el-dialog
    title="新增角色"
    width="50%"
    :visible.sync="dialogVisible"
    :before-close="onClose"
  >
    <el-form
      ref="roleDialogForm"
      label-width="80px"
      :model="roleForm"
    >
      <el-form-item
        prop="name"
        label="角色"
        :rules="[{ required: true, message: '角色名称不能为空', trigger: 'blur' }]"
      >
        <el-input v-model="roleForm.name" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="roleForm.description" type="textarea" row="3" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button v-model="loading" type="primary" @click="submit">确 定</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { addRole } from '@/api/setting'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleForm: {
        name: '',
        description: ''
      },
      loading: false
    }
  },
  methods: {
    onClose() {
      this.$emit('update:dialogVisible', false) // 关闭弹窗
      this.$refs.roleDialogForm.resetFields() // 重置表单
    },
    async submit() {
      try {
        this.$refs.roleDialogForm.validate()
        // 接口
        this.loading = true // 加载控制，避免重复点击加载
        await addRole(this.roleForm) // 添加数据到后台
        this.$emit('refreshList') // 渲染新列表
        this.$message.success('角色新增成功') // 提示信息
        this.onClose() // 关闭弹窗,重置表单
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
