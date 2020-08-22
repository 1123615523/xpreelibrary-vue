<template>
  <div>
    <el-input placeholder="请输入内容" v-model="mo" style="width: 200px"></el-input>
    <button type="button" @click="sousuo" class="el-button filter-item el-button--primary el-button--small"><!----><i
      class="el-icon-search"></i><span>搜索</span></button>
    <button type="button" @click="chong" class="el-button filter-item el-button--primary el-button--small"><!----><i
      class="el-icon-refresh"></i><span>重置</span></button>
    <button type="button" class="el-button filter-item el-button--primary el-button--small"><!----><i
      class="el-icon-plus"></i><span>添加</span></button>

    <el-table width="100%" border :data="sysUser" stripe height="400px">
      <el-table-column label="编号" prop="id" width="50px"></el-table-column>
      <el-table-column label="姓名" prop="name" width="50px"></el-table-column>
      <el-table-column label="性别" prop="sex" width="50px">
        <template slot-scope="scope">
          {{scope.row.sex === 1?"男":"女"}}
        </template>
      </el-table-column>
      <el-table-column label="手机" prop="phone" width="120px"></el-table-column>
      <el-table-column label="地址" prop="address" width="80px"></el-table-column>
      <el-table-column label="身份证" prop="idcard"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="状态" prop="state" width="50px">
        <template slot-scope="scope">
          {{scope.row.state === 1?"正常":"封禁"}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160px">
        <template slot-scope="scope">
          &nbsp;&nbsp;<el-button type="primary" size="mini" round @click="">修改</el-button>
          <el-button type="danger" size="mini" round @click="">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
        mo:"",
        reslist:[]
      }
    },
    created() {
      this.findUserInfo(1,this.p);
    },
    methods: {
      "findUserInfo": function (currentPage,size) {
        this.$http.get("user/findUserInfo",{params:{
            currentPage:currentPage,
            pageSize:size
        }}).then((resp) => {
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
      "chong":function () {
        this.mo = '';
        this.findUserInfo();
      },
      "sousuo":function () {
        this.reslist = [];
        if(this.mo === ''){
          this.findUserInfo();
        }else{
          for(let i=0;i<=this.sysUser.length - 1;i++){
            if(this.sysUser[i].name.indexOf(this.mo)>=0){
              this.reslist.push(this.sysUser[i]);
            }
          }
          this.sysUser = this.reslist;
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
