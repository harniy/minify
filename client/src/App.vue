<template>
  <div id="app">
    <Minify/>
  </div>
</template>

<script>
import Minify from './components/minify.vue'

export default {
  name: 'App',
  components: {
    Minify
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

body {
    margin: 0;
    padding: 0;
    height: 100vh;
    background-color: #f7fafcdb;
}

/* mobile */

@media (max-width: 600px) {
  textarea[name='code'] {
    width: 90%;
  }
}
</style>
