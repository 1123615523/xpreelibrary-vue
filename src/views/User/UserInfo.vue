<template>
  <div>
    <el-input placeholder="请输入姓名" v-model="mo" style="width: 200px"></el-input>
    <button type="button" @click="sousuo" class="el-button filter-item el-button--primary el-button--small"><!----><i
      class="el-icon-search"></i><span>搜索</span></button>
    <button type="button" @click="chong" class="el-button filter-item el-button--primary el-button--small"><!----><i
      class="el-icon-refresh"></i><span>重置</span></button>
    <button type="button" class="el-button filter-item el-button--primary el-button--small"><!----><i
      class="el-icon-plus" @click="edit()"></i><span>添加</span></button>

    <el-table width="100%" border :data="sysUser" stripe height="400px">
      <el-table-column label="编号" prop="id" width="60px" align="center"></el-table-column>
      <el-table-column label="姓名" prop="name" align="center"></el-table-column>
      <el-table-column label="性别" prop="sex" align="center">
        <template slot-scope="scope">
          {{scope.row.sex === 1?"男":"女"}}
        </template>
      </el-table-column>
      <el-table-column label="手机" prop="phone" align="center"></el-table-column>
      <el-table-column label="地址" prop="address" align="center"></el-table-column>
      <el-table-column label="身份证" prop="idcard" align="center"></el-table-column>
      <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
      <el-table-column label="工作状态" prop="state" align="center">
        <template slot-scope="scope">
          {{scope.row.state === 1?"正常":"停用"}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160px" align="center">
        <template slot-scope="scope">
          &nbsp;&nbsp;<el-button type="primary" size="mini" round @click="edit(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--遮罩层-->
    <el-dialog width="50%" :title=title :visible.sync="bolean">
      <el-form label-width="100px" label-suffix=":" :model="user">
        <el-form-item label="姓名">
          <el-input v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="user.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="user.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="user.address"></el-input>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input v-model="user.idcard"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="是否禁用">
          <el-switch
            v-model="user.state"
            :active-value="0"
            :inactive-value="1"
            active-text="停用"
            inactive-text="正常"
            active-color="#ff4949"
            inactive-color="#13ce66"
          >
          </el-switch>
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="edits()">提交</el-button>
        <el-button @click="bolean = false">取消</el-button>
      </div>
    </el-dialog>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[5, 10, 20,50]"
                     :page-size="p" layout="total, sizes, prev, pager, next, jumper" :total="t"></el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: "UserInfo",
    data() {
      return {
        sysUser: [],
        t: 0,
        p: 5,
        mo: "",
        reslist: [],
        title: null,
        bolean: false,
        user: {}
      }
    },
    created() {
      this.findUserInfo(1, this.p);
    },
    methods: {
      "findUserInfo": function (currentPage, size) {
        this.$http.get("user/findUserInfo", {
          params: {
            currentPage: currentPage,
            pageSize: size
          }
        }).then((resp) => {
          console.info(resp);
          this.sysUser = resp.rows;
          this.t = resp.total;
          this.p = resp.pageSize;
        });
      },
      handleSizeChange(val) {
        this.findUserInfo(1, val)
      },
      handleCurrentChange(val) {
        this.findUserInfo(val, this.p)
      },
      "chong": function () {
        this.mo = '';
        this.findUserInfo(1, this.p);
      },
      "sousuo": function () {
        this.reslist = [];
        if (this.mo === '') {
          this.findUserInfo();
        } else {
          for (let i = 0; i <= this.sysUser.length - 1; i++) {
            if (this.sysUser[i].name.indexOf(this.mo) >= 0) {
              this.reslist.push(this.sysUser[i]);
            }
          }
          this.sysUser = this.reslist;
        }
      },
      "edit":function (row) {
        console.log("hui");
        this.bolean = true;
        if (null == row){
          this.user = {};
          this.title = "添加员工";
        } else {
          this.user = Object.assign({},row);
          this.title = "修改员工"
        }
      },
      "edits":function () {
        if (this.title=="添加员工"){
          this.$http.post("user/addUser",this.user).then(value => {
            this.bolean = false;
            this.findUserInfo(1,this.p);
          })
        }else if(this.title=="修改员工"){
          this.$http.post("user/updUser",this.user).then(value => {
            this.bolean = false;
            this.findUserInfo(1,this.p);
          })
        }
      }

    }
  }
</script>

<style scoped>
  .filter-container .filter-item {
    display: inline-block;
    vertical-align: middle;
  }

  .el-input--small {
    font-size: 13px;
  }
</style>
