<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName" tab-click="tabClick">
          <el-tab-pane label="登录账户设置" name="first">

            <!-- 放置表单 -->
            <el-form ref="form" :model="accountInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="accountInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password">
                <el-input v-model="accountInfo.password" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateEmployees">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情" name="second"><UserInfo /></el-tab-pane>
          <el-tab-pane label="岗位信息" name="third"><JobInfo /></el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/user'
import JobInfo from './job-info.vue'
import UserInfo from './user-info.vue'
import Cookie from 'js-cookie'
export default {
  name: 'Detail',
  components: {
    JobInfo,
    UserInfo
  },
  data() {
    return {
      activeName: Cookie.get('activeName') || 'first',
      accountInfo: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, message: '长度最小6位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.loadEmployeesInfo()
  },
  methods: {
    async loadEmployeesInfo() {
      const res = await getUserDetailById(this.$route.params.id)
      this.accountInfo = res
    },
    async updateEmployees() {
      try {
        await this.$refs.form.validate()
        await saveUserDetailById(this.accountInfo)
        this.$message.success('校验成功')
      } catch (error) {
        console.log(error)
      }
    },
    tabClick() {
      Cookie.set('activeName', this.activeName)
    }
  }
}
</script>

<style>

</style>
