<template>
  <el-main>
    <div class="container">
      <el-tabs :stretch="true" v-model="activeTab">
        <el-tab-pane label="ТОВАРЫ" name="tab1">
          <el-collapse >
            <el-collapse-item title="Создание товара" name="1">
              <el-form :inline="true" :model="newItemForm" >
                <el-form-item >
                  <el-input v-model="newItemForm.name" placeholder="Название"></el-input>
                </el-form-item>
                <el-form-item >
                  <el-input v-model="newItemForm.number" placeholder="Количество"></el-input>
                </el-form-item>
                <el-form-item >
                  <el-select v-model="newItemForm.category" placeholder="Выберите категорию">
                    <el-option
                      v-for="item in categories"
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
            :data="items.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
            :default-sort = "{prop: 'iid', order: 'descending'}"
            style="width: 100%">

            <el-table-column type="expand">
              <template slot-scope="props">
                <p>Коментарий: {{ props.row.comment }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="IID товара"
              prop="iid"
              sortable
              width="150">
            </el-table-column>
            <el-table-column
              label="IID партии"
              width="100"
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
              width="100"
              :filters="cat_filter"
              :filter-method="filterCat"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                  :type="'info'"
                  disable-transitions>{{scope.row.sort.category.name}}</el-tag>
              </template>
            </el-table-column>

            <el-table-column
              prop="status"
              label="Статус"
              width="100"
              :filters="[{ text: 'Нормально', value: true }, { text: 'Списан', value: false }]"
              :filter-method="filterTag"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status === true ? 'success' : 'danger'"
                  disable-transitions>{{scope.row.status ? 'Нормально' : 'Списан'}}</el-tag>
              </template>
            </el-table-column>

            <el-table-column
              align="right">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="search"
                  size="mini"
                  placeholder="Type to search"/>
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
                    <el-button type="danger" size="mini" @click="updateRecord(scope.row.id,'item')">Да</el-button>
                  </div>
                  <el-button v-if="scope.row.status" size="mini" type="danger"  slot="reference">Списать</el-button>
                  <el-button v-else size="mini" disabled="" type="danger"  slot="reference">Списан</el-button>
                </el-popover>
                <el-button  size="mini" icon="el-icon-camera" @click="getImage(scope.row.id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane> <!--    tab-1-->
        <el-tab-pane label="ПАРТИИ" name="tab2">
          <el-table
            :data="sorts.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <p>Коментарий: {{ props.row.comment }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="IID"
              prop="iid"
              width="100">
            </el-table-column>
            <el-table-column
              label="Название"
              prop="name">
            </el-table-column>
            <el-table-column
              label="Кол-во товаров"
              prop="item_number"
              width="100">
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
                  disable-transitions>{{scope.row.category.name}}</el-tag>
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
        </el-tab-pane><!--    tab-2-->
        <el-tab-pane label="КАТЕГОРИИ" name="tab3">
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
              label="Name"
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
        </el-tab-pane><!--    tab-3-->
        <el-tab-pane label="ПОСТАВЩИКИ" name="tab4">
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
              label="Name"
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
        </el-tab-pane><!--    tab-4-->
        <el-tab-pane label="ПРИЕМЩИКИ" name="tab5">
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
              label="Name"
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
        </el-tab-pane><!--    tab-5-->
        <el-tab-pane label="ПРОВЕРКИ ОБОРУДОВАНИЯ" name="tab6">
          <el-collapse >
            <el-collapse-item title="Добавить проверку оборудования" name="1">
              <el-form :inline="true" :model="newEqupTestForm" >

                <el-form-item >
                  <el-select v-model="newEqupTestForm.equipment" placeholder="Выберите оборудование">
                    <el-option
                      v-for="item in equipment"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item>
                  <el-date-picker
                    v-model="newEqupTestForm.check_date"
                    type="date"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    placeholder="Дата проверки">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-date-picker
                    v-model="newEqupTestForm.calibrate_date"
                    type="date"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    placeholder="Дата калибровки">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-date-picker
                    v-model="newEqupTestForm.test_date"
                    type="date"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    placeholder="Дата обслуживания">
                  </el-date-picker>
                </el-form-item>

                <el-form-item>
                  <el-button type="danger" @click="createEqupTest">СОЗДАТЬ</el-button>
                </el-form-item>
                <el-form-item style="width: 100%">
                  <el-input
                    style="width: 100%"
                    class="dfd"
                    type="textarea"
                    autosize
                    :autosize="{ minRows: 3, maxRows: 10}"
                    placeholder="Коментарий"
                    v-model="newEqupTestForm.comment">
                  </el-input>
                </el-form-item>

              </el-form>
            </el-collapse-item>

          </el-collapse>
          <el-table
            :data="equip_test"

            style="width: 100%">

            <el-table-column type="expand">
              <template slot-scope="props">
                <p>Коментарий к проверке: {{ props.row.comment }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="equipment"
              label="Оборудование"
              width="150"
              :filters="equip_filter"
              :filter-method="filterEquipment"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                  :type="'info'"
                  disable-transitions>{{scope.row.equipment.name}}</el-tag>
              </template>
            </el-table-column>

            <!--            <el-table-column  label="Оборудование" >-->
            <!--              <template slot-scope="scope">-->
            <!--                <p>{{ scope.row.equipment.name }}</p>-->
            <!--              </template>-->
            <!--            </el-table-column>-->
            <el-table-column label="IID оборудования" width="100">
              <template slot-scope="scope">
                <p>{{ scope.row.equipment.iid }}</p>
              </template>
            </el-table-column>

            <el-table-column label="Дата проверки " width="150">
              <template slot-scope="prop">
                <p>{{new Date(prop.row.check_date).toLocaleDateString()}}</p>
              </template>
            </el-table-column>
            <el-table-column label="Дата калибровки" width="150">
              <template slot-scope="prop">
                <p>{{new Date(prop.row.calibrate_date).toLocaleDateString()}}</p>
              </template>
            </el-table-column>
            <el-table-column label="Дата обслуживания" width="150">
              <template slot-scope="prop">
                <p>{{new Date(prop.row.test_date).toLocaleDateString()}}</p>
              </template>
            </el-table-column>






          </el-table>

        </el-tab-pane><!--    tab-6-->
      </el-tabs>
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
        const  response_items= await $axios.get(`/api/v1/items/`)
        const  response_sorts= await $axios.get(`/api/v1/sorts/`)
        const  response_equipment= await $axios.get(`/api/v1/equips/`)
        const  response_equiptest= await $axios.get(`/api/v1/equip_tests/`)

        const suppliers = response_suppliers.data
        const testers = response_testers.data
        const categories = response_categories.data
        const sorts = response_sorts.data
        const items = response_items.data
        const equipment = response_equipment.data
        const equip_test = response_equiptest.data
        let cat_filter = []
        let test_filter = []
        let supp_filter = []
        let equip_filter = []
        for (let i of categories){
          cat_filter.push({text:i.name,value:i.id})
        }
        for (let i of testers){
          test_filter.push({text:i.name,value:i.id})
        }
        for (let i of suppliers){
          supp_filter.push({text:i.name,value:i.id})
        }
        for (let i of equipment){
          equip_filter.push({text:i.name,value:i.id})
        }

        return {suppliers,testers,categories,items,sorts,cat_filter,test_filter,supp_filter,equipment,equip_test,equip_filter}
      }catch (e) {
        throw e
      }
    },
    data() {
      return {
        editInfo:null,
        visible:false,
        activeTab: 'tab1',
        newItemForm: {
          name: '',
          number: '',
          category: '',
          supplier: '',
          tester: '',
          good_time:null,
          created_at:null,
          comment:null,
          iid:null,
        },
        newEqupTestForm: {
          equipment: '',
          check_date:null,
          calibrate_date:null,
          test_date:null,
          comment:null,

        },
        newCatForm:{
          name:null
        },
        newSuppForm:{
          name:null
        },
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
      async getSppliers(){
        const  response_suppliers= await this.$axios.get(`/api/v1/suppliers/`)
        this.suppliers = response_suppliers.data
      },
      async getTesters(){
        const  response_testers= await this.$axios.get(`/api/v1/testers/`)
        this.testers = response_testers.data
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
      async getItems(){
        const  response_items= await this.$axios.get(`/api/v1/items/`)
        this.items = response_items.data
      },
      async getEqupTest(){
        const  response_equip_test= await this.$axios.get(`/api/v1/equip_tests/`)

        this.equip_test = response_equip_test.data
      },
      async getSort(){
        const  response_sorts= await this.$axios.get(`/api/v1/sorts/`)
        this.sorts = response_sorts.data
      },
      async createSupplier(){
        const response = await this.$axios.post('/api/v1/supplier/create/',this.newSuppForm)
        this.getSppliers()
      },
      async createTester(){
        const response = await this.$axios.post('/api/v1/tester/create/',this.newTestForm)
        this.getTesters()
      },
      async createCategory(){
        const response = await this.$axios.post('/api/v1/category/create/',this.newCatForm)
        this.getCategories()
      },
      async createItems(){
        const response = await this.$axios.post('/api/v1/item/create/',this.newItemForm)
        this.getItems()

      },
      async createEqupTest(){
        const response = await this.$axios.post('/api/v1/equip_test/create/',this.newEqupTestForm)
        this.getEqupTest()

      },
      async updateRecord(id,type){
        if (type === 'supplier'){
          await this.$axios.put(`/api/v1/supplier/edit/${id}`,{'name':this.editInfo})
          this.getSppliers()
        }
        if (type === 'tester'){
          await this.$axios.put(`/api/v1/tester/edit/${id}`,{'name':this.editInfo})
          this.getTesters()
        }
        if (type === 'cat'){
          await this.$axios.put(`/api/v1/category/edit/${id}`,{'name':this.editInfo})
          this.getCategories()
        }
        if (type === 'item'){
          if(this.editInfo){
            await this.$axios.put(`/api/v1/item/edit/${id}`,{'comment':this.editInfo})
          }else {
            await this.$axios.put(`/api/v1/item/edit/${id}`,{'status':false})
          }

          this.getItems()

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
        console.log(index, row.id);
        if (type === 'supplier'){
          await this.$axios.delete(`/api/v1/supplier/delete/${row.id}`)
          this.getSppliers()
        }
        if (type === 'tester'){
          await this.$axios.delete(`/api/v1/tester/delete/${row.id}`)
          this.getTesters()
        }
        if (type === 'cat'){
          await this.$axios.delete(`/api/v1/category/delete/${row.id}`)
          this.getCategories()
        }
        if (type === 'sort'){
          await this.$axios.delete(`/api/v1/sort/delete/${row.id}`)
          this.getSort()
          this.getItems()
        }
      },
      filterTag(value, row) {
        return row.status === value;
      },
      filterCat(value, row) {

        return row.sort.category.id === value;
      },
      filterCatSort(value, row) {

        return row.category.id === value;
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
      async getImage(id){

        const response = await this.$axios.post(`/api/v1/item/get_image/`,{id:id})
        console.log(response)
        let url = `http://localhost:8000/${response.data.path}`
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


