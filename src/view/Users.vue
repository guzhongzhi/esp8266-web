<template>
  <div class="hello">
    <bar title="当前应用: Guz"></bar>
    <div style="margin-top:40px;padding:6px;">
      <div>
        <Tabs :value.sync="tab">
          <TabPane label="用户管理" name="users">
            <user-list></user-list>
          </TabPane>
          <TabPane label="按键管理" name="buttons">
            <button-list></button-list>
          </TabPane>
          <TabPane label="遥控板管理" name="groups">
            <button-groups></button-groups>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import Cell from "../../node_modules/view-design/src/components/cell/cell.vue";
  import Bar from "../components/Bar.vue";
  import UserList from "./app/UserList.vue";
  import ButtonList from "./app/ButtonList.vue";
  import ButtonGroups from "./app/ButtonGroups.vue";

  export default {
    components: {
      ButtonGroups,
      ButtonList,
      Bar,
      UserList,
      Cell},
    name: 'Users',
    data () {
      return {
        tab:"users",
      }
    },
    mounted() {
    },
    methods:{
    }
  }
</script>
