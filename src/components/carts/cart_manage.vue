<template>
  <div class="orders_main">
    <div class="orders_header">
      <el-input
        placeholder="请输入内容"
        clearable
        v-model.trim="orderNumber"
        @keyup.enter.native="searchOrder"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          v-model="orderNumber"
          @click="searchOrder"
        ></el-button>
      </el-input>
    </div>
    <div class="orders_main">
      <el-table :data="ordersList" style="width: 100%" border>
        <el-table-column
          type="index"
          label="#"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column label="是否付款" header-align="center" align="center">
          <template slot-scope="payStatus">
            <el-tag
              type="danger"
              v-if="payStatus.row.pay_status === '0'"
              effect="dark"
              >未支付</el-tag
            >
            <el-tag type="success" effect="dark" v-else>已支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="create_time"
          label="下单时间"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="editOrder">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getaddrForm()"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-position"
              size="mini"
              @click="getLogistics(editOrder.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="orders_pages">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[3, 4, 5, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 弹窗 -->
    <el-dialog title="修改地址" :visible.sync="dialogForm">
      <el-form :model="addrForm" ref="addrForm" :rules="addrRules">
        <el-form-item
          label="省市区/县"
          :label-width="formLabelWidth"
          prop="region"
        >
          <el-cascader
            v-model="addrForm.region"
            :options="citydata"
            :props="{ expandTrigger: 'hover', value: 'value', label: 'label' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="详细地址"
          :label-width="formLabelWidth"
          prop="addr"
        >
          <el-input v-model="addrForm.addr" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForm = false">取 消</el-button>
        <el-button type="primary" @click="determine('addrForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="物流进度" :visible.sync="dialogText">
      <div></div>
      <div slot="footer">
        <el-button @click="dialogText = false">取 消</el-button>
        <el-button type="primary" @click="dialogText = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import citydata from '../../assets/js/citydata'
export default {
  data() {
    return {
      // 订单列表
      ordersList: [],
      // 数据的总数量
      total: 0,
      // 当前页码
      pagenum: 1,
      // 每页展示的数据
      pagesize: 5,
      // 搜索关键词
      orderNumber: '',
      // 省市数据
      citydata: citydata,
      // 修改地址弹出框
      dialogForm: false,
      // 弹出框表单宽度
      formLabelWidth: '120px',
      // 修改地址表单数据
      addrForm: {
        // addr 详细地址
        addr: '',
        // region 地区
        region: []
      },
      // 地址表单规则
      addrRules: {
        addr: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        region: [{ required: true, message: '请选择省市区', trigger: 'blur' }]
      },
      // 物流进度弹出框
      dialogText: false
    }
  },
  methods: {
    async getOrder(query) {
      // 如果query存在就是搜索，不存在就是全部查询
      const { data: res } = await this.$axios.get('/orders', {
        params: {
          query: query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (res.meta.status !== 200) {
        return this.showMessage('error', res.meta.msg)
      }
      this.total = res.data.total
      res.data.goods.forEach(element => {
        element.create_time = this.$moment(element.create_time).format(
          'YYYY-DD-MM'
        )
      })
      this.ordersList = res.data.goods
    },

    // 每页展示的数据
    handleSizeChange(val) {
      this.pagesize = val
      this.getOrder(this.orderNumber)
    },

    // 当前页
    handleCurrentChange(val) {
      this.pagenum = val
      this.getOrder(this.orderNumber)
    },

    // 搜索订单编号
    searchOrder() {
      this.pagenum = 1
      this.getOrder(this.orderNumber)
    },

    // 获取修改地址的表单
    getaddrForm() {
      this.dialogForm = true
    },

    // 省市区选择方法
    handleChange(value) {
      console.log(value)
    },

    // 确认修改地址
    determine(ref) {
      this.$refs[ref].validate(valid => {
        if (!valid) return
        this.dialogForm = false
      })
    },

    // 获取物流进度弹出框
    async getLogistics(scope) {
      this.dialogText = true
      const { data: res } = await this.$axios.get('/kuaidi/804909574412544580')
      console.log(scope, res)
    }
  },
  mounted() {
    this.getOrder(this.orderNumber)
  }
}
</script>
<style scoped>
.orders_header {
  width: 30%;
  margin-bottom: 1.5rem;
}
.orders_header,
.orders_main {
  margin-bottom: 1.5rem;
}
.orders_pages {
  display: flex;
  justify-content: center;
}
</style>
