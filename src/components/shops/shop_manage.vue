<template>
  <div class="goods_main">
    <div class="goods_search">
      <div class="input">
        <el-input
          placeholder="请输入商品名称"
          clearable
          @clear="clearSeach"
          v-model.trim="shopName"
          @keyup.enter.native="serachName"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="serachName"
          ></el-button>
        </el-input>
      </div>
      <el-button type="primary" id="addUser" @click="toShopAdd"
        >添加商品</el-button
      >
    </div>
    <div class="goods_form">
      <el-table :data="goodsList" style="width: 100%" border="">
        <el-table-column
          type="index"
          label="#"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delShop(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="goods_page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 3, 4, 5]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalpage"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 当前页码
      pagenum: 1,
      // 每页显示数量
      pagesize: 5,
      // 商品表格
      goodsList: [],
      // 总页数
      totalpage: 0,
      shopName: ''
    }
  },
  methods: {
    //  获取商品列表数据
    async getGoods(query) {
      const { data: res } = await this.$axios.get('/goods', {
        params: {
          query: query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (res.meta.status !== 200) {
        return this.showMessage('error', res.meta.msg)
      }

      if (this.pagenum === 1 && res.data.goods.length === 0) {
        this.showMessage('warning', '很抱歉,没有找到此商品')
      } else if (this.pagenum !== 1 && res.data.goods.length === 0) {
        this.pagenum -= 1
        this.getGoods(query)
      }
      this.totalpage = res.data.total
      this.goodsList = res.data.goods
      res.data.goods.forEach(element => {
        element.add_time = this.$format(element.add_time, 'yyyy-dd-MM')
      })
      return res.data
    },

    // 切换每页显示的数量
    handleSizeChange(val) {
      this.pagesize = val
      this.getGoods(this.shopName)
    },

    // 切换当前页
    handleCurrentChange(val) {
      this.pagenum = val
      this.getGoods(this.shopName)
    },

    // 跳转添加商品页面
    toShopAdd() {
      this.$router.push('/goods/add')
    },

    // 删除某一商品
    delShop(scope) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(
            '/goods/' + scope.goods_id
          )
          if (res.meta.status !== 200) {
            return this.showMessage('error', res.meta.msg)
          }
          this.showMessage('success', res.meta.msg)
          return this.getGoods(this.shopName)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    serachName() {
      if (this.shopName.length === 0) return
      this.pagenum = 1
      this.getGoods(this.shopName)
    },
    clearSeach() {
      this.getGoods(this.shopName)
    }
  },
  mounted() {
    this.getGoods(this.shopName)
  },
  watch: {}
}
</script>
<style scoped>
.tableBtn {
  padding: 0.3rem 1rem;
  font-size: 0.6rem;
}

.tableFlex {
  display: flex !important;
}
.goods_search {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1.5rem;
}
.goods_form {
  margin-bottom: 1.5rem;
}
.goods_page {
  display: flex;
  justify-content: center;
}
.input {
  margin-right: 2rem;
}
.top {
  text-align: center;
}
#addGoods {
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
}
</style>
<style>
.el-pagination span,
.el-pager li {
  min-width: 1.511rem !important;
  height: 1.194rem !important;
  line-height: 1.194rem !important;
  font-size: 0.553rem !important;
}
</style>
<style>
.el-table .cell {
  display: flex;
  justify-content: center;
}
</style>
