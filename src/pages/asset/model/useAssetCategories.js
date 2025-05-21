import axiosIns from "@/plugins/axios";
import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast()
export const useAssetCategoriesStore = defineStore('assetCategoriesStore', {
  state: () => ({
    assetCategories: [],
    find: ''
  }),
  actions: {
    async fetchAssetCategories(find){
      try {
        const ret = await axiosIns.get('asset/categories', {
          params: {
            page: 1,
            per_page: 1000,
            find: this.find
          }
        })
        this.assetCategories = ret.data.data
      } catch (error) {
        toast.error('Gagal memuat data Kategori')
      }
    }
  }
})