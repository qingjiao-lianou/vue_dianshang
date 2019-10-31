<template>
  <div class="uers">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-caret-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="userobj.query"
        class="input-with-select"
        style="width:300px;margin-right:10px"
        @keydown.enter.native="into"
      >
        <el-button slot="append" icon="el-icon-search" @click="into"></el-button>
      </el-input>
      <el-button type="success" round @click="addFormVisible = true">添加用户</el-button>
    </div>

    
    <!-- 表格显示区域 -->
    <el-table border :data="userlist" style="width: 100%;
      margin-top:15px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>

      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="Alteruserstate(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editormVisible(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button
              type="success"
              icon="el-icon-share"
              size="mini"
              @click="roleFormVisible(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              type="warning"
              icon="el-icon-delete"
              size="mini"
              @click="deluser(scope.row.id)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[1, 2, 3,4,5]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加对话框 -->
    <el-dialog title="用户信息" :visible.sync="addFormVisible">
      <el-form :model="userform" :label-width="'80px'" :rules="rules" ref="userForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userform.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editFormVisible">
      <el-form :model="editform" :label-width="'80px'" :rules="rules" ref="editForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editform.username" autocomplete="off" disabled style="width:80px"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editusers">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 角色分配对话框 -->
    <el-dialog title="角色分配" :visible.sync="rolesFormVisible">
      <el-form :model="rolesform">
        <el-form-item label="用户名">
          <el-input v-model="rolesform.username" autocomplete="off" :label-width="'40px'" disabled></el-input>
        </el-form-item>
        <el-select v-model="rolesform.rid" clearable placeholder="请选择">
          <el-option
            v-for="item in roleslist"
            :key="item.value"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rolesFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="getroles">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAlluser,
  adduser,
  edituser,
  rolesuser,
  deluserid,
  alteruserstate
} from "@/api/users_index.js";
import { roleslistuser } from "@/api/roles_index.js";

export default {
  data() {
    return {
      editFormVisible: false,
      rolesFormVisible: false,
      addFormVisible: false,
      total: 0,
      roleslist: [],
      userlist: [],
      userobj: {
        query: "", //   查询参数
        pagenum: 1, // 当前页码
        pagesize: 5 //每页显示条数
      },
      userform: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editform: {
        username: "",
        id: "",
        email: "",
        mobile: ""
      },
      rolesform: {
        username: "",
        id: "",
        rid: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /\w+[@]\w+[.]\w+/,
            message: "请输入合法邮箱",
            trigger: "blur"
          }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { pattern: /^1\d{10}$/, message: "请输入合法手机号", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.into();
    // 获取分配角色数据
    roleslistuser(this.roleslist)
      .then(res => {
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.roleslist = res.data.data;
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    into() {
      // 获取数据
      getAlluser(this.userobj)
        .then(res => {
          console.log(res);
          if (res.data.meta.status === 200) {
            this.userlist = res.data.data.users;
            // 获取总记录数
            this.total = res.data.data.total;
          } else if (res.data.meta.status === 400) {
            this.$message.error(res.data.meta.msg);
            this.$router.push({ name: "login" });
          } else if (res.data.meta.status === 401){
            this.$message.error(res.data.meta.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 当切换页码时触发
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.userobj.pagesize = val;
      this.into();
    },
    //   切换当前页面时触发
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      // 修改参数
      this.userobj.pagenum = val;
      // 获取数据
      this.into();
    },
    // 添加用户数据
    add() {
      // 实现二次验证
      this.$refs.userForm.validate(valid => {
        if (valid) {
          adduser(this.userform)
            .then(res => {
              console.log(res);
              if (res.data.meta.status === 201) {
                this.$message.success("添加成功");
                this.into();
                this.addFormVisible = false;
                //  清空表单元素数据
                this.$refs.userForm.resetFields();
              }
            })
            .catch(err => {
              this.$message.success("添加失败");
            });
        } else {
          this.$message({
            message: "请填写正确内容",
            type: "warning"
          });
          return false;
        }
      });
    },
    // 展示默认数据
    editormVisible(row) {
      this.editFormVisible = true;
      console.log(row);
      this.editform.username = row.username;
      this.editform.id = row.id;
      this.editform.email = row.email;
      this.editform.mobile = row.mobile;
    },
    // 编辑数据
    editusers() {
      edituser(this.editform)
        .then(res => {
          console.log(res);
          if (res.data.meta.status === 200) {
            this.$message.success("编辑成功");
            this.into();
            this.editFormVisible = false;
            //  清空表单元素数据
            this.$refs.editForm.resetFields();
          }
        })
        .catch(err => {});
    },
    // 角色对话框默认数据
    roleFormVisible(row) {
      console.log(row);
      this.rolesFormVisible = true;
      this.rolesform.username = row.username;
      this.rolesform.id = row.id;
      // console.log( this.rolesform.id)
      this.rolesform.rid = row.rid;
      // console.log(this.rolesform.rid)
    },
    getroles() {
      console.log(this.rolesform);
      if (this.rolesform.rid) {
        rolesuser(this.rolesform)
          .then(res => {
            console.log(res);
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg);

              this.rolesFormVisible = false;
              this.into();
            }
          })
          .catch(err => {});
      } else {
        this.$message.error("请选择角色");
      }
    },
    // 删除用户
    deluser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deluserid(id)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                // this.into();
                // 当前页面删完后没有数据，会自动跳到前一页
                this.userobj.pagenum =
                  Math.ceil((this.total - 1) / this.userobj.pagesize) <
                  this.userobj.pagenum
                    ? --this.userobj.pagenum
                    : this.userobj.pagenum;
                this.into();
              } else {
                this.$message.error(res.data.meta.msg);
              }
            })
            .catch(() => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 修改用户状态
    Alteruserstate(id, type) {
      alteruserstate(id, type)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message.success("状态修改成功");

            this.into();
          } else {
            this.$message.error("修改失败");
          }
        })
        .catch(err => {});
    }
  }
};
</script>

<style>
</style>
