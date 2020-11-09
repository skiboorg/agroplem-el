<template>
  <el-main>
    <div class="container">
      <el-form :inline="true" :model="newForm" >
        <el-form-item >
          <el-input v-model="newForm.serial_number" placeholder="Номер серии"></el-input>
        </el-form-item>
        <el-form-item >
          <el-select v-model="newForm.type"  placeholder="Выберите тип">
            <el-option
              v-for="item in sample_types"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="newForm.state"  placeholder="Выберите состояние">
            <el-option
              v-for="item in sample_states"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="newForm.expirement" :multiple="true" placeholder="Выберите испытания">
            <el-option
              v-for="item in sample_expiriments"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="newForm.manufacturer"  placeholder="Выберите производителя" style="width: 220px">
            <el-option
              v-for="item in manufacturers"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            style="width: 175px"
            v-model="newForm.date_get_sample"
            type="date"
            format="yyyy/MM/dd"
            value-format="yyyy-MM-dd"
            placeholder="Дата получения">
          </el-date-picker>

        </el-form-item>

        <el-form-item style="width: 100%">
          <el-input
            style="width: 100%"
            class="dfd"
            type="textarea"
            autosize
            :autosize="{ minRows: 3, maxRows: 10}"
            placeholder="Коментарий"
            v-model="newForm.comment">
          </el-input>
        </el-form-item>
        <el-form-item >
          <el-input v-model="newForm.arrived" placeholder="Поступило"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input v-model="newForm.done" placeholder="Сделано"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input v-model="newForm.too_small" placeholder="В малом объеме"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input v-model="newForm.broken" placeholder="Скисло"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input v-model="newForm.go_bad" placeholder="Непригодные по другой причине"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="createNew">Создать образец</el-button>
        </el-form-item>


      </el-form>
      <el-table
        :data="samples"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <p>Коментарий к образцу: {{ props.row.comment }}</p>
            <p>Поступило: {{ props.row.arrived }}</p>
            <p>Сделано :{{ props.row.done }}</p>
            <p>В малом объеме :{{ props.row.too_small }}</p>
            <p>Скисло :{{ props.row.broken }}</p>
            <p>Непригодные по другой причине :{{ props.row.go_bad }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="ID"
          prop="iid">
        </el-table-column>
        <el-table-column
          label="Номер серии"
          prop="serial_number">
        </el-table-column>
        <el-table-column
          label="Дата получения">
          <template slot-scope="scope">
            <p>{{new Date(scope.row.date_get_sample).toLocaleDateString()}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Дата закрытия">
          <template slot-scope="scope">

            <p v-if="!scope.row.status">{{new Date(scope.row.date_close_sample).toLocaleDateString()}}</p>
            <p v-else>-</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Тип">
          <template slot-scope="scope">
            <p>{{scope.row.type.name}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Состояние">
          <template slot-scope="scope">
            <p>{{scope.row.state.name}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Производитель">
          <template slot-scope="scope">
            <p>{{scope.row.manufacturer.name}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Испытания">
          <template slot-scope="scope">
            <el-tag size="mini" v-for="exp in scope.row.expirement">{{exp.name}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          label="Статус"
          width="150"
          :filters="[{ text: 'Открыт', value: true }, { text: 'Закрыт', value: false }]"
          :filter-method="filterTag"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === true ? 'success' : 'danger'"
              disable-transitions>{{scope.row.status ? 'Открыт' : 'Закрыт'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="right" width="180">
          <template slot-scope="scope">
            <el-popover

              placement="left"
              width="250">
              <el-date-picker
                style="margin-bottom: 10px"
                v-model="newForm.date_close_sample"
                type="date"
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
                placeholder="Дата закрытия">
              </el-date-picker>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="closePopover">Отмена</el-button>
                <el-button type="danger" size="mini" @click="updateRecord(scope.row.id,'sample',false)">Закрыть</el-button>
              </div>
              <el-button style="margin-bottom: 5px" v-if="scope.row.status" icon="el-icon-lock" size="mini" type="danger"  slot="reference"></el-button>
              <el-button v-else style="margin-bottom: 5px" size="mini" icon="el-icon-unlock" type="info" @click="updateRecord(scope.row.id,'sample',true)"  slot="reference"></el-button>
            </el-popover>
            <div class="">
               <el-button  size="mini" type="warning" icon="el-icon-edit" @click="editRow(scope.row)"></el-button>
              <el-button  size="mini" icon="el-icon-camera" @click="getImage(scope.row.id)"></el-button>
              <el-button
              style="margin-bottom: 5px"
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.$index, scope.row, 'sample')"></el-button>

            </div>




          </template>
        </el-table-column>
      </el-table>
      <el-dialog
  title="Редактирование образца"
  :visible.sync="centerDialogVisible"
  width="30%"
  center>
   <el-form :inline="true" :model="editForm" >


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
          <el-input v-model="editForm.arrived" placeholder="Поступило"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input v-model="editForm.done" placeholder="Сделано"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input v-model="editForm.too_small" placeholder="В малом объеме"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input v-model="editForm.broken" placeholder="Скисло"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input v-model="editForm.go_bad" placeholder="Непригодные по другой причине"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="updateRecord(id,'all',true)">Обновить образец</el-button>
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
        const  response_samples= await $axios.get(`/api/v1/samples/`)
        const  response_type= await $axios.get(`/api/v1/sample_types/`)
        const  response_state= await $axios.get(`/api/v1/sample_states/`)
        const  response_expiriments= await $axios.get(`/api/v1/sample_expiriments/`)
        const  response_manufacturers= await $axios.get(`/api/v1/manufacturers/`)
        const manufacturers = response_manufacturers.data
        const sample_expiriments = response_expiriments.data
        const sample_types = response_type.data
        const sample_states = response_state.data
        const samples = response_samples.data
        console.log(samples)
        return {sample_types,sample_states,sample_expiriments,manufacturers,samples}
      }catch (e) {
        throw e
      }
    },
    data() {
      return {
        editInfo:null,
        centerDialogVisible: false,
        id:null,
        newForm:{
          iid:null,
          type:null,
          expirement:null,
          manufacturer:null,
          serial_number:null,
          comment:null,
          date_get_sample:null,
          arrived:null,
          done:null,
          too_small:null,
          broken:null,
          go_bad:null,
        },
          editForm:{
          comment:null,
          arrived:null,
          done:null,
          too_small:null,
          broken:null,
          go_bad:null,
        },
        search: '',
      }

    },
    methods: {
      editRow(row){
        this.centerDialogVisible = true
        this.id = row.id
        console.log(row)
        this.editForm = row

      },
      closePopover(){
        document.querySelector(".test").click()
      },

      async getSamples(){
        const response= await this.$axios.get(`/api/v1/samples/`)
        this.samples = response.data
      },

      async createNew(){
        const response = await this.$axios.post('/api/v1/sample/create/',this.newForm)
        this.getSamples()
      },

      async updateRecord(id,type,status){
        if (type === 'sample'){
          await this.$axios.put(`/api/v1/sample/edit/${id}`,{'status':status,'date_close_sample':this.newForm.date_close_sample})
          this.getSamples()
        }
        if (type === 'all'){
          await this.$axios.put(`/api/v1/sample/edit/${id}`,this.editForm)
          this.getSamples()
          this.centerDialogVisible = false
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

        if (type === 'sample'){
          await this.$axios.delete(`/api/v1/sample/delete/${row.id}`)
          this.getSamples()
        }

      },
      filterTag(value, row) {
        return row.status === value;
      },
      async getImage(id){
        const response = await this.$axios.post(`/api/v1/sample/get_image/`,{id:id})
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


