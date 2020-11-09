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
          label="Кол-во единиц"
          prop="item_number"
        >
        </el-table-column>
        <el-table-column label="Срок годности" width="150">
          <template slot-scope="prop">
            <p>{{new Date(prop.row.good_time).toLocaleDateString()}}</p>
          </template>
        </el-table-column>
        <el-table-column label="Дата приемки">
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

          :filters="test_filter"
          :filter-method="filterTestSort"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
              :type="'info'"
              disable-transitions>{{scope.row.tester ? scope.row.tester.name : 'Не указан'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="supp_filter"
          label="Поставщик"

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

          align="right" width="190">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              placeholder="Поиск партии"/>
          </template>
          <template slot-scope="scope">
            <div style="display: flex; justify-content: space-between">
               <el-button  size="mini" type="warning" icon="el-icon-edit" @click="editRow(scope.row)"></el-button>
              <el-popover
                placement="top"
                width="190">
                <p style="margin-bottom: 10px">Точно удалить?</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="closePopover">Нет</el-button>
                  <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row, 'sort')">Да</el-button>
                </div>
                <el-button  size="mini" type="danger" icon="el-icon-delete" circle  slot="reference"></el-button>

              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="Редактирование партии"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <el-form :inline="true" :model="editForm" >

          <el-form-item>
            <p style="margin-bottom: 10px">Выберите статус?</p>
            <el-radio-group v-model="editForm.status"  size="mini">
              <el-radio-button label="Списан"></el-radio-button>
              <el-radio-button label="Ожидание"></el-radio-button>
              <el-radio-button label="В наличии"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-input
              style="width: 100%"
              class="dfd"
              type="textarea"
              autosize
              :autosize="{ minRows: 3, maxRows: 10}"
              placeholder="Коментарий"
              v-model="editForm.comment">
            </el-input>
          </el-form-item>
          <el-form-item >
              <el-input v-model="editForm.iid" placeholder="Серийный номер партии"></el-input>
            </el-form-item>
          <el-form-item>
              <el-date-picker
                v-model="editForm.good_time"
                type="date"
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
                placeholder="Срок годности">
              </el-date-picker>
            </el-form-item>
           <el-form-item>
              <el-date-picker
                v-model="editForm.created"
                type="date"
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
                placeholder="Дата приемки">
              </el-date-picker>
            </el-form-item>

          <el-form-item>
            <el-button type="danger" @click="changeStatus">Обновить партию</el-button>
          </el-form-item>


        </el-form>
      </el-dialog>

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
        let test_filter = [{text:'Не указан',value:null}]
        let supp_filter = []
        console.log(test_filter)
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
        centerDialogVisible: false,
        search: '',
        sortID:null,
        editForm: {
          status: null,
          comment:null,
          iid:null,
          good_time:null,
          created:null,
        },
      }

    },
    methods: {
      editRow(row){
        this.centerDialogVisible = true
        this.sortID = row.id
        console.log(row)
        this.editForm = row

      },
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
          this.closePopover()

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
        if (row.tester){
          return row.tester.id === value;
        }else {
          return row.tester === null
        }

      },
      filterEquipment(value, row) {
        return row.equipment.id === value;
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      async changeStatus(){

        let response = await this.$axios.post(`/api/v1/sort/update/${this.sortID}`,this.editForm)
        console.log(response)
        if (response.status === 200){
          console.log('200')
          this.closePopover()
        }

        //this.editForm = null
      },


    }
  };
</script>


