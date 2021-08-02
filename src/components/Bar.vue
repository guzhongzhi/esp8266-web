<template>
  <div class="bar">
    <div  style="height: 40px;text-align: left; line-height: 40px; font-weight: bold;font-size: 14px;color:#FFF;background: #000000;padding-right:10px;">
      <span style="float: left;margin-right:6px; margin-left:4px;">
        <Icon :type="icon" />
      </span>
      <span style="float: left;">
        {{title}}
      </span>
      <span style="float: right" v-if="closable">
            <Button type="warning" size="small" @click="back2">X</Button>
      </span>
    </div>
  </div>
</template>
<style>
  .bar {
    position: fixed;
    width: 100%;
    top:0px;
    z-index: 1000;
  }
</style>
<script>
  import Cell from "../../node_modules/view-design/src/components/cell/cell.vue";

  export default {
    components: {Cell},
    name: 'Bar',
    props:{
      icon:{
        type:String,
        default:"md-arrow-round-back",
      },
      closable:{
        type:Boolean,
        default:true,
      },
      title:{
        type:String,
        default:"Bar",
      },
      close:{
        type:Function,
        default:()=>{
          return ()=>{

          }
        }
      },
      back: {
        type:Function,
        default:()=>{
          return ()=>{}
        }
      }
    },
    data () {
      return {
      }
    },
    methods:{
      back2() {
        let prev = window.pageHistory[window.pageHistory.length-1];
        console.log(prev);
        if(prev == null) {
          this.$router.push("/");
          window.pageHistory = [];
          return
        }
        this.$router.push(
          prev
        );
      }
    }
  }
</script>
