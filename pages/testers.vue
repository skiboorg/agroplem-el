<template>
  <el-main>
    <div class="container">
        <el-form :inline="true" :model="newTestForm" >
            <el-form-item >
              <el-input v-model="newTestForm.name" placeholder="Название приемщика"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="danger" @click="createTester">Создать приемщика</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="testers.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
            style="width: 100%">
            <el-table-column
              label="ID"
              prop="id">
            </el-table-column>
            <el-table-column
              label="Название"
              prop="name">
            </el-table-column>
            <el-table-column
              align="right">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="search"
                  size="mini"
                  placeholder="Поиск приемщика"/>
              </template>
              <template slot-scope="scope">
                <el-popover
                  ref="editPopover"
                  placement="top"
                  width="400"
                  trigger="click">
                  <div style="display: flex" class="">
                    <el-input v-model="editInfo" :placeholder="scope.row.name"></el-input>
                    <el-button type="primary" @click="updateRecord(scope.row.id,'tester')">Сохранить</el-button>
                  </div>
                  <el-button slot="reference" size="mini" >Редактировать</el-button>
                </el-popover>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row, 'tester')">Удалить</el-button>
              </template>
            </el-table-column>
          </el-table>

    </div>
  </el-main>
</template>

<script>
  export default {
    async asyncData({$axios}){

      try{

        const  response_testers= await $axios.get(`/api/v1/testers/`)

        const testers = response_testers.data

        return {testers}
      }catch (e) {
        throw e
      }
    },
    data() {
      return {
        editInfo:null,

        newTestForm:{
          name:null
        },
        search: '',
      }

    },
    methods: {
      closePopover(){
        document.querySelector(".test").click()
      },

      async getTesters(){
        const  response_testers= await this.$axios.get(`/api/v1/testers/`)
        this.testers = response_testers.data
      },
      async createTester(){
        const response = await this.$axios.post('/api/v1/tester/create/',this.newTestForm)
        this.getTesters()
      },

      async updateRecord(id,type,status){

        if (type === 'tester'){
          await this.$axios.put(`/api/v1/tester/edit/${id}`,{'name':this.editInfo})
          this.getTesters()
        }
        this.editInfo = null
        document.querySelector(".test").click()
      },

      async handleDelete(index, row,type) {

        if (type === 'tester'){
          await this.$axios.delete(`/api/v1/tester/delete/${row.id}`)
          this.getTesters()
        }

      }


    }
  };
</script>


