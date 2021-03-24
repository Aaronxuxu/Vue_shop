<template>
  <div class="">
    <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="权限等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level == 0" type="">一级</el-tag>
          <el-tag v-else-if="scope.row.level == 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    async getRight() {
      const { data: res } = await this.$axios.get('/rights/list')
      if (res.meta.status !== 200) {
        return this.showMessage('error', res.meta.msg)
      }
      return (this.tableData = res.data)
    }
  },
  created() {
    this.getRight()
  }
}
</script>
<style></style>
