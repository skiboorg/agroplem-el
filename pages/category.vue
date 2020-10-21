<template>
  <el-main>
    <div class="container">
      <el-form :inline="true" :model="newCatForm" >
        <el-form-item >
          <el-input v-model="newCatForm.name" placeholder="Название категории"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="danger" @click="createCategory">Создать категорию</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="categories.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
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
              placeholder="Поиск категории"/>
          </template>
          <template slot-scope="scope">
            <el-popover
              ref="editPopover"
              placement="top"
              width="400"
              trigger="click">
              <div style="display: flex" class="">
                <el-input v-model="editInfo" :placeholder="scope.row.name"></el-input>
                <el-button type="primary" @click="updateRecord(scope.row.id,'cat')">Сохранить</el-button>
              </div>
              <el-button slot="reference" size="mini" >Редактировать</el-button>
            </el-popover>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row, 'cat')">Удалить</el-button>
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

        const  response_categories= await $axios.get(`/api/v1/categories/`)



        const categories = response_categories.data



        return {categories}
      }catch (e) {
        throw e
      }
    },
    data() {
      return {
        editInfo:null,

        newCatForm:{
          name:null
        },
        search: '',
      }

    },
    methods: {
      closePopover(){
        document.querySelector(".test").click()
      },

      async getCategories(){
        const  response_categories= await this.$axios.get(`/api/v1/categories/`)
        this.categories = response_categories.data
        let temp = []
        for (let i of this.categories){

          temp.push({text:i.name,value:i.id})
        }
        this.cat_filter = temp
      },

      async createCategory(){
        const response = await this.$axios.post('/api/v1/category/create/',this.newCatForm)
        this.getCategories()
      },

      async updateRecord(id,type){
        if (type === 'cat'){
          await this.$axios.put(`/api/v1/category/edit/${id}`,{'name':this.editInfo})
          this.getCategories()
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

        if (type === 'cat'){
          await this.$axios.delete(`/api/v1/category/delete/${row.id}`)
          this.getCategories()
        }
      }


    }
  };
</script>


