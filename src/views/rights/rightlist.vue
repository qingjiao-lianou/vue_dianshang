<template>
  <div class="rightlist">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="rightlistData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级">
        <!-- 使用过滤器修改格式，定义一个自定义模板 -->
        <template slot-scope="scope">
          <span>{{ scope.row.level | levellist }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getrightListData } from "@/api/right_index.js";

export default {
  data() {
    return {
      // 权限列表数据
      rightlistData: []
    };
  },
  mounted() {
    //   获取权限列表数据
    getrightListData("list")
      .then(res => {
        console.log(res);
        if (res.data.meta.status === 200) {
          this.rightlistData = res.data.data;
        }
      })
      .catch(err => {
        this.$message.error("获取列表失败");
      });
  },
  //   过滤器
  filters: {
    levellist(level) {
      if (level === "0") {
        return "一级";
      }
      if (level === "1") {
        return "二级";
      }
      if (level === "2") {
        return "三级";
      }
    }
  }
};
</script>

<style>
</style>