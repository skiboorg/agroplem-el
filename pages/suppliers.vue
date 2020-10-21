<template>
  <el-main>
    <div class="container">
             <el-form :inline="true" :model="newSuppForm" >
            <el-form-item >
              <el-input v-model="newSuppForm.name" placeholder="Название поставщика"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="danger" @click="createSupplier">Создать поставщика</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="suppliers.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
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
                  placeholder="Поиск поставщика"/>
              </template>
              <template slot-scope="scope">
                <el-popover
                  ref="editPopover"
                  placement="top"
                  width="400"
                  trigger="click">
                  <div style="display: flex" class="">
                    <el-input v-model="editInfo" :placeholder="scope.row.name"></el-input>
                    <el-button type="primary" @click="updateRecord(scope.row.id,'supplier')">Сохранить</el-button>
                  </div>
                  <el-button slot="reference" size="mini" >Редактировать</el-button>
                </el-popover>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row, 'supplier')">Удалить</el-button>
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
        const  response_suppliers= await $axios.get(`/api/v1/suppliers/`)


        const suppliers = response_suppliers.data


        return {suppliers}
      }catch (e) {
        throw e
      }
    },
    data() {
      return {
        editInfo:null,
        newSuppForm:{
          name:null
        },
        search: '',
      }

    },
    methods: {
      closePopover(){
        document.querySelector(".test").click()
      },

      async getSppliers(){
        const  response_suppliers= await this.$axios.get(`/api/v1/suppliers/`)
        this.suppliers = response_suppliers.data
      },

      async createSupplier(){
        const response = await this.$axios.post('/api/v1/supplier/create/',this.newSuppForm)
        this.getSppliers()
      },

      async updateRecord(id,type,status){
        if (type === 'supplier'){
          await this.$axios.put(`/api/v1/supplier/edit/${id}`,{'name':this.editInfo})
          this.getSppliers()
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

        if (type === 'supplier'){
          await this.$axios.delete(`/api/v1/supplier/delete/${row.id}`)
          this.getSppliers()
        }

      }


    }
  };
</script>


