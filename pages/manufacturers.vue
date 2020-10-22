<template>
  <el-main>
    <div class="container">
             <el-form :inline="true" :model="newManufForm" >
            <el-form-item >
              <el-input v-model="newManufForm.name" placeholder="Название производителя"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="danger" @click="createManufacturer">Создать производителя</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="manufacturers.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
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
                    <el-button type="primary" @click="updateRecord(scope.row.id,'manuf')">Сохранить</el-button>
                  </div>
                  <el-button slot="reference" size="mini" >Редактировать</el-button>
                </el-popover>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row, 'manuf')">Удалить</el-button>
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
        const  response_manufacturers= await $axios.get(`/api/v1/manufacturers/`)
        const manufacturers = response_manufacturers.data
        return {manufacturers}
      }catch (e) {
        throw e
      }
    },
    data() {
      return {
        editInfo:null,
        newManufForm:{
          name:null
        },
        search: '',
      }

    },
    methods: {
      closePopover(){
        document.querySelector(".test").click()
      },

      async getManufacturers(){
        const response= await this.$axios.get(`/api/v1/manufacturers/`)
        this.manufacturers = response.data
      },

      async createManufacturer(){
        const response = await this.$axios.post('/api/v1/manufacturer/create/',this.newManufForm)
        this.getManufacturers()
      },

      async updateRecord(id,type,status){
        if (type === 'manuf'){
          await this.$axios.put(`/api/v1/manufacturer/edit/${id}`,{'name':this.editInfo})
          this.getManufacturers()
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

        if (type === 'manuf'){
          await this.$axios.delete(`/api/v1/manufacturer/delete/${row.id}`)
          this.getManufacturers()
        }

      }


    }
  };
</script>


