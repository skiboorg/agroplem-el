<template>
  <el-main>
    <div class="container">

      <el-form :inline="true" :model="newForm" >
        <div class="">
          <el-form-item >
          <el-input v-model="newForm.name" placeholder="Название"></el-input>
        </el-form-item>
          <el-form-item >
            <el-input v-model="newForm.subject" placeholder="На что"></el-input>
          </el-form-item>
          <el-form-item >
            <el-input v-model="newForm.weight" placeholder="Вес"></el-input>
          </el-form-item>
          <el-form-item >
            <el-input v-model="newForm.iso" placeholder="Стандарт"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="danger" @click="createNew">Создать испытание</el-button>
          </el-form-item></div>
        <div class="">
          <el-form-item v-for="(field, index) in newForm.field":key="field.key" >
          <el-input v-model="field.value"></el-input><el-button @click.prevent="removeField(field)">Удалить</el-button>
        </el-form-item>
        <el-button @click="addField">Добавить поле</el-button>
        </div>
      </el-form>
      <el-table
        :data="sample_expiriments.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <p>Поля</p><br>
            <p v-for="field in props.row.field">
              {{field.name}}
            </p>

          </template>
        </el-table-column>
        <el-table-column
          label="Название"
          prop="name">
        </el-table-column>
        <el-table-column
          label="На что"
          prop="subject">
        </el-table-column>
        <el-table-column
          label="Вес"
          prop="weight">
        </el-table-column>
        <el-table-column
          label="Стандарт"
          prop="iso">
        </el-table-column>
        <el-table-column
          align="right">
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="search"
              size="mini"
              placeholder="Поиск испытания"/>
          </template>
          <template slot-scope="scope">
            <el-popover
              ref="editPopover"
              placement="top"
              width="400"
              trigger="click">
              <div style="display: flex" class="">
                <el-input v-model="editInfo" :placeholder="scope.row.name"></el-input>
                <el-button type="primary" @click="updateRecord(scope.row.id,'exp')">Сохранить</el-button>
              </div>
              <el-button slot="reference" size="mini" >Редактировать</el-button>
            </el-popover>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row, 'exp')">Удалить</el-button>
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
        const  response= await $axios.get(`/api/v1/sample_expiriments/`)
        const sample_expiriments = response.data
        return {sample_expiriments}
      }catch (e) {
        throw e
      }
    },
    data() {
      return {
        editInfo:null,
        newForm:{
          name:null,
          subject:null,
          weight:null,
          iso:null,
          field:[

          ],
        },
        search: '',
      }

    },
    methods: {
      addField() {
        this.newForm.field.push({
          key: Date.now(),
          value: ''
        });
      },
      removeField(item) {
        var index = this.newForm.field.indexOf(item);
        if (index !== -1) {
          this.newForm.field.splice(index, 1);
        }
      },
      closePopover(){
        document.querySelector(".test").click()
      },

      async getSampleExp(){
        const response= await this.$axios.get(`/api/v1/sample_expiriments/`)
        this.sample_expiriments = response.data
      },

      async createNew(){
        const response = await this.$axios.post('/api/v1/sample_expiriment/create/',this.newForm)
        this.getSampleExp()
      },

      async updateRecord(id,type,status){
        if (type === 'exp'){
          await this.$axios.put(`/api/v1/sample_expiriment/edit/${id}`,{'name':this.editInfo})
          this.getSampleExp()
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

        if (type === 'exp'){
          await this.$axios.delete(`/api/v1/sample_expiriment/delete/${row.id}`)
          this.getSampleExp()
        }

      }


    }
  };
</script>


