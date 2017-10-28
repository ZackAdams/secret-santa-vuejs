<template>
  <div class="newNameList">
    <ul>
        <li v-for="(person, index) in people">
            <span>{{ person.name }}</span>
            <input v-model="person.showEdit" type="checkbox" />
            <div class="restricredList" v-if="person.showEdit">
              <select v-on:change="addDrawRestriction($event, person)">
                <option disabled selected value></option>
                <option v-for="otherPerson in people" v-if="otherPerson !== person && person.restrictedPeople.indexOf(otherPerson) === -1 " v-bind:value="otherPerson.id">{{ otherPerson.name }}</option>
              </select>
              <ul>
                <li v-for="otherPerson in person.restrictedPeople">{{ otherPerson.name }}<button v-bind:value="otherPerson.id" v-on:click="removeDrawRestriction($event, person)">x</button></li>
              </ul>
            </div>
        </li>
        <li>
          <input class="nameInput" v-model="newName" v-on:keyup.enter="newNameInput" id="newNameInput" placeholder="Type a name and press enter..." />
        </li>
    </ul>
    <button v-on:click="draw">done</button>
  </div>
</template>

<script>
  import AES from 'crypto-js/aes'
  import FirebaseDB from '../firebase.js'

  export default {
    name: 'NewNameList',
    data () {
      return {
        lastId: 0,
        people: [],
        newName: ''
      }
    },
    methods: {
      newNameInput: function (event) {
        if (this.newName.trim()) {
          this.people.push({
            id: this.lastId++,
            name: this.newName.trim(),
            restrictedPeople: [],
            showEdit: false
          })
          this.newName = ''
        }
      },
      addDrawRestriction: function (event, person) {
        var id = parseInt(event.target.value)
        var otherPerson = this.getPersonById(id)
        person.restrictedPeople.push(otherPerson)
        event.target.selectedIndex = null
      },
      removeDrawRestriction: function (event, person) {
        var id = parseInt(event.target.value)
        for (var i = 0; i < person.restrictedPeople.length; i++) {
          var otherPerson = person.restrictedPeople[i]
          if (otherPerson.id === id) {
            person.restrictedPeople.splice(i, 1)
            return
          }
        }
      },
      getPersonById: function (id) {
        for (var i = 0; i < this.people.length; i++) {
          var person = this.people[i]
          if (person.id === id) {
            return person
          }
        }
        return undefined
      },
      draw: function () {
        var nextPerson
        var hasDrawnList = []
        var hasBeenDrawnList = []
        var finalList = []
        var person

        if (this.people.length < 2) {
          alert('woah! add more people.')
          return
        }

        do {
          nextPerson = undefined
          for (var i = 0; i < this.people.length; i++) {
            person = this.people[i]
            if (hasDrawnList.indexOf(person) < 0 && (!nextPerson || nextPerson.restrictedPeople.length < person.restrictedPeople.length)) {
              nextPerson = person
            }
          }
          if (nextPerson) {
            // console.log('drawing for: ' + nextPerson.name)
            var canDrawList = []
            for (var j = 0; j < this.people.length; j++) {
              person = this.people[j]
              if (person !== nextPerson && nextPerson.restrictedPeople.indexOf(person) < 0 && hasBeenDrawnList.indexOf(person) < 0) {
                canDrawList.push(person)
              }
            }
            if (canDrawList.length < 1) {
              alert(nextPerson.name + ' is not able to draw anyone! Check your restrictions and try again.')
              return
            }
            var drawnPerson = canDrawList[Math.floor(Math.random() * canDrawList.length)]
            hasDrawnList.push(nextPerson)
            hasBeenDrawnList.push(drawnPerson)
            var encDrawName = AES.encrypt(drawnPerson.name, "Hello Brian! What'cha doing here?").toString()
            finalList.push({
              name: nextPerson.name,
              drawName: encDrawName,
              hasDrawn: false
            })
            // console.log('drew: ' + drawnPerson.name)
          }
        } while (nextPerson)
        FirebaseDB.ref('lists').push(finalList).then(ref => {
          this.$router.push({name: 'NameList', params: { listKey: ref.key }})
        })
      }
    }
  }
</script>

<style scoped>
  .newNameList {
    font-size: 1.5em;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
  li {
    margin: 0;
    padding: 0;
  }
  .nameInput {
    display: inline-block;
    width: 20em;
  }
  .restricredList {
    font-size: 0.66em;
    padding: 1em;
  }
  .restricredList select {
    width: 10em;
    display: inline-block;
  }
</style>
