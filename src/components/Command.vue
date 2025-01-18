<template>
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
            @click="parentDevice.setPinDigital(user.m,cmd)">{{cmd.pin.v == 1 ? '设置为高电平':'设置为低电平'}}</Button>
  </div>

  <div v-if="cmd.c=='rd'">
    <div style="padding:10px 0px">
      引脚: <input-number v-model="cmd.pin.p"></input-number>
      自动上报<i-switch v-model="cmd.pin.le"></i-switch>
      自动上报时间间隔: <input-number v-model="cmd.pin.lpi"></input-number>
    </div>
    <Button :type="cmd.pin.v == 0? 'warning':'error'"
            :loading="cmd.loading"
            @click="parentDevice.readPinDigital(user.m,cmd)">读取数字信号</Button>
  </div>

  <div v-if="cmd.c=='rt'">
    <div style="padding:10px 0px">
      引脚: <input-number v-model="cmd.pin.p"></input-number>
      自动上报<i-switch v-model="cmd.pin.le"></i-switch>
      自动上报时间间隔: <input-number v-model="cmd.pin.lpi"></input-number>
    </div>
    <Button :type="cmd.pin.v == 0? 'warning':'error'"
            :loading="cmd.loading"
            @click="parentDevice.readTemperature(user.m,cmd)">读取温度</Button>
  </div>

  <div v-if="cmd.c=='ra'">
    <div style="padding:10px 0px">
      引脚: <input-number v-model="cmd.pin.p"></input-number>
      自动上报<i-switch v-model="cmd.pin.le"></i-switch>
      自动上报时间间隔: <input-number v-model="cmd.pin.lpi"></input-number>
    </div>
    <Button :type="cmd.pin.v == 0? 'warning':'error'"
            :loading="cmd.loading"
            @click="parentDevice.readAnalog(user.m,cmd)">读取模拟信号</Button>
  </div>

  <div v-if="cmd.c=='ra0'">
    <div>
      自动上报<i-switch v-model="cmd.pin.le"></i-switch>
      自动上报时间间隔: <input-number v-model="cmd.pin.lpi"></input-number>
    </div>
    <Button :type="cmd.pin.v == 0? 'warning':'error'"
            :loading="cmd.loading"
            @click="parentDevice.readAnalog(user.m,cmd)">读取A0模拟信号</Button>
  </div>

  <div v-if="cmd.c=='sa'">
    <div style="padding:10px 0px">
      引脚: <input-number v-model="cmd.pin.p"></input-number>
      值: <input-number v-model="cmd.pin.v"></input-number>
      持续时间: <input-number v-model="cmd.pin.t"></input-number>
      持续时间后值: <input-number v-model="cmd.pin.tv"></input-number>
    </div>
    <Button :type="cmd.pin.v == 0? 'warning':'error'"
            :loading="cmd.loading"
            @click="parentDevice.setAnalog(user.m,cmd)">设置模拟信号</Button>
  </div>

  <div v-if="cmd.c=='sir'">
    <div style="padding:10px 0px">
      引脚: <input-number v-model="cmd.pin.p"></input-number>
    </div>
    <Button type="warning" @click="parentDevice.setIRReader(user.m,cmd)">否启用红外输入</Button>
    <i-switch v-model="user.acceptIR"></i-switch>
    是否保存接收到的按键:
    <i-switch v-model="user.saveIR"></i-switch>
    <Input v-model="user.copyIRToMac"></Input>
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
    <Button type="warning" @click="parentDevice.sendStepper(user.m,cmd,false)" :loading="stepperBtnLoading">正转</Button>
    <Button type="error" @click="parentDevice.sendStepper(user.m,cmd,true)" :loading="stepperBtnRevLoading">反转</Button>
  </div>

  <div v-if="cmd.buttonGroups">
    <div style="padding:10px 0px">
      引脚: <input-number v-model="cmd.pin.p"></input-number>
    </div>
    <div style="padding:10px 0px">
      红外遥控板:
      <Select v-model="cmd.buttonGroups" multiple style="width:100%">
        <Option v-for="item in parentDevice.groups" :value="item.id" :key="item.id + '/' + item.name">{{ item.name }}
        </Option>
      </Select>
    </div>

    <div style="padding:10px 0px;">
      <template v-for="item in cmd.buttonGroups">
          <span style="padding:10px">
            <Button type="info" @click="parentDevice.goToGroupButtons(item,user,cmd)">{{parentDevice.getGroupName(item)}}</Button> &nbsp;
          </span>
      </template>
    </div>
  </div>
</div>
</template>

<script>

import Cell from "../../node_modules/view-design/src/components/cell/cell.vue";
import ISwitch from "../../node_modules/view-design/src/components/switch/switch.vue";
import Bar from "./Bar";

export default {
  components: {
    ISwitch,
    Cell
  },
  name: "Command",
  props: {
    cmd:{
      type:Object,
    },
    parentDevice:{
      type:Object,
    },
    user:{
      type:Object
    },
    stepperBtnRevLoading:{

    },
    stepperBtnLoading:{

    }

  },
}
</script>

<style scoped>

</style>
