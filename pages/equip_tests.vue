<template>
  <el-main>
    <div class="container">
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
                <el-form-item >
                  <el-select v-model="newEqupTestForm.date_type" placeholder="Тип даты">
                    <el-option
                      v-for="item in test_date_types"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item>
                  <el-date-picker
                    v-model="newEqupTestForm.date"
                    type="date"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    placeholder="Дата">
                  </el-date-picker>
                </el-form-item>
                <el-form-item >
              <el-input v-model="newEqupTestForm.event" placeholder="Событие"></el-input>
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
          <el-table :data="equip_test" style="width: 100%">

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
            <el-table-column label="С/Н оборудования" >
              <template slot-scope="scope">
                <p>{{ scope.row.equipment.iid }}</p>
              </template>
            </el-table-column>

            <el-table-column label="Дата" width="150">
              <template slot-scope="prop">
                <p>{{new Date(prop.row.date).toLocaleDateString()}}</p>
              </template>
            </el-table-column>
            <el-table-column label="Тип даты" width="150">
              <template slot-scope="prop">
                <p>{{prop.row.date_type.name}}</p>
              </template>
            </el-table-column>
            <el-table-column label="Событие" width="150">
              <template slot-scope="prop">
                <p>{{prop.row.event}}</p>
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
        const  response_equipment= await $axios.get(`/api/v1/equips/`)
        const  response_equiptest= await $axios.get(`/api/v1/equip_tests/`)
        const  response_test_date_types= await $axios.get(`/api/v1/equip_test_date_types/`)

        const test_date_types = response_test_date_types.data
        const equipment = response_equipment.data
        const equip_test = response_equiptest.data

        let equip_filter = []

        for (let i of equipment){
          equip_filter.push({text:i.name,value:i.id})
        }

        return {equipment,equip_test,equip_filter,test_date_types}
      }catch (e) {
        throw e
      }
    },
    data() {
      return {
        editInfo:null,
        visible:false,

        newEqupTestForm: {
          equipment: '',
          date_type:null,
          date:null,
          event:null,
          comment:null,
        },
        search: '',
      }

    },
    methods: {
      closePopover(){
        document.querySelector(".test").click()
      },
      async getEqupTest(){
        const  response_equip_test= await this.$axios.get(`/api/v1/equip_tests/`)

        this.equip_test = response_equip_test.data
      },
      async createEqupTest(){
        const response = await this.$axios.post('/api/v1/equip_test/create/',this.newEqupTestForm)
        this.getEqupTest()

      },
      filterEquipment(value, row) {
        return row.equipment.id === value;
      },
    }
  };
</script>


