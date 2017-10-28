<template>
  <div class="nameList">
    <div v-if="drawName" class="fullScreen">
      <p>You drew...</p>
      <p class="name">{{ drawName }}</p>
    </div>
    <p>Select your name!</p>
    <ul>
      <li v-for="(person, index) in list">
        <a  v-if="!person.hasDrawn" href="#" v-on:click.prevent="clickName(person, index)">{{ person.name }}</a>
        <span  v-else href="#">{{ person.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import CryptoJS from 'crypto-js'
  import FirebaseDB from '../firebase.js'

  export default {
    name: 'NameList',
    data () {
      return {
        drawName: ''
      }
    },
    props: ['listKey'],
    firebase: function () {
      return {
        list: FirebaseDB.ref('/lists/' + this.listKey)
      }
    },
    methods: {
      clickName: function (person, index) {
        if (!person.hasDrawn) {
          this.drawName = CryptoJS.AES.decrypt(person.drawName, "Hello Brian! What'cha doing here?").toString(CryptoJS.enc.Utf8)
          localStorage.setItem(this.listKey, this.drawName)
          person.hasDrawn = true
          this.$firebaseRefs.list.child(index).child('hasDrawn').set(true)
        } else {
          alert('woah woah woah woah.. woah.. this is not my batman cup')
        }
      }
    },
    created: function () {
      this.drawName = localStorage.getItem(this.listKey)
    }
  }
</script>

<style scoped>
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    font-size: 2em;
    font-weight: bold;
  }
  li {
    margin: 0;
    padding: 1em;
  }
  .fullScreen {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    font-size: 1em;
  }
  .fullScreen .name {
    font-size: 3em;
    font-weight: bold;
  }
</style>