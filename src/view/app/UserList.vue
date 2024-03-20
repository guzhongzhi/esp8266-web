<template>
  <div class="hello">
    <template v-for="user in users">
      <List :header="user.m" footer="" border>
        <ListItem>客户端名: &nbsp;
          <Input v-model="user.title" placeholder="客户端名" style="width: 300px"/>
        </ListItem>
        <ListItem>ID: &nbsp;{{user.id}}</ListItem>
        <ListItem>WIFI: &nbsp;{{user.w}}</ListItem>
        <ListItem>IP: &nbsp;{{user.i}}</ListItem>
        <ListItem>最后更新: {{user.updatedAt}}</ListItem>
        <ListItem>固件版本: {{user.v}}</ListItem>
        <ListItem>
          <div style="display: block;width: 100%">
            <div style="padding:10px 0px;text-align: left">
              Second: 秒 Minute: 分 Hour: 时 Dom: 日 Month: 月 Dow: 周
            </div>
            <div v-if="user.crons && Array.isArray(user.crons)">
              <div v-for="cron in user.crons" style="width: 100%">
                <table style="width: 100%;text-align: left">
                  <tr>
                    <td width="300"><Input v-model="cron.cron"/></td>
                    <td>
                      <Select v-model="cron.plugin">
                        <Option v-for="item in user.plugins" :value="item.title" :key="item.title">{{ item.title }}</Option>
                      </Select>
                    </td>
                    <td>
                      <Select v-model="cron.status" >
                        <Option v-for="item in statusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div style="padding:10px 0px">
              <Button type="success" @click="()=>{addCron(user)}">添加定时任务</Button>
            </div>

          </div>
        </ListItem>
        <ListItem  style="text-align: left; display: inline">
          <Collapse>
            <Panel>
              升级
              <div slot="content">
                下载地址：<Input v-model="user.binUrl"></Input>
                <div style="padding:10px 0px;">
                <Button type="error" @click="sendUpgradeMessage(user)" :loading="upgradeLoading[user.m]">升级</Button>
                </div>
              </div>
            </Panel>
            <Panel v-for="(plugin,pluginIdx) in user.plugins" :key="pluginIdx" style="width: 100%">
              {{plugin.title}}
              <div  slot="content" v-if="plugin.initialCommands">
                <div v-if="plugin.initialCommands">
                  <div>设备初始化命令: </div>
                  <div v-for="(cmd,initCmdIdx) in plugin.initialCommands">
                    <Command :cmd="cmd" :user="user" :parent-device="parentDevice"
                             :stepper-btn-loading="stepperBtnLoading" :stepper-btn-rev-loading="stepperBtnRevLoading"></Command>
                    <div style="padding: 10px 0px;">
                      <Button @click="deleteInitCmd(initCmdIdx,plugin.initialCommands)" type="error">删除初始命令</Button>
                    </div>
                  </div>
                </div>

                <div style="height:20px;border-bottom: solid 1px #e1e1e1;margin-bottom: 20px;"> </div>
                <div v-if="plugin.commands">
                    <div v-for="cmd in plugin.commands">
                      <Command :cmd="cmd" :user="user" :parent-device="parentDevice"
                               :stepper-btn-loading="stepperBtnLoading" :stepper-btn-rev-loading="stepperBtnRevLoading"></Command>
                      <div style="padding:10px 0px;">
                        <Button type="success" @click="addToInitialCommands(cmd,plugin)">添加到初始命令</Button>
                      </div>
                  </div>
                </div>
              </div>
            </Panel>
          </Collapse>
        </ListItem>

        <ListItem>
          <div style="padding:6px 0px;">
            <Button type="success" @click="saveUser(user)">保存用户</Button>
          </div>
        </ListItem>
      </List>
      <div style="margin-bottom: 10px;"></div>
      <Drawer :title="drawer.title" :closable="true" v-model="drawer.visible" style="width:90%">
        <div style="clear:both">
          <template v-for="(btn,btnIndex) in drawer.buttons">
              <span style="float: left;margin-right:10px;display: block;mini-width:25%;padding:4px;margin-bottom:10px;">
                <Button :type="btnIndex % 2 == 0 ? 'success': 'warning'" :loading="btn.loading"
                        @click="sendUserIrMessage(drawer.user.m,btn)">{{btn.name}}</Button>
              </span>
          </template>
        </div>
      </Drawer>
    </template>
  </div>
</template>

<script>
  import Cell from "../../../node_modules/view-design/src/components/cell/cell.vue";
  import Bar from "../../components/Bar.vue";
  import ISwitch from "../../../node_modules/view-design/src/components/switch/switch.vue";
  import Command from "../../components/Command";

  export default {
    components: {
      Command,
      ISwitch,
      Bar,
      Cell
    },
    name: 'UserList',
    data() {
      self = this;
      return {
        statusOptions:[
          {label:"启用",value:1},
          {label:"禁用",value:0},
        ],
        upgradeLoading:{},
        stepperBtnLoading:false,
        stepperBtnRevLoading:false,
        parentDevice:self,
        defaultPlugin: {
          title: "",
          commands: [
            {
              c: "",
              stepper: "",
              pinReaderWriter: {
                p: 0,
                v: 0,
                t: 0,
                tv: 0,
                le:false,
                lpi:10000,
                data: null,
              }
            }
          ],
        },
        users: [],
        groups: [],
        value1: false,
        drawer: {
          cmd:null,
          visible: false,
          title: "",
          buttons: [],
          user: {},
        }
      }
    },
    mounted() {
      this.load();
      this.loadGroups();
      this.ws();
    },
    methods: {
      addCron(user) {
        if(!user.crons) {
          user.crons = [];
        }
        user.crons.push({
          cron:"",
          status:1,
        })
      },
      addToInitialCommands(cmd,plugin) {
        console.log(plugin);
        plugin.initialCommands.push(JSON.parse(JSON.stringify(cmd)));
      },
      deleteInitCmd(idx,cmds) {
          cmds.splice(idx,1);
      },
      sendUpgradeMessage(user) {
        let url = user.binUrl;
        if(!url) {
          alert("请输入下载地址");
          return;
        }
        console.log(user)
        this.$set(this.upgradeLoading,user.m,true);
        this.sendUserCommand(user.m, {
          c:"upg",
          upg:{
            url:url,
          }
        }).then(()=>{
          this.$set(this.upgradeLoading,user.m,false);
        })
      },
      setIRReader(mac,cmd) {
        cmd.loading = true;
        this.sendUserCommand(mac,cmd).then(()=>{
          cmd.loading = false;
        });
      },
      readTemperature(mac,cmd) {
        cmd.loading = true;
        this.sendUserCommand(mac,cmd).then(()=>{
          cmd.loading = false;
        });
      },
      setAnalog(mac,cmd) {
        cmd.loading = true;
        this.sendUserCommand(mac,cmd).then(()=>{
          cmd.loading = false;
        });
      },
      readAnalog(mac,cmd) {
        cmd.loading = true;
        this.sendUserCommand(mac,cmd).then(()=>{
          cmd.loading = false;
        });
      },
      readPinDigital(mac,cmd) {
        cmd.loading = true;
        this.sendUserCommand(mac,cmd).then(()=>{
          cmd.loading = false;
        });
      },

      sendStepper(mac,cmd,r=false) {

        if(r) {
          cmd = JSON.parse(JSON.stringify(cmd));
          cmd.stepper.st = cmd.stepper.st * -1;
          this.stepperBtnRevLoading = true;
        } else {
          this.stepperBtnLoading = true;
        }
        console.log(JSON.stringify(cmd));

        this.sendUserCommand(mac,cmd).then(rev=>{
          if(r) {
            this.stepperBtnRevLoading = false;
          } else {
            this.stepperBtnLoading = false;
          }
        })
      },
      setPinDigital(mac,cmd,btn) {
        if(cmd.pin.v == 0) {
          cmd.pin.v = 1;
        } else {
          cmd.pin.v = 0;
        }
        cmd.loading = true;
        this.sendUserCommand(mac,cmd).then((r)=>{
          cmd.loading = false;
          console.log(r);
        })
      },
      formatTimestamp(v) {
        return this.$moment(new Date(v * 1000)).format("YYYY年MM月DD日 HH时mm分ss秒");
      },
      ws() {
        let self = this;

        function onMessage(msg) {
          let data = JSON.parse(msg.data)
          console.log(data);
          Object.values(data).map(m => {
            let hasUser = false;
            self.users.map((u) => {
              if (u.m == m.m) {
                hasUser = true
                u.updatedAt = m.updatedAt;
              }
            });
            if (!hasUser) {
              self.pushUser(m);
            }
          })
        }

        let url = "ws://" + location.host + "/ws?app=guz";
        if (location.href.indexOf("https:") != -1) {
          url = url.replace("ws://", "wss://");
        }
        let websocket = new WebSocket(url);
        websocket.onopen = function (evt) {
          websocket.send("users");
        };
        websocket.onclose = function (evt) {

        };
        websocket.onmessage = function (evt) {
          onMessage(evt)
        };
        websocket.onerror = function (evt) {

        };
      },
      sendUserCommand(mac, cmd,btnID=null) {
        return new Promise( (resolve)=>{
          let data = {
            mac: mac,
            cmd: cmd,
            btnID: btnID,
          };
          console.log(data);
          this.$http.post("/api/app/guz/send-message", data).then(res => {
            console.log(res,resolve);
            if(resolve) {
              resolve(res);
            }
          });
        })
      },
      sendUserIrMessage(mac, btn) {
        console.log("cmd", this.drawer.cmd,btn);
        btn.loading = true;
        if(!Array.isArray(btn.data)) {
          btn.data = btn.data.replace("{","[").replace("}","]");
          if(btn.data.indexOf("[") == -1) {
            btn.data = btn.data.split(",");
          }else{
            btn.data = JSON.parse(btn.data);
          }
        }
        let data = btn.data.map((v)=>{
          return parseInt(v);
        })
        this.sendUserCommand(mac, {
          c: "irs",
          pin:{
            p:this.drawer.cmd.pin.p,
            d: data,
          },
        },btn.id).then(r=>{
          btn.loading = false;
        });
      },
      loadGroupButtons(gId) {
        this.$http.post("/api/app/guz/button/group-buttons", {
          id: gId,
        }).then(res => {
          res.data.map(i => {
            i.loading = false;
            this.drawer.buttons.push(i);
          })
        })
      },
      goToGroupButtons(groupId, user,cmd) {
        this.drawer.user = user;
        this.drawer.buttons.splice(0);
        this.drawer.visible = true;
        this.drawer.title = this.getGroupName(groupId);
        this.drawer.cmd = cmd;
        this.loadGroupButtons(groupId);
      },
      getGroupName(gid) {
        let label = "";
        this.groups.map((g) => {
          if (g.id == gid) {
            label = g.name
          }
        })
        return label
      },
      saveUser(user) {
        this.$http.post("/api/app/guz/user/save", {
          m: user.m,
          acceptIR:user.acceptIR,
          saveIR:user.saveIR,
          copyIRToMac:user.copyIRToMac,
          title: user.title,
          plugins:user.plugins,
          crons: user.crons,
        }).then(res => {
          console.log(res)
        })
      },
      loadGroups() {
        this.$http.get("/api/app/guz/button/groups").then(res => {
          Object.values(res.data).map((v) => {
            this.groups.push(v);
          })
        })
      },
      pushUser(m) {
        let cmdIdx = 1;
        if(!m.plugins) {
          m.plugins = [];
        }
        m.plugins.map((p)=>{
          p.commands.map((cmd)=>{
            console.log(cmd)
            cmdIdx++;
            if(!cmd.id || cmd.loading === undefined) {
              cmd.loading = false;
            }
          })

          p.initialCommands && p.initialCommands.map((cmd)=>{
            cmdIdx++;
            if(!cmd.id || cmd.loading === undefined) {
              cmd.loading = false;
            }
          })
        })
        console.log(m)
        if(m.acceptIR == undefined) {
          m.acceptIR = false;
        }
        this.users.push(m)
      },
      load() {
        this.$http.get("/api/app/guz/users").then(res => {
          Object.values(res.data).map((v) => {
            if (v.groups === null) {
              v.groups = [];
            }

            this.pushUser(v);
          })
        })
      }
    }
  }
</script>
