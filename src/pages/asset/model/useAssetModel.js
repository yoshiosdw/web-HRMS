import axiosIns from "@/plugins/axios";
import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

export const useAssetModelStore = defineStore('assetModel', {
  state: () => ({
    asetModels: [],
    page: 1,
    perPage: 10,
    total: 0,
    last: 0,
    from: 0,
    to: 0,
    find: null,
    showLoading: false
  }), 
  actions: {
    async fetchAssetModel(){
      const toast = useToast()
      this.showLoading = true
      try {
        const ret = await axiosIns.get('asset/models',{
          page: this.page,
          per_page: this.perPage,
          find: this.find
        })
        this.asetModels = ret.data.data
        this.total = ret.data.meta.total
        this.last = ret.data.meta.last
        this.from = ret.data.meta.from
        this.to = ret.data.meta.to
      } catch (error) {
        console.log(error)
      } finally {
        this.showLoading = false
      }
    }
  }
})