<template>
  <div class="hello">
    <div>
      <Form ref="formInline"  inline>
        <form-item>
          <Select v-model="searchForm.group" style="width: 200px">
            <Option :value="-1">所有</Option>
            <Option :value="0">新按键</Option>
            <Option v-for="item in groups" :value="item.id" :key="item.name">{{ item.name }}</Option>
          </Select>
        </form-item>
        <FormItem>
          <Button @click="load" type="primary">搜索</Button>
          <Button @click="resetSearchForm" type="warning">重置搜索</Button>
          <Button @click="load" type="success">重新加载数据</Button>
        </FormItem>
      </Form>
    </div>

    <div style="margin-bottom: 10px;"></div>
    <Table border :row-class-name="rowClassName" :columns="columns" :data="buttons"></Table>
    <div style="margin-bottom: 10px;"></div>
    <page show-total :total="page.total" :current.sync="page.current"></page>
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
  import FormItem from "../../../node_modules/view-design/src/components/form/form-item.vue";

  export default {
    components: {
      FormItem,
      Bar,
      Cell},
    name: 'ButtonList',
    data () {
      return {
        page:{
          total:0,
          current:1,
        },
        searchForm:{
          group:-1,
        },
        data:[],
        columns:[
          /*
          {
            title: 'Id',
            key: 'id',
            width:100,
          },
          {
            title: 'Name',
            key: 'name',
            render: (h, params) => {
              let divs = [
                h('div',params.row.id),
                h('div',params.row.nec),
              ];
              if(params.row.createdAt) {
                let date1 = new Date(params.row.createdAt * 1000);
                divs.push(h("div",date1.toLocaleDateString().replace(/\//g, "-") + " "+ date1.toTimeString().substr(0, 8)))
              }
              return h('div', divs);
            }
          },*/
          {
            title: 'id/time/name/code/group',
            key: 'code',
            render: (h, params) => {


              let divs = [
                h('div',params.row.id),
                h('div',params.row.nec),
              ];
              if(params.row.createdAt) {
                let date1 = new Date(params.row.createdAt * 1000);
                divs.push(h("div",date1.toLocaleDateString().replace(/\//g, "-") + " "+ date1.toTimeString().substr(0, 8)))
              }

              let divs2 = [
                h('Input', {
                  props: {
                    placeholder:"按键名",
                    value:params.row.name,
                  },
                  on: {
                    input:(v)=>{
                      this.buttons[params.index].name = v;
                    },
                  }
                }),
                h('Input', {
                  props: {
                    placeholder:"按键code",
                    value:params.row.code,
                  },
                  on: {
                    input:(v)=>{
                      this.buttons[params.index].code = v;
                    },
                  }
                }),
                h('div', [
                  h('Select', {
                      props: {
                        placeholder:"遥控板",
                        value:params.row.groupID,
                      },
                      on: {
                        input:(v)=>{
                          this.buttons[params.index].groupID = v;
                        },
                      },
                    },
                    this.groups.map((g)=>{
                      return h("Option",{
                        props:{
                          value:g.id,
                          label:g.name+"("+g.id+")",
                        }
                      });
                    }),
                  ),
                ])
              ];
              return h('div', divs.concat(divs2));
            }
          },
          /*
          {
            title: 'nec',
            key: 'nec',
          },
          {
            title: 'repeatCommandNeeded',
            key: 'repeatCommandNeeded',
            width:150,

            render:(h,params)=>{
              return h('div', [
                h('Select', {
                    props: {
                      placeholder:"是否要重复命令",
                      value:params.row.repeatCommandNeeded,
                    },
                    on: {
                      input:(v)=>{
                        this.buttons[params.index].repeatCommandNeeded = v;
                      },
                    },
                  },
                  [{label:"是",value:true},{label:"否",value:false}].map(g=>{
                    return h("Option",{
                      props:{
                        value:g.value,
                        label:g.label,
                      }
                    });
                  }),
                ),
              ]);
            }
          },
          {
            title: 'data',
            key: 'data',
            render:(h,params)=>{
              let t = params.row.data.split(",");
              if(t.length <= 5) {
                return h("div","");
              }
              t.splice(6);
              return h("div",t.join(",")+"....")
            }
          },
          {
            title: 'group',
            key: 'group',
            render:(h,params)=>{
              return h('div', [
                h('Select', {
                  props: {
                    placeholder:"遥控板",
                    value:params.row.groupID,
                  },
                  on: {
                    input:(v)=>{
                      this.buttons[params.index].groupID = v;
                    },
                  },
                },
                  this.groups.map((g)=>{
                    return h("Option",{
                      props:{
                        value:g.id,
                        label:g.name,
                      }
                    });
                  }),
                ),
              ]);
            }
          },/*
          {
            title: '添加时间',
            key: 'created_at',
            render:(h,params)=>{
              if(!params.row.createdAt) {
                return h("div","")
              }
              let date1 = new Date(params.row.createdAt * 1000);
              return h("div",date1.toLocaleDateString().replace(/\//g, "-") + " "+ date1.toTimeString().substr(0, 8));
            },
          },*/
          {
            title: 'Action',
            key: 'action',
            align: 'center',
            width:100,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      console.log(this.buttons[params.index]);
                      this.$http.post("/api/app/guz/button/save",this.buttons[params.index]).then(res=>{
                        console.log(res);
                      })
                    },
                  }
                }, '保存'),
                h("div"," - "),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small',
                  },
                  on: {
                    click: () => {
                      console.log(this.buttons[params.index]);
                      this.$http.post("/api/app/guz/button/delete",this.buttons[params.index]).then(res=>{
                        console.log(res);
                        this.load();
                      })
                    },
                  }
                }, '删除'),
              ]);
            }
          }
        ],
        buttons:[],
        groups:[],
      }
    },
    mounted() {
      this.loadGroups();
      this.load();
    },
    watch:{
      "page.current":{
        handler:function(n,o) {
          this.goToPage(n);
        }
      }
    },
    methods:{
      rowClassName (row, index) {
        let className = 'table-row';
        if (index % 2 ==0) {
          className += " table-row-hightlight"
        }
        return className
      },
      resetSearchForm() {
        this.searchForm.group = -1;
        this.load();
      },
      loadGroups() {
        this.$http.get("/api/app/guz/button/groups").then(res=>{
          Object.values(res.data).map((v)=>{
            this.groups.push(v);
          })
        })
      },
      load() {
        this.data.splice(0);
        this.page.current=0;
        this.buttons.splice(0);
        this.$http.get("/api/app/guz/buttons").then(res=>{
          Object.values(res.data).reverse().map((v)=>{
            if(v.repeatCommandNeeded == undefined) {
              v.repeatCommandNeeded = false;
            }
            if(this.searchForm.group < 0) {
              this.data.push(v);
            } else if(this.searchForm.group == v.groupID) {
              this.data.push(v);
            }
            this.goToPage(1);
          })
        })
      },
      goToPage(page) {
        this.buttons.splice(0);
        let pageSize = 10;
        let totalPage = parseInt(this.data.length  / pageSize);
        if(totalPage * pageSize < this.data.length) {
          totalPage++;
        }
        if(page <= 0) {
          page = 1;
        }
        if(page > totalPage) {
          page = totalPage;
        }
        let offset = (page - 1) * pageSize;
        for(var i=0;i<pageSize;i++) {
          if(!this.data[i+offset]) {
            break;
          }
          this.buttons.push(this.data[i+offset]);
        }
        this.page.total = this.data.length;
        this.page.current = page;
      }
    }
  }
</script>
