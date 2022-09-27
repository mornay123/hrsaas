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
              <el-button size="small" type="success">分配权限</el-button>
              <el-button size="small" type="primary">编辑</el-button>
              <el-button size="small" type="danger">删除</el-button>
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
        <el-tab-pane label="公司信息" name="second">公司信息</el-tab-pane>
      </el-tabs>
    </el-card>
    <AddRole :dialog-visible.sync="dialogVisible" @refreshList="getRoleList" />
  </div>
</template>

<script>
import { getRoleList } from '@/api/setting'
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
      dialogVisible: false
    }
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
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    addRole() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
