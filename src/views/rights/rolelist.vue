<template>
  <div class="rolelist">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" round @click="addroleVisible=true">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="rolelistData" border style="width: 100%; margin-top: 15px">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="one in scope.row.children" :key="one.id">
            <el-col :span="4" style="margin-bottom:5px;">
              <el-tag closable>{{one.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="two in one.children" :key="two.id">
                <el-col :span="4">
                  <el-tag closable :type="'warning'" style="margin-bottom:5px">{{two.authName}}</el-tag>
                </el-col>
                <!-- v-for="trid in two.children" :key="trid.id"
                {{trid.authName}}-->
                <el-col :span="20">
                  <el-tag
                    closable
                    :type="'danger'"
                    v-for="trid in two.children"
                    :key="trid.id"
                    style="margin-right:5px;margin-bottom:5px"
                    @close="delrightlist(scope.row,trid.id)"
                  >{{trid.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-show="scope.row.children == 0">
            <el-col :span="24">
              <span>没有权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button
              type="success"
              icon="el-icon-lollipop"
              size="mini"
              @click="defaulRight(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" size="mini"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 树形权限列表 -->
    <el-dialog :visible.sync="rightListdialogVisible">
      <el-tree
        :data="rightlistData"
        ref="tree"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="treekey"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rightListdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="roleAuthorization">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog title="填写角色信息" :visible.sync="addroleVisible">
      <el-form :model="roleform" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model=" roleform.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleform.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addroleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addroles">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  roleslistuser,
  delRightdata,
  getroleAuthorization,
  addrole
} from "@/api/roles_index.js";
import { getrightListData } from "@/api/right_index.js";

export default {
  data() {
    return {
      roleform: {
        roleName: "",
        roleDesc: ""
      },
      addroleVisible: false,
      rightListdialogVisible: false,
      rowId: "",
      // 角色列表数据
      rolelistData: [],
      // 树形权限列表数据
      rightlistData: [],
      // 默认选中节点数组
      treekey: [],
      // 节点配置
      defaultProps: {
        children: "children",
        label: "authName"
      }
    };
  },
  mounted() {
    //   获取角色列表
    this.init();
  },
  methods: {
    // 添加角色
    async addroles() {
      let res = await addrole(this.roleform);
      // console.log(res)
      if (res.data.meta.status === 201) {
        this.addroleVisible = false;
        this.$message.success(res.data.meta.msg);
        this.init();
      } else {
        this.$message.error(res.data.meta.msg);
      }
    },
    // 删除自动刷新角色授权列表
    delrightlist(row, rightId) {
      delRightdata(row.id, rightId)
        .then(res => {
          // console.log(res);

          row.children = res.data.data;

          row.children.forEach((el1, in1) => {
            if (el1.children.length === 0) {
              this.delrightlist(row, el1.id);
            } else {
              el1.children.forEach((el2, in2) => {
                if (el2.children.length === 0) {
                  this.delrightlist(row, el2.id);
                }
              });
            }
          });
        })
        .catch(() => {});
    },
    // 设置默认选中节点
    defaulRight(row) {
      // 这里进行数据的存储是为了后期角色授权时能够正确的获取角色id
      this.rowId = row.id;
      this.rightListdialogVisible = true;
      // 获取节点元素
      getrightListData("tree")
        .then(res => {
          console.log(res);
          this.rightlistData = res.data.data;
        })
        .catch(() => {});

      this.treekey = [];
      row.children.forEach(one => {
        if (one.children.length > 0) {
          one.children.forEach(two => {
            if (two.children.length > 0) {
              two.children.forEach(tri => {
                this.treekey.push(tri.id);
              });
            }
          });
        }
      });
    },
    // 给角色授权
    async roleAuthorization() {
      var arr = this.$refs.tree.getCheckedNodes();
      // console.log(arr);

      let temp = [];
      for (var i = 0; i < arr.length; i++) {
        temp.push(arr[i].id + "," + arr[i].pid);
      }
      // console.log(temp);
      //  拼接数组元素在转换为数组
      temp = temp.join(",").split(",");
      //  console.log(temp);
      //  数组去重并重新转成数组
      temp = [...new Set(temp)];

      var res = await getroleAuthorization(this.rowId, temp.join(","));
      if (res.data.meta.status === 200) {
        this.rightListdialogVisible = false;
        this.$message.success(res.data.meta.msg);
        this.init();
      } else {
        this.$message.error(res.data.meta.msg);
      }

      // this.delrightlist(this.row, this.rightId);

      // console.log(res)
    },

    // 获取角色列表
    init() {
      roleslistuser(this.rolelistData)
        .then(res => {
          // console.log(res);
          if (res.data.meta.status === 200) {
            this.rolelistData = res.data.data;
          }
        })
        .catch(() => {
          this.$message.error("获取列表失败");
        });
    }
  }
};
</script>

<style>
</style>