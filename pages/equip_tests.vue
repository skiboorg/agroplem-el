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
      <el-table :data="equipment" style="width: 100%">

        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              :data="props.row.test"
              style="width: 100%">
              <el-table-column
                label="Дата"
                width="180">
                <template slot-scope="scope">
                  <p>{{new Date(scope.row.date).toLocaleDateString()}}</p>
                </template>
              </el-table-column>
              <el-table-column
                label="Тип даты"
                width="180">
                <template slot-scope="scope">
                  <p>{{scope.row.date_type.name}}</p>
                </template>
              </el-table-column>
              <el-table-column
                prop="event"
                label="Событие">
              </el-table-column>
              <el-table-column
                prop="comment"
                label="Комментарий">
              </el-table-column>
              <el-table-column
                prop=""
                label="">
                <template slot-scope="scope">
                  <p> <el-button  size="mini" type="danger" icon="el-icon-delete" circle  slot="reference" @click="deleteTest(scope.row)"></el-button></p>
                </template>
              </el-table-column>
            </el-table>
            <!--                <p>Проведенные тесты</p><br>-->
            <!--                <p v-for="test in props.row.test" :key="test.id">-->
            <!--                  Дата:{{new Date(test.date).toLocaleDateString()}}-->
            <!--                  Тип даты: {{test.date_type.name}}-->
            <!--                  Событие: {{test.event}}-->
            <!--                  Комментарий: {{test.comment}}-->
            <!--                </p>-->
          </template>
        </el-table-column>
        <!--            <el-table-column-->
        <!--              prop="equipment"-->
        <!--              label="Оборудование"-->
        <!--              width="150"-->
        <!--              :filters="equip_filter"-->
        <!--              :filter-method="filterEquipment"-->
        <!--              filter-placement="bottom-end">-->
        <!--              <template slot-scope="scope">-->
        <!--                <el-tag-->
        <!--                  :type="'info'"-->
        <!--                  disable-transitions>{{scope.row.name}}</el-tag>-->
        <!--              </template>-->
        <!--            </el-table-column>-->

        <!--            <el-table-column  label="Оборудование" >-->
        <!--              <template slot-scope="scope">-->
        <!--                <p>{{ scope.row.equipment.name }}</p>-->
        <!--              </template>-->
        <!--            </el-table-column>-->
        <el-table-column label="Серийный номер оборудования" >
          <template slot-scope="scope">
            <p>{{ scope.row.iid }}</p>
          </template>
        </el-table-column>
        <el-table-column label="Название" >
          <template slot-scope="scope">
            <p>{{ scope.row.name }}</p>
          </template>
        </el-table-column>
        <el-table-column  label="Ввод в эксплуатацию">
          <template slot-scope="prop">
            <p v-if="prop.row.start_work">{{new Date(prop.row.start_work).toLocaleDateString()}}</p>
            <p v-else>-</p>
          </template>
        </el-table-column>
         <el-table-column  label="Поставщик">
          <template slot-scope="prop">
            <p>{{prop.row.manufactor}}</p>
          </template>
        </el-table-column>
        <el-table-column label="Комментарий" >
          <template slot-scope="scope">
            <p>{{ scope.row.comment }}</p>
          </template>
        </el-table-column>
        <el-table-column label="" width="70">
          <template slot-scope="scope">
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
      async deleteTest(row){
        console.log(row)
        const  response_equip_test= await this.$axios.delete(`/api/v1/equip_test/delete/${row.id}`)
        this.getEqups()
      },
      async getEqupTest(){
        const  response_equip_test= await this.$axios.get(`/api/v1/equip_tests/`)

        this.equip_test = response_equip_test.data
      },
      async getEqups(){
        const  response= await this.$axios.get(`/api/v1/equips/`)

        this.equipment = response.data
      },
      async createEqupTest(){
        const response = await this.$axios.post('/api/v1/equip_test/create/',this.newEqupTestForm)
        this.getEqupTest()

      },
      filterEquipment(value, row) {
        return row.id === value;
      },
      async getImage(id){
        const response = await this.$axios.post(`/api/v1/equip/get_image/`,{id:id})
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


