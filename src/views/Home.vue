<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">


        <el-menu :router="true" @select="handleSelect">
          <div class="user-menu-box" v-for="menu in menus" :key="menu.id">
            <!--不存在子节点-->
            <el-menu-item v-if="!menu.child" :index="menu.path">
              <i :class="menu.icon"></i>
              <span slot="title" v-text="menu.menuname"></span>
            </el-menu-item>
            <!--存在子节点-->
            <el-submenu v-if="menu.child" :index="menu.path">
              <template slot="title">
                <i :class="menu.icon"></i>
                <span slot="title" v-text="menu.menuname"></span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="subMenu in menu.child" :key="subMenu.id" v-text="subMenu.menuname"
                              :index="subMenu.path"></el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </div>
        </el-menu>
      </el-aside>

      <el-container>
        <!--https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80-->
        <!--https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1561394014552&di=17b6c1233048e5276f48309b306c7699&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201804%2F29%2F20180429210111_gtsnf.jpg-->
        <el-header>
          <el-dropdown trigger="click" @command="handlerCommand">
            <el-avatar :size="40" shape="square" src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"></el-avatar>
            <span class="el-dropdown-link">
                <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="Person">个人信息</el-dropdown-item>
              <el-dropdown-item command="EditPwd">修改密码</el-dropdown-item>
              <el-dropdown-item command="Login">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>

        <el-main>
          <router-view></router-view>
        </el-main>

      </el-container>

    </el-container>



  </div>
</template>

<script>
  export default {
    name: "wdk",
    data () {
      return {
        res:'',
        activeMenu: '',
        indexBreadcrumbs: [],
        menus: [],
      }
    },
    watch: {
      $route () {
        this.handChange()
      }
    },
    computed: {
      breadcrumbList () {
        let breadcrumbs = [];
        let menuList = this.menus;
        this.indexBreadcrumbs.map(item => {
          for (let i = 0; i < menuList.length; i++) {
            if (item === menuList[i].path) {
              breadcrumbs.push(menuList[i]);
              if (menuList[i].child) {
                menuList = menuList[i].child
              }
              break;
            }
          }
        });
        return breadcrumbs
      }
    },
    methods: {
      handChange () {
        this.$emit('hand-change', this.breadcrumbList)
      },
      handleSelect (index, indexPath) {
        console.info(index);
        console.info(indexPath);
        this.indexBreadcrumbs = indexPath;
      },
      handlerCommand: function (command) {
        this.$router.push({name:command});
      },
      "findPromiss":function () {
        var to = window.sessionStorage.getItem("token");
        var url = "utils/find?token="+to;
        this.$http.get(url).then((resp) => {
          console.log("获取",resp)
          this.menus =resp;
        })
      }
    },
    created () {
      this.handChange();
      this.findPromiss();
    }
  }
</script>

<style scoped>

  .el-dropdown {
    float: right;
    margin-top: 10px;
  }

  .home {
    height: 100%;
  }

  .el-container {
    height: 100%;
  }

  .el-header {
    background-color: whitesmoke;
  }

  .el-footer {
    background-color: #B3C0D1;
  }

  .el-aside, .el-menu, .el-submenu, .el-menu-item {
    height: 100%;
    background-color: whitesmoke;
  }

  .el-main {
    background-color: white;
    height: 100%;
  }
</style>
