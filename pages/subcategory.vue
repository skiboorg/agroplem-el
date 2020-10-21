<template>
  <el-main>
    <div class="container">
      <el-form :inline="true" :model="newCatForm" >
        <el-form-item >
                  <el-select v-model="newCatForm.category" placeholder="Выберите категорию">
                    <el-option
                      v-for="item in categories"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
        <el-form-item >
          <el-input v-model="newCatForm.name" placeholder="Название подкатегории"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="danger" @click="createSubCategory">Создать подкатегорию</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="subcategories.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%">
        <el-table-column
          label="ID"
          prop="id"
          width="100">
        </el-table-column>
          <el-table-column
              prop="cat_filter"
              label="Категория"
              width="300"
              :filters="cat_filter"
              :filter-method="filterCat"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                  :type="'info'"
                  disable-transitions>{{scope.row.category.name}}</el-tag>
              </template>
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
        const  response_subcategories= await $axios.get(`/api/v1/subcategories/`)
        const  response_categories= await $axios.get(`/api/v1/categories/`)
        const categories = response_categories.data
        const subcategories = response_subcategories.data
        let cat_filter = []
        for (let i of categories){
          cat_filter.push({text:i.name,value:i.id})
        }
        return {subcategories,categories,cat_filter}
      }catch (e) {
        throw e
      }
    },
    data() {
      return {
        editInfo:null,
        newCatForm:{
          name:null,
          category:null
        },
        search: '',
      }
    },
    methods: {
      closePopover(){
        document.querySelector(".test").click()
      },

      async getCategories(){
        const  response_categories= await this.$axios.get(`/api/v1/subcategories/`)
        this.subcategories = response_categories.data

      },

      async createSubCategory(){
        const response = await this.$axios.post('/api/v1/subcategory/create/',this.newCatForm)
        this.getCategories()
      },

      async updateRecord(id,type){
        if (type === 'cat'){
          await this.$axios.put(`/api/v1/subcategory/edit/${id}`,{'name':this.editInfo})
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
          await this.$axios.delete(`/api/v1/subcategory/delete/${row.id}`)
          this.getCategories()
        }
      },
      filterCat(value, row) {
        console.log(row)
        console.log(value)
        return row.category.id === value;
      },


    }
  };
</script>


