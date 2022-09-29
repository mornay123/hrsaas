<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName" v-loading="loading">
        <el-tab-pane label="角色管理" name="first">
          <el-row>
            <el-button type="primary" style="margin-left:10px" icon="el-icon-plus" size="small" @click="addRole">新增角色</el-button>
          </el-row>
          <el-table
            :data="roleList"
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" width="120" />
            <el-table-column label="角色名称" width="240" prop="name" />
            <el-table-column label="描述" prop="description" />
            <el-table-column label="操作" width="240">
              <template slot-scope="scope">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row :gutter="10" type="flex" justify="center" align="middle" style="height:60px">
            <el-pagination
              background
              layout="prev, pager, next,sizes"
              :total="total"
              :current-page.sync="page.page"
              :page-size.sync="page.pagesize"
              :page-sizes="[2,4,10]"
              @current-change="getRoleList"
              @size-change="getRoleList"
            />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <el-form label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input v-model="companyInfo.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

      </el-tabs>
    </el-card>
    <AddRole ref="addRole" :dialog-visible.sync="dialogVisible" @refreshList="getRoleList" />
  </div>
</template>

<script>
import { getRoleList, deleteRole, getCompanyInfo } from '@/api/setting'
import { mapGetters } from 'vuex'
import AddRole from './components/addRole.vue'
export default {
  name: 'HrsaasIndex',
  components: {
    AddRole
  },
  data() {
    return {
      activeName: 'first',
      roleList: [],
      page: {
        page: 1,
        pagesize: 10
      },
      loading: false,
      total: 0,
      dialogVisible: false,
      companyInfo: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getCompanyInfo()
  },
  mounted() {
    this.getRoleList()
  },

  methods: {
    async getRoleList() {
      try {
        this.loading = true
        const { total, rows } = await getRoleList(this.page)
        this.total = total
        this.roleList = rows
        // console.log(rows)
        if (total > 0 && rows.length === 0) {
          this.page.page-- // 删除完一页，跳到上一页
          this.getRoleList()
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    addRole() {
      this.dialogVisible = true
    },
    edit(row) {
      this.$refs.addRole.roleForm = { ...row }
      this.dialogVisible = true
    },
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该组件吗？', '提示', {
          confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning'
        })
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (e) {
        console.log(e)
      }
    },
    async getCompanyInfo() {
      this.companyInfo = await getCompanyInfo(this.companyId)
      console.log(this.companyInfo)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
