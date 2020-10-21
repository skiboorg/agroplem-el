<template>
  <el-main>
    <div class="container">
      <el-table
            :data="sorts.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <p>Коментарий: {{ props.row.comment }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="ID"
              prop="iid"
              width="100">
            </el-table-column>
            <el-table-column
              label="Название"
              prop="name">
            </el-table-column>
            <el-table-column
              label="Кол-во едениц"
              prop="item_number"
              width="80">
            </el-table-column>
            <el-table-column label="Срок годности" width="150">
              <template slot-scope="prop">
                <p>{{new Date(prop.row.good_time).toLocaleDateString()}}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="Дата приемки"
              width="150"
            >
              <template slot-scope="prop">
                <p>{{new Date(prop.row.created).toLocaleDateString()}}</p>
              </template>
            </el-table-column>
        <el-table-column
              prop="cat_filter"
              label="Категория"
              width="100"
              :filters="cat_filter"
              :filter-method="filterCatSort"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                  :type="'info'"
                  disable-transitions>{{scope.row.subcategory.category.name}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="cat_filter"
              label="Подкатегория"
              width="100"
              :filters="subcat_filter"
              :filter-method="filterSubCatSort"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                  :type="'info'"
                  disable-transitions>{{scope.row.subcategory.name}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="test_filter"
              label="Приемщик"
              width="100"
              :filters="test_filter"
              :filter-method="filterTestSort"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                  :type="'info'"
                  disable-transitions>{{scope.row.tester.name}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="supp_filter"
              label="Поставщик"
              width="100"
              :filters="supp_filter"
              :filter-method="filterSuppSort"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                  :type="'info'"
                  disable-transitions>{{scope.row.supplier.name}}</el-tag>
              </template>
            </el-table-column>

            <el-table-column
              width="200"
              align="right">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="search"
                  size="mini"
                  placeholder="Поиск партии"/>
              </template>
              <template slot-scope="scope">

                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row, 'sort')">Удалить</el-button>
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
        const  response_testers= await $axios.get(`/api/v1/testers/`)
        const  response_categories= await $axios.get(`/api/v1/categories/`)
        const  response_subcategories= await $axios.get(`/api/v1/subcategories/`)
        const  response_items= await $axios.get(`/api/v1/items/`)
        const  response_sorts= await $axios.get(`/api/v1/sorts/`)

        const suppliers = response_suppliers.data
        const testers = response_testers.data
        const categories = response_categories.data
        const subcategories = response_subcategories.data
        const sorts = response_sorts.data
        const items = response_items.data

        let cat_filter = []
        let subcat_filter = []
        let test_filter = []
        let supp_filter = []

        for (let i of categories){
          cat_filter.push({text:i.name,value:i.id})
        }
        for (let i of subcategories){
          subcat_filter.push({text:i.name,value:i.id})
        }
        for (let i of testers){
          test_filter.push({text:i.name,value:i.id})
        }
        for (let i of suppliers){
          supp_filter.push({text:i.name,value:i.id})
        }


        return {suppliers,testers,categories,items,sorts,cat_filter,test_filter,supp_filter,subcat_filter}
      }catch (e) {
        throw e
      }
    },
    data() {
      return {
        editInfo:null,
        search: '',
      }

    },
    methods: {
      closePopover(){
        document.querySelector(".test").click()
      },
      async getSort(){
        const  response_sorts= await this.$axios.get(`/api/v1/sorts/`)
        this.sorts = response_sorts.data
      },


      handleClick(tab, event) {
        console.log(tab, event);
      },
      handleEdit(index, row, type) {
        console.log(index, row,type);
      },
      async handleDelete(index, row,type) {
        if (type === 'sort'){
          await this.$axios.delete(`/api/v1/sort/delete/${row.id}`)
          this.getSort()

        }
      },
      filterTag(value, row) {
        return row.status === value;
      },
      filterCat(value, row) {

        return row.sort.category.id === value;
      },
      filterSubCatSort(value, row) {
        console.log(row)
        console.log(value)
        return row.subcategory.id === value;
      },
      filterCatSort(value, row) {

        return row.subcategory.category.id === value;
      },
      filterSuppSort(value, row) {

        return row.sort.supplier.id === value;
      },
      filterTestSort(value, row) {

        return row.tester.id === value;
      },
      filterEquipment(value, row) {
        return row.equipment.id === value;
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      changeItemStatus(value,row){
        console.log(value,row)
      },


    }
  };
</script>


