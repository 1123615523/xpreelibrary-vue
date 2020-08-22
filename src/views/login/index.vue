<template>
  <div>
    <el-form label-width="100px" label-suffix="：" :rules="rules" :model="user" ref="fm">

      <el-form-item label="用户名" prop="uname">
        <el-input v-model="user.uname"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="pwd">
        <el-input show-password v-model="user.pwd"></el-input>
      </el-form-item>

      <el-button type="success" @click="login()">登录</el-button>
      <el-button type="primary" @click="layout">取消</el-button>

    </el-form>

  </div>
</template>

<script>

  export default {
    name: "index",
    data() {
      return {
        user: {
          uname: null,
          pwd: null
        },
        rules: {
          uname: [
            {
              trigger: ['blur', 'change'],
              validator: function (rule, value, callback) {
                if (null == value) {
                  callback(new Error("请输入账号！"));
                } else {
                  if (value.indexOf('_') === -1) {
                    callback();
                  } else {
                    callback(new Error("格式错误"));
                  }
                }
              }
            }
          ],
          pwd: [
            {
              trigger: ['blur', 'change'],
              validator: function (rule, value, callback) {
                if (null == value) {
                  callback(new Error("请输入密码！"));
                } else {
                  callback();
                }
              }
            }
          ]
        }
      }
    },
    methods: {
      "login": function () {
        this.$refs['fm'].validate(valid => {
          if (valid) {
            let url = "login?username=" + this.user.uname + "&password=" + this.user.pwd;
            this.$http.post(url).then((resp) => {
              if(resp.code===500){
                this.$message.error("登录异常！！！");
              }else{
                this.$message.success("登录成功");
                //存本地
                window.sessionStorage.setItem("token", resp);
                this.$router.push({name: "Home"});
              }
            })
          }
        })
      },
      "layout": function () {
        this.user.uname = null;
        this.user.pwd = null;
      }
    }
  }
</script>

<style scoped>
  .el-form {
    border: 1px solid lightskyblue;
    width: 30%;
    margin: 100px auto;
    box-shadow: 0 0 30px lightskyblue;
    border-radius: 25px;
    padding: 30px 40px;
    text-align: center;
  }
</style>
