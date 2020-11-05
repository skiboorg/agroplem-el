<template>
  <el-main>
    <div class="container">
      <el-collapse >
        <el-collapse-item title="Создать оборудование" name="1">

          <el-form :inline="true" :model="newEquipForm" >
            <el-form-item >
              <el-input v-model="newEquipForm.name" placeholder="Название"></el-input>
            </el-form-item>
            <el-form-item >
              <el-input v-model="newEquipForm.iid" placeholder="Серийный номер"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="danger" @click="createEquipment">Создать оборудование</el-button>
            </el-form-item>
            <el-form-item style="width: 100%">
              <el-input
                style="width: 100%"
                class="dfd"
                type="textarea"
                autosize
                :autosize="{ minRows: 3, maxRows: 10}"
                placeholder="Коментарий"
                v-model="newEquipForm.comment">
              </el-input>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <el-table
        :data="equipment.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%;margin-bottom: 30px">
        <el-table-column type="expand">
          <template slot-scope="props">
            <p>Коментарий: {{ props.row.comment }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="СН оборудование"
          prop="iid">
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
              placeholder="Поиск по названию"/>
          </template>
          <template slot-scope="scope">
            <el-popover
              ref="editPopover"
              placement="left"
              width="400"
              trigger="click">
              <div style="display: flex;flex-direction: column" class="">
                <el-input style="margin-bottom: 10px" v-model="editIID" :placeholder="editIID"></el-input>
                <el-input style="margin-bottom: 10px" v-model="editName" :placeholder="editName"></el-input>
                <el-input type="textarea"
                          autosize style="margin-bottom: 10px" v-model="editComment" :placeholder="editComment"></el-input>
                <el-button type="primary" @click="updateRecord(scope.row.id,'equip')">Сохранить</el-button>
              </div>
              <el-button slot="reference" size="mini" @click="editIID=scope.row.iid,editName=scope.row.name,editComment=scope.row.comment" >Редактировать</el-button>
            </el-popover>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row, 'equip')">Удалить</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-divider content-position="left">Типы дат проверок</el-divider>
      <el-collapse >
        <el-collapse-item title="Создать тип даты проверки" name="1">

          <el-form :inline="true" :model="newDateForm" >
            <el-form-item >
              <el-input v-model="newDateForm.name" placeholder="Название даты"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="danger" @click="createDate">Создать дату</el-button>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
      <el-table
        :data="test_date_types.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
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

          <template slot-scope="scope">
            <el-popover
              ref="editPopover"
              placement="top"
              width="400"
              trigger="click">
              <div style="display: flex" class="">
                <el-input v-model="editName" :placeholder="scope.row.name"></el-input>
                <el-button type="primary" @click="updateRecord(scope.row.id,'date')">Сохранить</el-button>
              </div>
              <el-button slot="reference" size="mini" >Редактировать</el-button>
            </el-popover>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row, 'date')">Удалить</el-button>
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
        const  response_equips= await $axios.get(`/api/v1/equips/`)
        const  response_test_date_types= await $axios.get(`/api/v1/equip_test_date_types/`)

        const equipment = response_equips.data
        const test_date_types = response_test_date_types.data

        return {equipment,test_date_types}
      }catch (e) {
        throw e
      }
    },
    data() {
      return {
        editIID:null,
        editName:null,
        editComment:null,

        newEquipForm:{
          name:null,
          iid:null,
          comment:null
        },
        newDateForm:{
          name:null,
        },
        search: '',
      }

    },
    methods: {
      closePopover(){
        document.querySelector(".test").click()
      },

      async getEquipment(){
        const  response_equipment= await this.$axios.get(`/api/v1/equips/`)
        this.equipment = response_equipment.data
      },
      async getDate(){
        const  response_test_date_types= await this.$axios.get(`/api/v1/equip_test_date_types/`)
        this.test_date_types = response_test_date_types.data
      },
      async createEquipment(){
        const response = await this.$axios.post('/api/v1/equip/create/',this.newEquipForm)
        this.getEquipment()
      },
      async createDate(){
        const response = await this.$axios.post('/api/v1/equip_test_date_type/create/',this.newDateForm)
        this.getDate()
      },

      async updateRecord(id,type,status){

        if (type === 'equip'){
          await this.$axios.put(`/api/v1/equip/edit/${id}`,
            {
              'name':this.editName,
              'iid':this.editIID,
              'comment':this.editComment
            })
          this.getEquipment()
          this.editName = null
          this.editName = null
          this.editComment = null
        }
        if (type === 'date'){
          await this.$axios.put(`/api/v1/equip_test_date_type/edit/${id}`,{ 'name':this.editName})
          this.getDate()
          this.editName = null
        }

        document.querySelector(".test").click()
      },

      async handleDelete(index, row,type) {

        if (type === 'equip'){
          await this.$axios.delete(`/api/v1/equip/delete/${row.id}`)
          this.getEquipment()
        }
        if (type === 'date'){
          await this.$axios.delete(`/api/v1/equip_test_date_type/delete/${row.id}`)
          this.getDate()
        }

      }


    }
  };
</script>


