import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDialogStore = defineStore('dialog', () => {
 
  const dialogDone = ref(false)
  const masterKey = ref(sessionStorage.getItem('masterKey') || '')
  
  function setDialogDone(value) {
    dialogDone.value = value
  }
  function setMasterKey(value) {
    masterKey.value = value
    sessionStorage.setItem('masterKey', value)
  }

  function resetDialog() {
    dialogDone.value = false
    masterKey.value = ''
    sessionStorage.removeItem('masterKey')
  }


  return {
    dialogDone,
    masterKey,
    setDialogDone,
    resetDialog,
    setMasterKey,
  }
})
