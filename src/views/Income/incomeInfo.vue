<template>
  <div>
    <el-input placeholder="请输入功能名称" v-model.trim="mo" style="width: 200px"></el-input>

    <button type="button" @click="sousuo" class="el-button filter-item el-button--primary el-button--small"><!----><i
      class="el-icon-search"></i><span>搜索</span></button>

    <button type="button" @click="chong" class="el-button filter-item el-button--primary el-button--small"><!----><i
      class="el-icon-refresh"></i><span>重置</span></button>

    <el-table width="100%" border :data="customerinfo" stripe height="400px">
      <el-table-column label="编号" prop="id" width="60px" align="center"></el-table-column>
      <el-table-column label="金额" prop="rechargemoney" align="center"></el-table-column>
      <el-table-column label="账号" prop="rechargeaccount" align="center"></el-table-column>
      <el-table-column label="日期" prop="rechargetime" align="center"></el-table-column>
      <el-table-column label="充值人" prop="customerinfos.customername" align="center"></el-table-column>
    </el-table>

    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[5, 10, 20,50]"
                     :page-size="p" layout="total, sizes, prev, pager, next, jumper" :total="t"></el-pagination>
    </div>

  </div>
</template>

<script>
  export default {
    name: "CustomerInfo",
    data() {
      return {
        customerinfo: [],
        t: 0,
        p: 5,
        mo:'',
        reslist:[]
      }
    },
    created() {
      this.find(1, this.p);
    },
    methods: {
      "chong": function () {
        this.mo = '';
        this.find(1, this.p);
      },
      "sousuo":function () {
        this.reslist = [];
        if (this.mo === '') {
          this.find(1, this.p);
        } else {
          for (let i = 0; i <= this.customerinfo.length - 1; i++) {
            if (this.customerinfo[i].rechargeaccount.indexOf(this.mo) >= 0) {
              this.reslist.push(this.customerinfo[i]);
            }
          }
          this.customerinfo = this.reslist;
        }
      },
      "find": function (currentPage, size) {
        this.$http.get("houRecharge/houFindRecharge", {
          params: {
            currentPage: currentPage,
            pageSize: size
          }
        }).then((resp) => {
          this.customerinfo = resp.rows;
          this.t = resp.total;
          this.p = resp.pageSize;
        })
      },
      handleSizeChange(val) {
        this.find(1, val)
      },
      handleCurrentChange(val) {
        this.find(val, this.p)
      },
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
