<template>
  <amplify-authenticator>
    <h1>ビーガンレシピ検索</h1>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <GmapMap
            map-type-id="roadmap"
            :center="maplocation"
            :zoom="zoom"
            :style="styleMap"
            :options="mapOptions"
          >
          </GmapMap>
        </v-card>
      </v-col>
    </v-row>
    <amplify-sign-out></amplify-sign-out>
  </amplify-authenticator>
</template>

<script>
import { API } from 'aws-amplify'
import { createTodo } from '~/src/graphql/mutations'
import { listTodos } from '~/src/graphql/queries'
import { onCreateTodo } from '~/src/graphql/subscriptions'

export default {
  data() {
    return {
      name: '',
      todos: [],
      maplocation: { lng: 0, lat: 0 },
      zoom: 4,
      styleMap: {
        width: '100%',
        height: '400px',
      },
      mapOptions: {
        streetViewControl: false,
        styles: [],
      },
    }
  },
  created() {
    this.getTodos()
    this.subscribe()
  },
  async mounted() {
    const currentPosTmp = await this.getCurrentPosition()
    const currentPos = {
      lat: currentPosTmp.coords.latitude,
      lng: currentPosTmp.coords.longitude,
    }
    this.maplocation = currentPos
  },
  methods: {
    getCurrentPosition() {
      return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
    },
    async createTodo() {
      const { name } = this
      if (!name) return false
      const todo = { name }
      await API.graphql({
        query: createTodo,
        variables: { input: todo },
      })
      this.name = ''
    },
    async getTodos() {
      const todos = await API.graphql({
        query: listTodos,
      })
      this.todos = todos.data.listTodos.items
    },
    subscribe() {
      API.graphql({ query: onCreateTodo }).subscribe({
        next: (eventData) => {
          const todo = eventData.value.data.onCreateTodo
          if (this.todos.some((item) => item.name === todo.name)) return
          this.todos = [...this.todos, todo]
        },
      })
    },
  },
}
</script>
