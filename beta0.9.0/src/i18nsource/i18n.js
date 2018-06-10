/**
 * Created by wangjunfei on 2017/2/21.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import vuexI18n from 'vuex-i18n'
import localeDe from './locale-de'
import localeEn from './locale-en'
import localeCh from './locale-ch'

export let getMyi18nStore = () => {
  console.log(localeDe);

  Vue.use(Vuex)
  Vue.config.devtools = true;
  const store = new Vuex.Store({
    modules: {
      i18n: vuexI18n.store
    }
  });

// initialize the vuexi18nPlugin
  Vue.use(vuexI18n.plugin, store);

// add the english locale to the i18n store
  Vue.i18n.add('de', localeDe);
  Vue.i18n.add('en', localeEn);
  Vue.i18n.add('ch', localeCh);
  return store;
}

