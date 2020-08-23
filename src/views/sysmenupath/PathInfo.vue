<template>
  <div>
    <el-input placeholder="请输入功能名称" v-model.trim="mo" style="width: 200px"></el-input>

    <button type="button" @click="sou()" class="el-button filter-item el-button--primary el-button--small"><!----><i
      class="el-icon-search"></i><span>搜索</span></button>

    <button type="button" @click="chong()" class="el-button filter-item el-button--primary el-button--small"><!----><i
      class="el-icon-refresh"></i><span>重置</span></button>

    <button type="button" @click="add()" class="el-button filter-item el-button--primary el-button--small"><!----><i
      class="el-icon-plus"></i><span>添加</span></button>

    <el-table width="100%" border :data="sysMenuPath" stripe height="400px">
      <el-table-column label="编号" prop="id" width="60px" align="center"></el-table-column>
      <el-table-column label="路径" prop="pathurl" align="center"></el-table-column>
      <el-table-column label="说明" prop="meno" align="center"></el-table-column>
      <el-table-column label="所属功能" prop="sysMenu.menuname" align="center"></el-table-column>
      <el-table-column label="路由路径" prop="sysMenu.path" align="center"></el-table-column>
      <el-table-column label="图标" align="center">
        <template slot-scope="scope">
          <i :class="scope.row.sysMenu.icon"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160px" align="center">
        <template slot-scope="scope">
          &nbsp;&nbsp;<el-button type="primary" size="mini" round @click="upd(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" round @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--遮罩层-->
    <el-dialog width="50%" :title="tit" :visible.sync="visibleDialog">
      <el-form label-width="100px" label-suffix="：" :model="wdk">

        <el-form-item label="资源ID" hidden>
          <el-input v-model.trim="wdk.id" hidden></el-input>
        </el-form-item>

        <el-form-item label="资源路径">
          <el-input v-model.trim="wdk.pathurl"></el-input>
        </el-form-item>

        <el-form-item label="资源说明">
          <el-input v-model.trim="wdk.meno"></el-input>
        </el-form-item>

        <el-form-item label="资源模块">
          <el-select v-model="wdk.menuid" placeholder="请选择模块">
            <el-option v-for="r in options" :label="r.menuname" :value="r.id"></el-option>
          </el-select>
        </el-form-item>

        <el-button type="primary" @click="yes()" style="margin-left: 250px">确认</el-button>
        <el-button type="primary" @click="visibleDialog=false">取消</el-button>
      </el-form>
    </el-dialog>

    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[5, 10, 20,50]"
                     :page-size="p" layout="total, sizes, prev, pager, next, jumper" :total="t"></el-pagination>
    </div>

  </div>
</template>

<script>
  export default {
    name: "PathInfo",
    data() {
      return {
        sysMenuPath: [],
        t: 0,
        p: 5,
        wdk: {},
        visibleDialog: false,
        tit: '',
        options: [],
        reslist:[],
        mo:''
      }
    },
    created() {
      this.find(1, this.p);
    },
    methods: {
      "upd":function (row) {
        this.tit = '修改资源';
        this.$http.get("menu/findMenu").then((resp) => {
          this.options = resp;
        });
        this.visibleDialog = true;
        if(null != row){
          this.wdk = Object.assign({},row);
        }else{
          this.wdk = {};
        }
      },
      "sou":function () {
        if(this.mo === ''){
          this.$notify({
            title:'警告',
            message:'请输入搜索内容',
            type:'warning'
          })
        }else{
          for (let i = 0; i <= this.sysMenuPath.length - 1; i++){
            if(this.sysMenuPath[i].sysMenu.menuname.indexOf(this.mo) >= 0){
              this.reslist.push(this.sysMenuPath[i]);
            }
          }
          this.sysMenuPath = this.reslist;
        }
      },
      "del":function (row) {
        this.$http.get('path/deletePath',{params:{id:row.id}}).then((resp) => {
          if(resp > 0){
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            });
            this.find(1, this.p);
          }else{
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error'
            });
          }
        })
      },
      "find": function (currentPage, size) {
        this.$http.get("path/findMenuPath", {
          params: {
            currentPage: currentPage,
            pageSize: size
          }
        }).then((resp) => {
          this.sysMenuPath = resp.rows;
          this.t = resp.total;
          this.p = resp.pageSize;
        })
      },
      "add": function () {
        this.tit = '添加资源';
        this.$http.get("menu/findMenu").then((resp) => {
          this.options = resp;
        });
        this.visibleDialog = true;
      },
      "chong": function () {
        this.find(1, this.p);
      },
      handleSizeChange(val) {
        this.find(1, val)
      },
      handleCurrentChange(val) {
        this.find(val, this.p)
      },
      "yes": function () {
        if(this.tit === '添加资源'){
          var url = this.wdk.pathurl;
          for (let i = 0; i <= this.sysMenuPath.length - 1; i++) {
            if (this.sysMenuPath[i].pathurl === url) {
              this.$notify({
                title: '失败',
                message: '该资源路径已经存在！',
                type: 'error'
              });
              return;
            }
          }
          this.$http.post("path/addPath",this.wdk).then((resp) => {
            if(resp !== 1){
              this.$message.error("添加失败！");
            }else{
              this.$notify({
                title: '成功',
                message: '添加成功！',
                type: 'success'
              });
              this.visibleDialog = false;
              this.wdk = {};
              this.find(1,this.p);
            }
          })
        }else if(this.tit === '修改资源'){
          this.$http.post("path/updPath",this.wdk).then((resp) => {
            if(resp === 2){
              this.$notify({
                title:'失败',
                message:'该路径已存在，无法重复修改!',
                type:'error'
              })
            }else if(resp === 1){
              this.$notify({
                title:'成功',
                message:'修改成功',
                type:'success'
              });
              this.visibleDialog = false;
              this.wdk = {};
              this.find(1,this.p);
            }else if(resp !== 1){
              this.$notify({
                title:'失败',
                message:'修改失败！',
                type:'error'
              })
            }
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
