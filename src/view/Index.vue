<template>
  <div class="hello">
    <bar title="应用管理" :closable="false" icon="md-settings"></bar>
    <Table style="margin-top: 42px;" :columns="columns1" :data="data1"></Table>

    <div style="padding:10px;">
    <Button @click="goToNotifications" type="error">
      消息通知</Button>
    </div>
  </div>
</template>

<script>
  import Bar from "../components/Bar.vue";

  export default {
    components: {Bar},
    data () {
      return {
        columns1: [
          {
            title: '应用名',
            key: 'name'
          },
          {
            title: '创建时间',
            key: 'age'
          },
          {
            title: '设备数量',
            key: 'address'
          },
          {
            title: 'Action',
            key: 'action',
            width: 120,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  on:{
                    click: ()=>{
                      console.log(this.$route);
                      this.$router.push({
                        name:"users",
                        query:{
                          //app:params.row.age,
                          app:"guz",
                        }
                      })
                    }
                  }
                }, 'View'),
              ]);
            }
          }
        ],
        data1: [
          {
            name: 'John Brown',
            age: 18,
            address: 'New York No. 1 Lake Park',
            date: '2016-10-03'
          },
        ]
      }
    },
    methods:{
      goToNotifications() {
        this.$router.push("notifications");
      }
    }
  }
</script>
