<template>
  <div class="hello">
    <template v-for="user in users">
      <List :header="user.m" footer="" border>
        <ListItem>客户端名: &nbsp;
          <Input v-model="user.title" placeholder="客户端名" style="width: 300px"/>
        </ListItem>
        <ListItem>WIFI: &nbsp;{{user.w}}</ListItem>
        <ListItem>最后更新: {{user.updatedAt}}</ListItem>
        <ListItem>固件版本: {{user.v}}</ListItem>
        <ListItem  style="text-align: left; display: inline">
          <Collapse v-for="plugin in user.plugins" style="width: 100%">
            <Panel>
              {{plugin.title}}
              <div  slot="content" v-if="plugin.initialCommands">
                InitCommands:{{plugin.initialCommands}}
                <div v-if="plugin.initialCommands">
                  <div v-for="cmd in plugin.initialCommands">
                    <div>
                      <div v-if="cmd.c=='sd'">
                        <div style="padding:10px 0px">
                          引脚: <input-number v-model="cmd.pin.p"></input-number>
                          值: <input-number v-model="cmd.pin.v"></input-number>
                        </div>
                        <Button :type="cmd.pin.v == 0? 'warning':'error'"
                                :loading="cmd.loading"
                                @click="setPinDigital(user.m,cmd)">{{cmd.pin.v == 0 ? '设置为高电平':'设置为低电平'}}</Button>
                      </div>

                      <div v-if="cmd.c=='sir'">
                        <div style="padding:10px 0px">
                          引脚: <input-number v-model="cmd.pin.p"></input-number>
                        </div>
                        <Button type="warning" @click="setIRReader(user.m,cmd)">设置红外输入</Button>
                      </div>

                      <div v-if="cmd.c=='stepper'">
                        <div style="padding:10px 0px">
                          <div>
                            步长: <input-number v-model="cmd.stepper.v" style="width:100px"></input-number> 转多少步
                          </div>
                          <div>
                            PR: <input-number v-model="cmd.stepper.pr" style="width:100px"></input-number> 转多少步
                          </div>
                          <div style="padding:10px 0px">
                            引脚:
                            <input-number v-model="cmd.stepper.d[0]"></input-number>
                            <input-number v-model="cmd.stepper.d[1]"></input-number>
                            <input-number v-model="cmd.stepper.d[2]"></input-number>
                            <input-number v-model="cmd.stepper.d[3]"></input-number>
                          </div>
                        </div>
                        <Button type="warning" @click="sendStepper(user.m,cmd,false)" :loading="stepperBtnLoading">正转</Button>
                        <Button type="error" @click="sendStepper(user.m,cmd,true)" :loading="stepperBtnRevLoading">反转</Button>
                      </div>

                      <div v-if="cmd.buttonGroups">

                        <div style="padding:10px 0px">
                          引脚: <input-number v-model="cmd.pin.p"></input-number>
                        </div>

                        <div style="padding:10px 0px">
                          红外遥控板:
                          <Select v-model="cmd.buttonGroups" multiple style="width:100%">
                            <Option v-for="item in groups" :value="item.id" :key="item.id + '/' + item.name">{{ item.name }}
                            </Option>
                          </Select>
                        </div>

                        <div style="padding:10px 0px;">
                          <template v-for="item in cmd.buttonGroups">
                            <Button type="info" @click="goToGroupButtons(item,user,cmd)">{{getGruopName(item)}}</Button> &nbsp;
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="plugin.commands">
                  Commands:{{plugin.commands}}
                    <div v-for="cmd in plugin.commands">
                    <div>
                      <div v-if="cmd.c=='sd'">
                        <div style="padding:10px 0px">
                          引脚: <input-number v-model="cmd.pin.p"></input-number>
                          值: <input-number v-model="cmd.pin.v"></input-number>
                          持续时间: <input-number v-model="cmd.pin.t"></input-number>
                          持续时间后值: <input-number v-model="cmd.pin.tv"></input-number>
                        </div>
                        <Button :type="cmd.pin.v == 0? 'warning':'error'"
                                :loading="cmd.loading"
                                @click="setPinDigital(user.m,cmd)">{{cmd.pin.v == 0 ? '设置为高电平':'设置为低电平'}}</Button>
                      </div>

                      <div v-if="cmd.c=='rd'">
                        <div style="padding:10px 0px">
                          引脚: <input-number v-model="cmd.pin.p"></input-number>
                        </div>
                        <Button :type="cmd.pin.v == 0? 'warning':'error'"
                                :loading="cmd.loading"
                                @click="readPinDigital(user.m,cmd)">读取数字信号</Button>
                      </div>

                      <div v-if="cmd.c=='rt'">
                        <div style="padding:10px 0px">
                          引脚: <input-number v-model="cmd.pin.p"></input-number>
                        </div>
                        <Button :type="cmd.pin.v == 0? 'warning':'error'"
                                :loading="cmd.loading"
                                @click="readTemperature(user.m,cmd)">读取温度</Button>
                      </div>

                      <div v-if="cmd.c=='ra'">
                        <div style="padding:10px 0px">
                          引脚: <input-number v-model="cmd.pin.p"></input-number>
                        </div>
                        <Button :type="cmd.pin.v == 0? 'warning':'error'"
                                :loading="cmd.loading"
                                @click="readAnalog(user.m,cmd)">读取模拟信号</Button>
                      </div>

                      <div v-if="cmd.c=='ra0'">
                        <Button :type="cmd.pin.v == 0? 'warning':'error'"
                                :loading="cmd.loading"
                                @click="readAnalog(user.m,cmd)">读取A0模拟信号</Button>
                      </div>
                      <div v-if="cmd.c=='sa'">
                        <div style="padding:10px 0px">
                          引脚: <input-number v-model="cmd.pin.p"></input-number>
                          值: <input-number v-model="cmd.pin.v"></input-number>
                        </div>
                        <Button :type="cmd.pin.v == 0? 'warning':'error'"
                                :loading="cmd.loading"
                                @click="setAnalog(user.m,cmd)">设置模拟信号</Button>
                      </div>

                      <div v-if="cmd.c=='sir'">
                        <div style="padding:10px 0px">
                          引脚: <input-number v-model="cmd.pin.p"></input-number>
                        </div>
                        <Button type="warning" @click="setIRReader(user.m,cmd)">否启用红外输入</Button>
                        <i-switch v-model="user.acceptIR"></i-switch>
                      </div>

                      <div v-if="cmd.c=='stepper'">
                        <div style="padding:10px 0px">
                          <div>
                            步长: <input-number v-model="cmd.stepper.v" style="width:100px"></input-number> 转多少步
                          </div>
                          <div>
                            PR: <input-number v-model="cmd.stepper.pr" style="width:100px"></input-number> 转多少步
                          </div>
                          <div style="padding:10px 0px">
                            引脚:
                            <input-number v-model="cmd.stepper.d[0]"></input-number>
                            <input-number v-model="cmd.stepper.d[1]"></input-number>
                            <input-number v-model="cmd.stepper.d[2]"></input-number>
                            <input-number v-model="cmd.stepper.d[3]"></input-number>
                          </div>
                        </div>
                        <Button type="warning" @click="sendStepper(user.m,cmd,false)" :loading="stepperBtnLoading">正转</Button>
                        <Button type="error" @click="sendStepper(user.m,cmd,true)" :loading="stepperBtnRevLoading">反转</Button>
                      </div>

                      <div v-if="cmd.buttonGroups">

                        <div style="padding:10px 0px">
                          引脚: <input-number v-model="cmd.pin.p"></input-number>
                        </div>

                        <div style="padding:10px 0px">
                          红外遥控板:
                          <Select v-model="cmd.buttonGroups" multiple style="width:100%">
                            <Option v-for="item in groups" :value="item.id" :key="item.id + '/' + item.name">{{ item.name }}
                            </Option>
                          </Select>
                        </div>

                        <div style="padding:10px 0px;">
                          <template v-for="item in cmd.buttonGroups">
                            <span style="padding:10px">
                            <Button type="info" @click="goToGroupButtons(item,user,cmd)">{{getGruopName(item)}}</Button> &nbsp;
                              </span>
                          </template>
                        </div>
                      </div>
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

  export default {
    components: {
      ISwitch,
      Bar,
      Cell
    },
    name: 'UserList',
    data() {
      return {
        stepperBtnLoading:false,
        stepperBtnRevLoading:false,

        defaultPlugin: {
          title: "",
          commands: [
            {
              c: "",
              stepper: "",
              pinReaderWriter: {
                pin: 0,
                value: 0,
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
          console.log("EEEEEE");
          cmd.loading = false;
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
        if ( location.host.indexOf("location") != -1) {
          url = "ws://localhost:9999/ws?app=guz"
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
        console.log("cmd", this.drawer.cmd);
        btn.loading = true;
        let data = btn.data.split(",").map((v)=>{
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
        this.drawer.title = this.getGruopName(groupId);
        this.drawer.cmd = cmd;
        this.loadGroupButtons(groupId);
      },
      getGruopName(gid) {
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
          title: user.title,
          plugins:user.plugins,
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
            cmdIdx++;
            if(!cmd.id) {
              cmd.loading = false;
            }
          })

          p.initialCommands && p.commands.map((cmd)=>{
            cmdIdx++;
            if(!cmd.id) {
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
