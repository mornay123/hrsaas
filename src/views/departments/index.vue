<template>
  <div v-loading="loading" class="departments-container">
    <el-card>
      <tree-tool :tree-node="company" :is-root="false" @addDepts="handleDepts" />
    </el-card>
    <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
      <tree-tool
        slot-scope="{ data }"
        :tree-node="data"
        @addDepts="handleDepts"
        @editDept="editDept"
        @refreshList="getDepartments"
      />
    </el-tree>
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="currenNode" />
  </div>
</template>

<script>
import AddDept from './component/addDept.vue'
import { tranListToTreeData } from '@/utils/index'
import { getDepartments } from '@/api/departments'
import treeTool from './component/treetools.vue'
export default {
  name: 'HrsaasIndex',
  components: {
    treeTool,
    AddDept
  },
  data() {
    return {
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isRoot: true,
      showDialog: false,
      currenNode: {},
      loading: false
    }
  },

  mounted() {
    this.getDepartments()
  },

  methods: {
    async getDepartments() {
      const { depts, companyName, companyManager } = await getDepartments()
      this.departs = tranListToTreeData(depts, '')
      this.company = { name: companyName, manager: companyManager, id: '' }
      // console.log(this.departs)
    },
    handleDepts(node) {
      this.showDialog = true // 显示弹层
      this.currenNode = node
    },
    editDept(row) {
      this.currentNode = { ...row }
      this.$refs.addDept.formData = { ...row } // 弹框回显数据
      this.showDialog = true
    }
  }
}
</script>

<style lang="scss">
.departments-container {
  width: 900px;
  margin: 20px auto;
  .el-tree {
    .el-tree-node__content {
      padding-right: 20px;
    }
  }
}
</style>
