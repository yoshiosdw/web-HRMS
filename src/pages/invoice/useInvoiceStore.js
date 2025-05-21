import { defineStore } from 'pinia';

export const useInvoiceStore = defineStore('invoiceStore', {
  state: () => ({
    page: 1,
    perPage: 10,
    find: ''
  })
});