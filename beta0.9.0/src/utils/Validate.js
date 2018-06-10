/**
 * Created by Gary on 2018/3/2.
 */
import Vue from 'vue'
import VeeValidate, {
  Validator
} from 'vee-validate'
import 'vee-validate/dist/locale/zh_CN'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'zh_CN'
})

const dictionary = {
  zh_CN: {
    messages: {
      email: () => '请输入正确的邮箱格式', // 更改email中的错误提示信息
      required: field => `请输入${field}`
    },
    attributes: {
      email: '邮箱',
      password: '密码',
      name: '账号',
      mobile: '手机',
      length11: '长度'
    }
  }
}
const config = {
  // 这里是为了避免该组件中默认的errors和全局的errors起冲突，重新定义的
  errorBagName: 'warns',
  delay: 0,
  events: 'input|blur',
  i18n,
  i18nRootKey: 'validation',
  dictionary
}
Vue.use(VeeValidate, config)

Validator.localize(dictionary)

// 自定义的规则,手机
Validator.extend('mobile', {
  // 验证规则，符合规则通过，否则不通过
  validate: (value) => {
    const verifi = /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
    return verifi
  },
  // 提示信息，不符合规则提示语
  getMessage: (field) => {
    const verifi = `${field}必须是11位手机号码`
    return verifi
  }
})

// 密码
Validator.extend('password', {
  // 验证规则，符合规则通过，否则不通过
  validate: (value) => {
    const passBool = /^[A-Za-z0-9]{6,20}$/.test(value)
    return passBool
  },
  // 提示信息，不符合规则提示语
  getMessage: (field) => {
    const passBool = `${field}必须是由6-20位字符数字的组合`
    return passBool
  }
})
