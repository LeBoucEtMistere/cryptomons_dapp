import state from "./state";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

export default (store, moduleName = "breed") => {
  store.registerModule(moduleName, {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  });
};
