<template>
  <div class="add">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 步骤条 -->
    <el-steps :active="activeName - 0" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
      <el-step title="步骤 4"></el-step>
      <el-step title="步骤 5"></el-step>
    </el-steps>

    <!-- 卡片样式 -->
    <el-card class="box-card" style="margin-top: 15px;">
      <!-- 标签页 -->
      <el-form label-width="150px" v-model="goodsform">
        <el-tabs
          v-model="activeName"
          tabPosition="left"
          :before-leave="beforeleave"
          @tab-click="handleClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称">
              <el-input v-model="goodsform.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="goodsform.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量">
              <el-input v-model="goodsform.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量">
              <el-input v-model="goodsform.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                :options="options"
                change-on-select
                :props="catelist"
                v-model="goodsform.goods_cat"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-checkbox-group
              v-model="ieme.attr_vals"
              v-for="ieme in attrVule"
              :key="ieme.attr_id"
            >
              <el-checkbox :label="seo" v-for="(seo,index) in ieme.attr_vals" :key="index" border></el-checkbox>
            </el-checkbox-group>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in staticVule" :key="item.attr_id">
              <el-input :value="item.attr_vals" readonly></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :headers="setToken()"
              action="http://localhost:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quillEditor v-model="goodsform.goods_introduce"></quillEditor>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-button type="success" @click="addgoods">添加商品</el-button>
    </el-card>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import { getcate } from "@/api/cate_index.js";
import { getParameter } from "@/api/parameters_index.js";
import { addGoods } from "@/api/list_index.js";

export default {
  data() {
    return {
      staticVule: [],
      checkList: [],
      attrVule: [], // 动态参数数组，它应该是一个对象数组，包含着所有组的参数数据
      fileList: [],
      catelist: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      options: [],
      goodsform: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      // active:2,
      activeName: "0"
    };
  },
  methods: {
    // 切换标签之前的钩子，若返回 false ，则阻止切换。
    beforeleave(activeName, oldActiveName) {
      // console.log(1);
      if (activeName === "1" || activeName === "2") {
        if (this.goodsform.goods_cat.length !== 3) {
          this.activeName = "0";
          this.$message.error("请选择分类");
          return false;
        }
      }
    },
    async handleClick() {
      if (this.activeName === "1" || this.activeName === "2") {
        if (this.activeName === "1") {
          var res = await getParameter(this.goodsform.goods_cat[2], "many");
          // console.log(res);
          this.attrVule = res.data.data;
          for (var i = 0; i < this.attrVule.length; i++) {
            this.attrVule[i].attr_vals = this.attrVule[i].attr_vals.split(",");
            // console.log(this.attrVule[i].attr_vals);
          }
          // console.log(this.attrVule);
        } else if (this.activeName === "2") {
          var res = await getParameter(this.goodsform.goods_cat[2], "only");
          console.log(res);
          if (res.data.meta.status === 200) {
            this.staticVule = res.data.data;
          }
        }
      }
    },
    // 添加商品数据
    async addgoods() {
      for (var i = 0; i < this.attrVule.length; i++) {
        var id = this.attrVule[i].attr_id;
        for (var j = 0; j < this.attrVule[i].attr_vals.length; j++) {
          this.goodsform.attrs.push({
            attr_id: id,
            attr_value: this.attrVule[i].attr_vals[j]
          });
        }
      }

      this.goodsform.goods_cat = this.goodsform.goods_cat.join(",");
      // console.log(this.goodsform);
      var res = await addGoods(this.goodsform);
      // console.log(res);
      if (res.data.meta.status === 201) {
        this.$message.success("添加成功");
        this.$router.push({ name: "list" });
      }
    },
    // 移除图片时触发
    handleRemove(file, fileList) {
      // console.log(file);
      // console.log(fileList);
      var deLrm = file.response.data.tmp_path;
      for (var i = 0; i < this.goodsform.pics.length; i++) {
        if (this.goodsform.pics[i].pic == deLrm) {
          this.goodsform.pics.splice(i, 1);
        }
      }
    },
    // 预览图片时触发
    handlePreview(file) {
      // console.log(file);
    },
    // 文件上传成功之后的钩子函数
    handleSuccess(response, file, fileList) {
      console.log(response);
      if (response.meta.status === 200) {
        this.goodsform.pics.push({ pic: response.data.tmp_path });
      }
    },
    // 文件上传前的钩子，在这个钩子中可以对上传的文件进行相关的验证判断
    beforeUpload() {},
    setToken() {
      // 获取token
      var token = localStorage.getItem("vue_dome_token");
      // 返回对象
      return {
        Authorization: token
      };
    }
  },
  // 组建注册
  components: {
    quillEditor
  },
  mounted() {
    getcate(this.options).then(res => {
      // console.log(res);
      this.options = res.data.data;
    });
  }
};
</script>

<style>
</style>