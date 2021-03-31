<template>
  <div class="add_main">
    <div class="add_alert add_base">
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
        show-icon
        center
      ></el-alert>
    </div>
    <div class="add_steps add_base">
      <el-steps :active="active" space="50%" simple finish-status="success">
        <el-step
          v-for="item in steplist"
          :key="item.id"
          :title="item.stepName"
          :icon="item.icon"
        ></el-step>
        <el-step title="完成" icon="el-icon-check"></el-step>
      </el-steps>
    </div>
    <div class="add_cards add_base">
      <el-tabs
        tab-position="left"
        v-model="activeName"
        :before-leave="beforeLeave"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form
            label-position="top"
            label-width="80px"
            :model="goodsForm"
            :rules="goodsRules"
            ref="goodsForm"
          >
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goodsForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="goodsForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="goodsForm.goods_cat"
                :options="options"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                  leaf: 'cat_level'
                }"
                ref="cascRef"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <div
            class="attrsGroup"
            v-for="item in cateTagList"
            :key="item.attr_id"
          >
            <el-tag type="info" effect="dark">{{ item.attr_name }}</el-tag>
            <el-checkbox-group v-model="goodsForm.attrs">
              <el-checkbox
                :label="itemc"
                border
                v-for="(itemc, index) in item.attr_vals"
                :key="index"
                >{{ itemc.attr_value }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <div
            class="attrsGroup"
            v-for="item in cateTagList"
            :key="item.attr_id"
          >
            <el-tag type="" effect="dark">{{ item.attr_name }}</el-tag>
            <el-checkbox-group v-model="goodsForm.attrs">
              <el-checkbox
                :label="itemc"
                border
                v-for="(itemc, index) in item.attr_vals"
                :key="index"
                >{{ itemc.attr_value }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="uploadHeader"
            :on-success="onSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor
            v-model="goodsForm.goods_introduce"
            style="margin-bottom: 1rem"
          ></quill-editor>
          <el-button type="primary" @click="addShops">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    const goodsValidator = function(rules, value, callback) {
      if (Number(value) < 0) {
        return callback(new Error('数值必须是大于0的整数或小数'))
      }
      return callback()
    }
    return {
      steplist: [
        {
          id: '1',
          stepName: '基本信息',
          icon: 'el-icon-edit'
        },
        {
          id: '2',
          stepName: '商品参数',
          icon: 'el-icon-eleme'
        },
        {
          id: '3',
          stepName: '商品属性',
          icon: 'el-icon-s-grid'
        },
        {
          id: '4',
          stepName: '商品图片',
          icon: 'el-icon-picture-outline'
        },
        {
          id: '5',
          stepName: '商品内容',
          icon: 'el-icon-document'
        }
      ],
      active: 0,
      activeName: '0',
      goodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        goods_introduce: '',
        attrs: [],
        pics: []
      },
      goodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { validator: goodsValidator, trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          { validator: goodsValidator, trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { validator: goodsValidator, trigger: 'blur' }
        ],
        goods_cat: [{ required: true, message: '请选择分类', trigger: 'blur' }]
      },
      options: [],
      // 检测表单是否满足
      checkVal: true,
      // 当前选中分类的ID
      cateId: '',
      // 当前选中分类ID的静态属性或动态属性
      cateTagList: [],
      // 上传图片地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片静态路径
      dialogImageUrl: '',
      // 图片预览显示与隐藏
      dialogVisible: false,
      // 上传头部信息
      uploadHeader: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  methods: {
    // 获取商品分类
    async getCates() {
      const { data: res } = await this.$axios.get('/categories', {
        params: {
          type: [3]
        }
      })
      if (res.meta.status !== 200) {
        return this.showMessage('error', res.meta.msg)
      }
      return (this.options = res.data)
    },

    // 根据分类ID获取静态属性或动态参数
    async getCatesTag(id, sel) {
      const { data: res } = await this.$axios.get(
        '/categories/' + id + '/attributes',
        {
          params: {
            sel: [sel]
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.showMessage('error', res.meta.msg)
      }
      res.data.forEach(element => {
        element.attr_vals =
          element.attr_vals === '' ? [] : element.attr_vals.split(',')
        element.attr_vals.forEach((val, index) => {
          element.attr_vals[index] = {
            attr_id: element.attr_id,
            attr_value: val
          }
        })
      })
      return res.data
    },

    // 校验是否为三级分类
    handleChange: function() {
      var checkNode = this.$refs.cascRef.getCheckedNodes()[0]
      if (!checkNode) return
      if (checkNode.level !== 3) {
        return this.$nextTick(function() {
          this.showMessage('warning', '只能选择三级商品分类！')
          this.$refs.cascRef.$refs.panel.clearCheckedNodes()
          this.$refs.cascRef.$refs.panel.activePath = []
        })
      }
      this.cateId = this.$refs.cascRef.getCheckedNodes()[0].data.cat_id
    },

    // 鉴定表单是否填写完整,跳转下一标签
    beforeLeave: function(activeName, oldActiveName) {
      this.$refs.goodsForm.validate(valid => {
        this.checkVal = valid
      })
      return this.checkVal
    },

    // 删除上传的照片
    handleRemove(file) {
      const index = this.goodsForm.pics.findIndex(e => {
        return e.pic === file.response.data.tmp_path
      })
      return this.goodsForm.pics.splice(index, 1)
    },

    // 展示上传了的图片
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 成功上传图片时
    onSuccess(response) {
      const pics = {
        pic: response.data.tmp_path
      }
      console.log(this.goodsForm)
      return this.goodsForm.pics.push(pics)
    },

    // 添加商品
    addShops() {
      this.$refs.goodsForm.validate(async valid => {
        const that = this
        if (!valid) {
          return this.showMessage('error', '请填写必须的信息')
        }
        var goodForm = _.cloneDeep(this.goodsForm)
        goodForm.goods_cat = goodForm.goods_cat.join(',')
        const { data: res } = await this.$axios.post('/goods', goodForm)
        console.log(goodForm)
        if (res.meta.status !== 201) {
          return this.showMessage('error', res.meta.msg)
        }
        this.showMessage('success', res.meta.msg + '，两秒后回到商品列表页面')
        this.active = this.steplist.length + 1
        setTimeout(function() {
          that.$router.push('/goods')
        }, 2000)
      })
    }
  },
  mounted() {
    this.getCates()
  },
  watch: {
    activeName: async function(newVal) {
      this.active = Number(newVal)
      if (Number(newVal) === 1) {
        this.cateTagList = await this.getCatesTag(this.cateId, 'many')
      } else if (Number(newVal) === 2) {
        this.cateTagList = await this.getCatesTag(this.cateId, 'only')
      }
    }
  }
}
</script>
<style scoped>
.el-steps--horizontal {
  width: 80%;
  margin: auto;
}
.add_base,
.attrsGroup,
.add_content {
  margin-bottom: 1.5rem;
}

.el-tag,
.el-checkbox {
  margin-bottom: 0.5rem;
}
</style>
