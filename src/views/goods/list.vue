<template>
  <div class="list">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 @keydown.enter.native="into" -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="goodsobj.query"
        class="input-with-select"
        style="width:300px;margin-right:10px"
        @keydown.enter.native="into"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" round @click="$router.push({ name: 'add' })">添加商品</el-button>
    </div>
    <!-- 列表 -->
    <el-table :data="productData" border style="width: 100%;margin-top: 15px;">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="380"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" icon="el-icon-share" size="mini"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" size="mini"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsobj.pagenum"
      :page-sizes="[1,3,5,7,9]"
      :page-size="goodsobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { getCommodity } from "@/api/list_index.js";

export default {
  data() {
    return {
      total: 0,
      // 商品列表数据
      productData: [],
      goodsobj: {
        query: "", //   查询参数
        pagenum: 1, // 当前页码
        pagesize: 10 //每页显示条数
      }
    };
  },
  mounted() {
    this.into();
  },
  methods: {
    into() {
      getCommodity(this.goodsobj)
        .then(res => {
          console.log(res);
          if (res.data.meta.status === 200) {
            this.productData = res.data.data.goods;
            this.total = res.data.data.total;
          }
        })
        .catch(() => {});
    },
    // 当切换页码时触发
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.goodsobj.pagesize = val;
      this.into();
    },
    //   切换当前页面时触发
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      // 修改参数
      this.goodsobj.pagenum = val;
      // 获取数据
      this.into();
    }
  }
};
</script>

<style>
</style>