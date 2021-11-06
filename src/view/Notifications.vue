<template>
  <div style="width:100%;padding:10px">
    <div style="text-align: left">
      <Button @click="addNotification" type="success">添加通知</Button>
    </div>
    <Form :label-width="80">
    <Tabs value="name1"  v-for="(notify,notifyIndex) in notifications">
      <TabPane label="基础信息配置" name="name1">
        <FormItem label="ID">
          <input v-model="notify.id"></input>
        </FormItem>
        <FormItem label="MAC">
          <input v-model="notify.mac"></input>
        </FormItem>
        <FormItem label="Type">
          <Select v-model="notify.type" style="width:200px" multiple >
            <Option v-for="item in typeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="Status">
          <input v-model="notify.status"></input>
        </FormItem>
      </TabPane>
      <TabPane label="条件配置" name="name2">
        <FormItem label="CMD">
          <input v-model="notify.configuration.cmd"></input>
        </FormItem>
        <FormItem label="Value">
          <input v-model="notify.configuration.value"></input>
        </FormItem>
        <FormItem label="Operation">
          <input v-model="notify.configuration.operation"></input>
        </FormItem>
        <FormItem label="rowNumber">
          <input v-model="notify.configuration.rowNumber"></input>
        </FormItem>
      </TabPane>
      <TabPane label="HTTP配置" name="name3" v-if="notify.type.indexOf('http') != -1">
        <FormItem label="URL">
          <input v-model="notify.configuration.url"></input>
        </FormItem>
        <FormItem label="Content Type">
          <input v-model="notify.http.contentType"></input>
        </FormItem>
        <FormItem label="Body">
          <input v-model="notify.http.body"></input>
        </FormItem>
        <FormItem label="method">
          <input v-model="notify.http.method"></input>
        </FormItem>
      </TabPane>
      <TabPane label="Email配置" name="name4" v-if="notify.type.indexOf('email') != -1">
        <FormItem label="subject">
          <input v-model="notify.email.subject"></input>
        </FormItem>
        <FormItem label="body">
          <input v-model="notify.email.body"></input>
        </FormItem>
        <FormItem label="receivers">
          <div v-for="(re,reIdx) in notify.email.receivers"
               :key="notifyIndex+'-email-'+reIdx"
               style="padding:10px 0px;">
            <input v-model="notify.email.receivers[reIdx]"></input>
          </div>
          <Button @click="addReceiver(notifyIndex)">添加收件人</Button>
        </FormItem>
      </TabPane>
    </Tabs>
    </Form>
    <Button @click="saveNotifications" type="warning">保存配置</Button>
  </div>
</template>

<script>
export default {
  name: "Notifications",
  data() {
    let defaultNotification = {
      id:"x",
      mac:"",
      type:[],
      status:"",
      configuration:{
        cmd:"",
        value:0,
        operation:"",
        rowNumber:0,
      },
      http:{
        url:"",
        contentType:"",
        body:"",
        method:"POST"
      },
      email:{
        receivers:[],
        body:"",
        subject:""
      },
    }
    return {
      typeOptions:[{
          label:"HTTP",
          value:"http",
        },
        {
          label:"Email",
          value:"email"
        },
      ],
      defaultNotification:defaultNotification,
      notifications:[
        JSON.parse(JSON.stringify(defaultNotification)),
      ],
    }
  },
  mounted() {
    this.$http.post("/api/app/guz/get-notifications", {}).then(res => {
      console.log(res,resolve);
      if(resolve) {
        resolve(res);
      }
      this.notifications.splice(0,1000)
      console.log(res);
    });
  },
  methods:{
    saveNotifications() {
      console.log("saveNotifications");
    },
    addReceiver(idx) {
      this.notifications[idx].email.receivers.push("eee")
      console.log(this.notifications[idx]);
    },
    addNotification() {
      this.notifications.push(JSON.parse(JSON.stringify(this.defaultNotification)))
    }
  }
}
</script>

<style scoped>

</style>
