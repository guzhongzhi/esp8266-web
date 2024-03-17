<template>
  <div style="width:100%;padding:10px">
    <div style="text-align: left">
      <Button @click="addNotification" type="success">添加通知</Button>
    </div>
    <Form :label-width="150">
    <Tabs value="name1" :key="notifyIndex+'-notification'" v-for="(notify,notifyIndex) in notifications">
      <TabPane label="基础信息配置" name="name1">
        <FormItem label="ID">
          <Input v-model="notify.id"></Input>
        </FormItem>
        <FormItem label="MAC">
          <Input v-model="notify.mac"></Input>
        </FormItem>
        <FormItem label="Type">
          <Select v-model="notify.type" style="width:200px" multiple >
            <Option v-for="item in typeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="Status">
          <Input v-model="notify.status"></Input>
        </FormItem>
        <FormItem label="LatestNotifiedAt">
          <Input v-model="notify.latestNotifiedAt"></Input>
        </FormItem>
        <FormItem label="notifiedNumber">
          <Input v-model="notify.notifiedNumber" type="number"></Input>
        </FormItem>
        <FormItem label="notificationSteep">
          <Input v-model="notify.notificationSteep" type="number"></Input>
        </FormItem>
      </TabPane>
      <TabPane label="条件配置" name="name2">
        <FormItem label="CMD">
          <Input v-model="notify.configuration.cmd"></Input>
        </FormItem>
        <FormItem label="Value">
          <Input v-model="notify.configuration.value" type="number"></Input>
        </FormItem>
        <FormItem label="Operation">
          <Input v-model="notify.configuration.operation"></Input>
        </FormItem>
        <FormItem label="rowNumber">
          <Input v-model="notify.configuration.rowNumber"></Input>
        </FormItem>
      </TabPane>
      <TabPane label="HTTP配置" name="name3" v-if="notify.type.indexOf('http') != -1">
        <FormItem label="URL">
          <Input v-model="notify.http.url"></Input>
        </FormItem>
        <FormItem label="Content Type">
          <Input v-model="notify.http.contentType"></Input>
        </FormItem>
        <FormItem label="Body">
          <Input v-model="notify.http.body" type="textarea" :rows="4"></Input>
        </FormItem>
        <FormItem label="method">
          <Input v-model="notify.http.method"></Input>
        </FormItem>
      </TabPane>
      <TabPane label="Email配置" name="name4" v-if="notify.type.indexOf('email') != -1">
        <FormItem label="subject">
          <Input v-model="notify.email.subject"></Input>
        </FormItem>
        <FormItem label="body">
          <Input v-model="notify.email.body" type="textarea" :rows="4"></Input>
        </FormItem>
        <FormItem label="receivers">
          <div v-for="(re,reIdx) in notify.email.receivers"
               :key="notifyIndex+'-email-'+reIdx"
               style="padding:10px 0px;">
            <Input v-model="notify.email.receivers[reIdx]"></Input>
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
      latestNotifiedAt:0,
      notifiedNumber:0,
      notificationSteep:0,
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
      this.notifications.splice(0,1000)
      res.data.map((v)=>{
        if(!v.email) {
          v.email = {
            receivers:[]
          }
        }
        if(!v.email.receivers) {
          v.email.receivers = [];
        }
        this.notifications.push(v)
      })
    });
  },
  methods:{
    saveNotifications() {
      this.notifications.map((n)=>{
        n.notificationSteep = parseInt(n.notificationSteep)
        n.configuration.value = parseInt(n.configuration.value)
      })
      this.$http.post("/api/app/guz/save-notifications", this.notifications).then(res => {
        console.log(res.data);
      });
    },
    addReceiver(idx) {
      console.log(this.notifications[idx]);
      this.notifications[idx].email.receivers.push("")
    },
    addNotification() {
      this.notifications.push(JSON.parse(JSON.stringify(this.defaultNotification)))
    }
  }
}
</script>

<style scoped>

</style>
