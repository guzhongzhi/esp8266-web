<template>
  <div class="hello">

    <Form ref="formInline" :model="formData" :rules="ruleInline" inline>
      <FormItem prop="user">
        <Input type="text" v-model="formData.name" placeholder="遥控板名">
          <Icon type="ios-person-outline" slot="prepend"/>
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formInline')">保存遥控板</Button>
        <Button @click="load" type="warning">重新加载数据</Button>
      </FormItem>
    </Form>

    <Table :row-class-name="rowClassName" border :columns="columns" :data="groups"></Table>

    <div style="margin-bottom: 10px;"></div>
  </div>
</template>

<style>
.table-row-hightlight {

}
.table-row td {
  padding: 4px 0px;
}
</style>
<script>
  import Cell from "../../../node_modules/view-design/src/components/cell/cell.vue";
  import Bar from "../../components/Bar.vue";

  export default {
    components: {
      Bar,
      Cell},
    name: 'ButtonGroups',
    data () {
      return {
        columns:[
          {
            title: 'Name',
            key: 'name',
            render: (h, params) => {
              return h('div', [
                h('div',params.row.id),
                h('div',params.row.created_at),
                h('Input', {
                  props: {
                    placeholder:"遥控板名",
                    value:params.row.name,
                  },
                  on: {
                    input:(v)=>{
                      this.groups[params.index].name = v;
                    },
                  }
                })
              ]);
            }
          },
          {
            title: 'Action',
            key: 'action',
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h("div",[
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                    },
                    on: {
                      click: () => {
                        this.$http.post("/api/app/guz/button/group-save",{
                          id:this.groups[params.index].id,
                          name:this.groups[params.index].name,
                        }).then(res=>{
                          console.log(res);
                          this.load();
                        })
                      },
                    }
                  }, '保存')
                ]),
                h('div','-'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$http.post("/api/app/guz/button/group-delete",{
                        id:this.groups[params.index].id,
                        name:this.groups[params.index].name,
                      }).then(res=>{
                        console.log(res);
                        this.load();
                      })
                    }
                  }
                }, '删除')

              ]);
            }
          }
        ],
        groups:[],
        formData: {
          name: '',
          id:"",
        },
        searchFormData:{

        },
        ruleInline: {
          name: [
            { required: true, message: '遥控板名不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    mounted() {
      this.load();
    },
    methods:{
      rowClassName (row, index) {
        let className = 'table-row';
        if (index % 2 ==0) {
          className += " table-row-hightlight"
        }
        return className
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post("/api/app/guz/button/group-save",this.formData).then(res=>{
              console.log(res);
              this.load();
            })
          } else {
            this.$Message.error('验证失败!');
          }
        })
      },
      load() {
        this.groups.splice(0);
        this.$http.get("/api/app/guz/button/groups").then(res=>{
          Object.values(res.data).map((v)=>{
            this.groups.push(v);
          })
        })
      }
    }
  }
</script>
