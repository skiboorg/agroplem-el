<template>
  <el-main>
    <div class="container">
             <el-form :inline="true" :model="newForm" >
            <el-form-item >
              <el-input v-model="newForm.name" placeholder="Тип образца"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="danger" @click="createNew">Создать тип образца</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="sample_types.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
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
                  placeholder="Поиск производителя"/>
              </template>
              <template slot-scope="scope">
                <el-popover
                  ref="editPopover"
                  placement="top"
                  width="400"
                  trigger="click">
                  <div style="display: flex" class="">
                    <el-input v-model="editInfo" :placeholder="scope.row.name"></el-input>
                    <el-button type="primary" @click="updateRecord(scope.row.id,'type')">Сохранить</el-button>
                  </div>
                  <el-button slot="reference" size="mini" >Редактировать</el-button>
                </el-popover>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row, 'type')">Удалить</el-button>
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
        const  response= await $axios.get(`/api/v1/sample_types/`)
        const sample_types = response.data
        return {sample_types}
      }catch (e) {
        throw e
      }
    },
    data() {
      return {
        editInfo:null,
        newForm:{
          name:null
        },
        search: '',
      }

    },
    methods: {
      closePopover(){
        document.querySelector(".test").click()
      },

      async getSampletypes(){
        const response= await this.$axios.get(`/api/v1/sample_types/`)
        this.sample_types = response.data
      },

      async createNew(){
        const response = await this.$axios.post('/api/v1/sample_type/create/',this.newForm)
        this.getSampletypes()
      },

      async updateRecord(id,type,status){
        if (type === 'type'){
          await this.$axios.put(`/api/v1/sample_type/edit/${id}`,{'name':this.editInfo})
          this.getSampletypes()
        }
        this.editInfo = null
        document.querySelector(".test").click()
      },

      handleClick(tab, event) {
        console.log(tab, event);
      },
      handleEdit(index, row, type) {
        console.log(index, row,type);
      },
      async handleDelete(index, row,type) {

        if (type === 'type'){
          await this.$axios.delete(`/api/v1/sample_type/delete/${row.id}`)
          this.getSampletypes()
        }

      }


    }
  };
</script>


