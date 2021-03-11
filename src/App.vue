<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <button v-on:click="certGrab">Try Cert grab</button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import { ipcRenderer } from 'electron'
// import getCerts from './get-certs'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  methods: {
    certGrab(){
      console.log('btn pressed yay')
      ipcRenderer.send('scrape-cert', 'ping') //send msg from renderer to main (background.js)
      ipcRenderer.on('reply', (event, arg) => { //listen for msg from main
        console.log('here 002', arg)
      });
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
