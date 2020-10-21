<template>
  <el-main>
    <div class="container">
      <el-collapse >
        <el-collapse-item title="Создание партии товаров" name="1">
          <el-form :inline="true" :model="newItemForm" >
            <el-form-item >
              <el-input v-model="newItemForm.name" placeholder="Название товара"></el-input>
            </el-form-item>
            <el-form-item >
              <el-input v-model="newItemForm.number" placeholder="Количество единиц"></el-input>
            </el-form-item>
            <el-form-item >
              <el-select v-model="newItemForm.category" @change="catSelected" placeholder="Выберите категорию">
                <el-option
                  v-for="item in categories"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item >
              <el-select v-model="newItemForm.subcategory" placeholder="Выберите подкатегорию">
                <el-option
                  v-for="item in subcategories_result"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item >
              <el-select v-model="newItemForm.supplier" placeholder="Выберите поставщика">
                <el-option
                  v-for="item in suppliers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item >
              <el-select v-model="newItemForm.tester" placeholder="Выберите приемщика">
                <el-option
                  v-for="item in testers"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="newItemForm.iid" placeholder="Серийный номер партии"></el-input>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="newItemForm.good_time"
                type="date"
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
                placeholder="Срок годности">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                v-model="newItemForm.created_at"
                type="date"
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
                placeholder="Дата приемки">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="danger" @click="createItems">СОЗДАТЬ</el-button>
            </el-form-item>
            <el-form-item style="width: 100%">
              <el-input
                style="width: 100%"
                class="dfd"
                type="textarea"
                autosize
                :autosize="{ minRows: 3, maxRows: 10}"
                placeholder="Коментарий к партии"
                v-model="newItemForm.comment">
              </el-input>
            </el-form-item>

          </el-form>
        </el-collapse-item>

      </el-collapse>

      <el-table
        :data="items.filter(data => !search || data.id === parseInt(search))"
        :default-sort = "{prop: 'id', order: 'descending'}"
        style="width: 100%">


        <el-table-column type="expand">
          <template slot-scope="props">
            <p>Коментарий: {{ props.row.comment }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="ID товара"
          prop="id"
          sortable
          width="150">
        </el-table-column>
        <el-table-column
          label="ID партии"
          width="150"
        >
          <template slot-scope="scope">
            <p>{{ scope.row.sort.iid }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Название товара"
          prop="name">
        </el-table-column>

        <el-table-column
          prop="cat_filter"
          label="Категория"
          width="150"
          :filters="cat_filter"
          :filter-method="filterCat"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
              :type="'info'"
              disable-transitions>{{scope.row.sort.subcategory.category.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="cat_filter"
          label="Подкатегория"
          width="150"
          :filters="subcat_filter"
          :filter-method="filterSubCatSort"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
              :type="'info'"
              disable-transitions>{{scope.row.sort.subcategory.name}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          label="Статус"
          width="150"
          :filters="[{ text: 'В наличии', value: true }, { text: 'Списан', value: false }]"
          :filter-method="filterTag"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === true ? 'success' : 'danger'"
              disable-transitions>{{scope.row.status ? 'В наличии' : 'Списан'}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          align="right"
        width="400">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"

              size="mini"
              placeholder="Поиск по ID"/>
          </template>
          <template slot-scope="scope">
            <el-popover
              ref="editPopover"
              placement="left"
              width="400"
              trigger="click">
              <div style="display: flex; align-items: center" class="">
                <el-input
                  type="textarea"
                  autosize
                  :autosize="{ minRows: 3, maxRows: 10}"
                  v-model="editInfo" placeholder="Ваш комментарий"></el-input>
                <el-button type="primary" @click="updateRecord(scope.row.id,'item')">Сохранить</el-button>
              </div>
              <el-button slot="reference" size="mini" >Добавить коментарий</el-button>
            </el-popover>
            <el-popover
              placement="top"
              width="190">
              <p style="margin-bottom: 10px">Точно списать?</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="closePopover">Нет</el-button>
                <el-button type="danger" size="mini" @click="updateRecord(scope.row.id,'item',false)">Да</el-button>
              </div>
              <el-button v-if="scope.row.status" size="mini" type="danger"  slot="reference">Списать</el-button>
              <el-button v-else size="mini"  type="danger" @click="updateRecord(scope.row.id,'item',true)"  slot="reference">Отменить списание</el-button>
            </el-popover>
            <el-button  size="mini" icon="el-icon-camera" @click="getImage(scope.row.id)"></el-button>
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

        for (let i of categories){
          cat_filter.push({text:i.name,value:i.id})
        }
        for (let i of subcategories){
          subcat_filter.push({text:i.name,value:i.id})
        }


        return {suppliers,testers,categories,items,sorts,cat_filter,subcategories,subcat_filter}
      }catch (e) {
        throw e
      }
    },
    data() {
      return {
        editInfo:null,
        subcategories_result:null,
        visible:false,
        activeTab: 'tab1',
        newItemForm: {
          name: '',
          number: '',
          category: '',
          subcategory: '',
          supplier: '',
          tester: '',
          good_time:null,
          created_at:null,
          comment:null,
          iid:null,
        },

        search: '',
      }

    },
    watch:{
      search(val){
        console.log(this.items.find(x => x.id === parseInt(val)))
        let test = null
        try{
          test = this.items.find(x => x.id === parseInt(val))
        }
        catch (e) {

        }

      }
    },
    methods: {
      closePopover(){
        document.querySelector(".test").click()
      },
      catSelected(){
        console.log(this.newItemForm.category)
        console.log(this.subcategories.filter(x => x.category.id === this.newItemForm.category))
        this.subcategories_result = this.subcategories.filter(x => x.category.id === this.newItemForm.category)
      },

      async getItems(){
        const  response_items= await this.$axios.get(`/api/v1/items/`)
        this.items = response_items.data
      },

      async createItems(){
        const response = await this.$axios.post('/api/v1/item/create/',this.newItemForm)
        this.getItems()

      },

      async updateRecord(id,type,status){

        if (type === 'item'){
          if(this.editInfo){
            await this.$axios.put(`/api/v1/item/edit/${id}`,{'comment':this.editInfo})
          }else {
            await this.$axios.put(`/api/v1/item/edit/${id}`,{'status':status})
          }
          this.getItems()
        }

        this.editInfo = null
        document.querySelector(".test").click()
      },



      filterTag(value, row) {
        return row.status === value;
      },
      filterCat(value, row) {

        return row.sort.subcategory.category.id === value;
      },

      filterSubCatSort(value, row) {
        console.log(row.sort.subcategory)
        console.log(value)
        return row.sort.subcategory.id === value;
      },

      async getImage(id){
        const response = await this.$axios.post(`/api/v1/item/get_image/`,{id:id})
        console.log(response)
        let url = process.env.img_url+response.data.path
        var link = document.createElement('a');
        link.target = '_blank'
        link.href = url
        link.download = url
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },

    }
  };
</script>


