<template>
  <div>
    <PageTools type="success" :show-before="true">
      <template #before>
        <span>共25条记录</span>
      </template>
      <template #after>
        <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
        <el-button size="small" type="danger" @click="exportExcel">导出</el-button>
        <el-button size="small" type="primary" @click="addEmployee">新增员工</el-button>
      </template>
    </PageTools>
    <el-card>
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" sortable="" width="80" type="index" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="工号" prop="workNumber" />
        <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatEmployment" />
        <el-table-column label="部门" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template slot-scope="{ row }">{{ row.timeOfEntry | formatDate }}</template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState">
          <template slot-scope="{ row }"><el-switch :value="row.enableState===1" /></template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="goDetail(row)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next,total,sizes"
          :total="total"
          :current-page.sync="page.page"
          :page-size.sync="page.size"
          :page-sizes="[2,5,10]"
          @current-change="getEmployeeList"
          @size-change="getEmployeeList"
        />
      </el-row>
    </el-card>
    <add-employee :dialog-visible.sync="dialogVisible" :hire-type="hireType" />
  </div>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import PageTools from '@/components/pageTools'
import { getEmployeeList, delEmployee } from '@/api/employees'
import AddEmployee from './components/add-employee.vue'
export default {
  name: 'HrsaasIndex',
  components: {
    PageTools,
    AddEmployee
  },
  data() {
    return {
      page: {
        page: 1, // 当前页码
        size: 10
      },
      list: [], // 接数据的
      total: 0, // 总数
      loading: false,
      hireType: EmployeeEnum.hireType,
      dialogVisible: false
    }
  },

  mounted() {
    this.getEmployeeList()
  },

  methods: {
    async getEmployeeList() {
      try {
        this.loading = true
        const { rows, total } = await getEmployeeList(this.page)
        this.list = rows
        this.total = total
        // console.log(rows)
      } finally {
        this.loading = false
      }
    },
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = this.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    addEmployee() {
      this.dialogVisible = true
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    async exportExcel() {
      const { export_json_to_excel } = await import('@/vendor/Export2Excel')
      const { rows } = await getEmployeeList({
        page: 1,
        size: this.total
      })
      // console.log(rows)
      const exportExcelMapPath = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // const header = ['手机号', '姓名', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const header = Object.keys(exportExcelMapPath)
      const data = rows.map(ele => {
        return header.map(item => {
          if (item === '聘用形式') {
            const find = this.hireType.find(hire => hire.id === ele[exportExcelMapPath[item]])
            return find ? find.value : '未知'
          }
          return ele[exportExcelMapPath[item]]
        })
      })
      await export_json_to_excel({
        header, // 表头 必填
        multiHeader: [['手机号', '主要信息', '', '', '', '', '部门']],
        merges: ['A1:A2', 'B1:F1', 'G1:G2'],
        data, // 具体数据 必填
        filename: '黑马人员列表', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
      // console.log(data)
    },
    goDetail(row) {
      this.$router.push('/employees/detail/' + row.id)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
