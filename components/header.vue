<template>
 <header>
    <Button label="Submit" />
   <Button label="Submit" icon="pi pi-check" iconPos="right" />
  <DataTable :value="data">
    <Column field="id" header="Code"></Column>
    <Column field="name" header="Name"></Column>
    <Column field="company" header="Category"></Column>
    <Column field="date" header="Quantity"></Column>
</DataTable>


 </header>
</template>

<script>
  export default {

    data() {
      return {
        "data": [
        {
            "id": 1000,
            "name": "James Butt",
            "country": {
                "name": "Montserrat",
                "code": "ms"
            },
            "company": "Benton, John B Jr",
            "date": "2018-08-13",
            "status": "negotiation",
            "activity": 96,
            "representative": {
                "name": "Ioni Bowcher",
                "image": "ionibowcher.png"
            }
        }
        ]


      };
    },

    watch: {

    },
    mounted() {

    },
    methods: {


    }
  }
</script>


