<template>
  <amplify-authenticator>
    <h1>東京ビーガンレストラン</h1>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <GmapMap
            ref="gmp"
            map-type-id="roadmap"
            :center="maplocation"
            :zoom="zoom"
            :style="styleMap"
            :options="mapOptions"
          >
            <GmapMarker
              v-for="(m, index) in markers"
              :key="index"
              :title="m.title"
              :position="m.position"
              :clickable="true"
              :draggable="false"
              @click="onClickMarker(index, m)"
            />
            <GmapInfoWindow
              :options="infoOptions"
              :position="infoWindowPos"
              :opened="infoWinOpen"
              @closeclick="infoWinOpen = false"
            >
              <p style="color: #000">
                {{ marker.title }}
              </p>
              <img src="~/assets/img/dango.jpg" width="200px" height="100px" />
            </GmapInfoWindow>
          </GmapMap>
        </v-card>
      </v-col>
    </v-row>
    <amplify-sign-out></amplify-sign-out>
  </amplify-authenticator>
</template>

<script>
export default {
  data() {
    return {
      maplocation: { lng: 0, lat: 0 },
      zoom: 4,
      styleMap: {
        width: '100%',
        height: '400px',
        margin: '40px',
      },
      mapOptions: {
        streetViewControl: false,
        styles: [],
      },
      infoOptions: {
        minWidth: 200,
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
      infoWindowPos: null,
      infoWinOpen: false,
      marker: {},
      markers: [
        {
          title: 'ここの情報みたいかな？',
          url: '/assets/img/dango.jpg',
          position: { lat: 35.656519815124916, lng: 139.715925897229 },
        },
      ],
    }
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
    onClickMarker(index, marker) {
      this.$refs.gmp.panTo(marker.position)
      this.infoWindowPos = marker.position
      this.marker = marker
      this.infoWinOpen = true
    },
  },
}
</script>
