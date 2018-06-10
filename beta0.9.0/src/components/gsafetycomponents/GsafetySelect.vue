<!--
	用于于安卓的顶部的搜索组件，通常用于打开一个新的搜索链接 根据vux POPOP-PICKER改写
-->
<template>
  <div>
    <div id="gsafetySelect">
      <div @click="onClick" class="select-block" :style="styleObj">
        <span>{{selectName}}</span><i class="gs-navigate_next"></i>
      </div>
      <popup v-model="showValue" class="vux-popup-picker" @on-hide="onPopupHide" @on-show="$emit('on-show')">
        <div class="vux-popup-picker-container">
          <div class="vux-popup-picker-header">
            <flexbox>
              <flexbox-item class="vux-popup-picker-header-menu" @click.native="onHide(false)">{{cancelText}}</flexbox-item>
              <flexbox-item class="vux-popup-picker-header-menu vux-popup-picker-header-menu-right" @click.native="onHide(true)">{{confirmText}}</flexbox-item>
            </flexbox>
          </div>
          <picker
            :data="data"
            v-model="tempValue"
            @on-change="onPickerChange"
            :columns="columns"
            :fixed-columns="fixedColumns"
            ref="picker1"></picker>
        </div>
      </popup>
    </div>
  </div>
</template>
<style lang="less">
  @import "../../styles/common.less";
  #gsafetySelect {

    .select-block {
      display: inline-block;
      vertical-align: middle;
      font-size: 16px;
    }

    .select-block span {
      display: inline-block;
      width: 80%;
    }
  }

  .vux-cell-box {
    position: relative;
  }
  .vux-cell-box:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    transform-origin: 0 0;
    transform: scaleY(0.5);
    left: 15px;
  }
  .vux-popup-picker {
    border-top: 1px solid #04BE02;
  }
  .vux-popup-picker-header {
    height: 44px;
    color: @popup-picker-header-text-color;
  }
  .vux-popup-picker-value {
    /* display: inline-block; */
  }
  .vux-popup-picker-header-menu {
    text-align: left;
    padding-left: 15px;
    line-height: 44px;
  }
  .vux-popup-picker-header-menu-right {
    text-align: right;
    padding-right: 15px;
  }

</style>
<script>
  import { Popup, Picker, Flexbox, FlexboxItem } from 'vux'

  const getObject = function (obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  const getName = function (val, data) {
    let name = ''
    if (data.length) {
      const tVal = val[0]
      data.forEach((one) => {
        if (one.length) {
          one.forEach((childVal) => {
            if (childVal.value === tVal) {
              name = childVal.name
            }
          })
        }
      })
    }
    return name
  }


export default {
    name: 'GsafetySelect',
    created() {
      if (typeof this.show !== 'undefined') {
        this.showValue = this.show
      }
    },
    components: {
      Picker,
      Popup,
      Flexbox,
      FlexboxItem
    },
    props: {
      cancelText: {
        type: String,
        default: '取消'
      },
      confirmText: {
        type: String,
        default: '确定'
      },
      data: {
        type: Array,
        default() {
          return []
        }
      },
      placeholder: String,
      columns: {
        type: Number,
        default: 0
      },
      fixedColumns: {
        type: Number,
        default: 0
      },
      value: {
        type: Array,
        default() {
          return []
        }
      },
      showName: Boolean,
      showCell: {
        type: Boolean,
        default: true
      },
      show: Boolean,
      width: {
        type: Number,
        default: 44
      },
      height: {
        type: Number,
        default: 40
      }
    },
    computed: {
      styleObj() {
        return {
          width: `${this.width}px`,
          height: `${this.height}px`,
          lineHeight: `${this.height}px`
        }
      }
    },
    methods: {
      getNameValues() {
        return getName(this.currentValue, this.data)
      },
      onClick() {
        if (this.onShowProcess) {
          console.log(this.onShowProcess)
        } else {
          this.showValue = true
          this.onShowProcess = true
          setTimeout(() => {
            this.onShowProcess = false
          }, 300)
        }
        return this
      },
      onHide(type) {
        this.showValue = false
        if (type) {
          this.closeType = true
          this.currentValue = getObject(this.tempValue)
          this.selectName = this.getNameValues()
          this.$emit('input', getObject(this.tempValue))
        }
        if (!type) {
          this.closeType = false
          if (this.value.length > 0) {
            this.tempValue = getObject(this.currentValue)
          }
        }
      },
      onPopupHide(val) {
        console.log(val)
        if (this.value.length > 0) {
          this.tempValue = getObject(this.currentValue)
        }
        this.$emit('on-hide', this.closeType)
      },
      onPickerChange(val) {
        if (JSON.stringify(this.currentValue) !== JSON.stringify(val)) {
          // if has value, replace it
          if (this.value.length) {
            const nowData = JSON.stringify(this.data)
            if (nowData !== this.currentData && this.currentData !== '[]') {
              // this.value = getObject(val)
              this.$emit('input', getObject(val))
            }
            this.currentData = nowData
          } else { // if no value, stay quiet
            // if set to auto update, do update the value
          }
        }
        this.$emit('on-shadow-change', getObject(val))
      }
    },
    watch: {
      value(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.tempValue)) {
          this.tempValue = getObject(val)
        }
        this.selectName = getName(this.value, this.data)
      },
      currentValue(val) {
        this.$emit('input', val)
      },
      show(val) {
        this.showValue = val
      }
    },
    data() {
      return {
        onShowProcess: false,
        tempValue: getObject(this.value),
        closeType: false,
        currentData: JSON.stringify(this.data), // used for detecting if it is after data change
        showValue: false,
        currentValue: this.value,
        selectName: ''
      }
    }
  }
</script>
