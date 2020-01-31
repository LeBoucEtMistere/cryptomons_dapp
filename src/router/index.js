import Vue from "vue";
import VueRouter from "vue-router";
import Market from "../components/Market.vue";
import Wallet from "../components/Wallet.vue";
import Admin from "../components/Admin.vue";
import FightClub from "../components/FightClub.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: { name: "wallet" } },
  {
    path: "/wallet",
    name: "wallet",
    component: Wallet
  },
  {
    path: "/market",
    name: "market",
    component: Market
  },
  {
    path: "/admin",
    name: "admin",
    component: Admin
  },
  {
    path: "/fightclub",
    name: "fightclub",
    component: FightClub
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
