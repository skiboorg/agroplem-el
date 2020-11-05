<template>
  <div style="z-index: 100;
    position: sticky;
    top: -75px;" class="">
    <div class="container">
      <el-header>

        <img class="logo" src="/logo.png" alt="">
        <p style="visibility: hidden" class="test">123</p>



      </el-header>
    </div>
    <div style="box-shadow: 0 3px 4px 0 #ededed" class="">
      <div class="container">
        <div style="display: flex;justify-content: space-between;align-items: center;background: #ffffff">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1"><nuxt-link to="/">Товары</nuxt-link></el-menu-item>
            <el-menu-item index="2"><nuxt-link to="/sorts">Партии</nuxt-link></el-menu-item>

            <el-menu-item index="3"><nuxt-link to="/equip_tests">Оборудование</nuxt-link></el-menu-item>
            <el-menu-item index="5"><nuxt-link to="/samples">Образцы</nuxt-link></el-menu-item>
            <el-submenu index="4">
              <template slot="title">База</template>
              <el-menu-item index="4-1"><nuxt-link to="/manufacturers">Производители</nuxt-link></el-menu-item>
              <el-menu-item index="4-2"><nuxt-link to="/category">Категории</nuxt-link></el-menu-item>
              <el-menu-item index="4-3"><nuxt-link to="/subcategory">Подкатегории</nuxt-link></el-menu-item>
              <el-menu-item index="4-4"><nuxt-link to="/suppliers">Поставщики</nuxt-link></el-menu-item>
              <el-menu-item index="4-5"><nuxt-link to="/testers">Приемщики</nuxt-link></el-menu-item>
              <el-menu-item index="4-6"><nuxt-link to="/quipment">Оборудование</nuxt-link></el-menu-item>
              <el-menu-item index="4-7"><nuxt-link to="/sample_type" >Типы образцов</nuxt-link></el-menu-item>
              <el-menu-item index="4-8"><nuxt-link to="/sample_state">Состояния образцов</nuxt-link></el-menu-item>
              <el-menu-item index="4-9"><nuxt-link to="/sample_test">Испытания образцов</nuxt-link></el-menu-item>
            </el-submenu>

          </el-menu>
          <div class="line"></div>
          <div style="padding-right: 20px;">

            <el-popover placement="bottom-end"  width="300"  trigger="hover" >
              <el-alert style="margin-bottom: 5px" v-for="alert in alerts" :key="new (Date)" :closable="false" type="warning" :description="'Заканчиваются '+alert.name"></el-alert>
              <el-badge style="margin-right: 10px" :value="alerts.length" class="item" slot="reference">
                <el-button  circle icon="el-icon-bell" ></el-button>
              </el-badge>
            </el-popover>
             <el-button circle icon="el-icon-user" ></el-button>

          </div>
        </div>

      </div>

    </div>


  </div>


</template>

<script>
  export default {

    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1',
        alerts:[

        ]
      };
    },
    watch: {
      '$route.path': function (val) {
        this.checkSubcats()

      }
    },
    mounted() {
       this.checkSubcats()
        this.intervalid1 = setInterval(() => {
        this.checkSubcats()

    }, 3000);
    },
    methods: {
      handleSelect(key, keyPath) {

      },
      async checkSubcats(){
        let response = await this.$axios.get(`/api/v1/subcategory/check/all/`)
            console.log(response)
        this.alerts= response.data
      }
    }
  }
</script>


