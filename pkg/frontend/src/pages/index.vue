<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useHead } from '@vueuse/head'
  import logoURL from '@/assets/synadia_wt_letters.svg'

  const title = 'Space Stat Demo'
  useHead({
    title,
    meta: [
      {
        name: 'description',
        content: title,
      },
    ],
  })

  const starFieldRef = ref<HTMLCanvasElement>()

  onMounted(() => {
    if (!starFieldRef.value) throw new Error('Canvas not found')
    const canvas = starFieldRef.value
    canvas.width = window.innerWidth //screen width
    canvas.height = window.innerHeight //screem height

    const c = canvas.getContext('2d')
    if (!c) throw new Error('Canvas context not found')

    //on mouse scroll changes speed and color
    window.addEventListener('wheel', event => {
      if (event.deltaY < 0) speed *= 1.1
      else speed *= 0.9
      if (speed < 0.01) speed = 0.01
      else if (speed > 0.1) speed = 0.1
    })

    class Star {
      x: number
      y: number
      z: number
      px = 0
      py = 0

      constructor() {
        //initializing
        this.x = Math.random() * canvas.width - canvas.width / 2 //random x
        this.y = Math.random() * canvas.height - canvas.height / 2 //random y
        this.z = Math.random() * 4 //random z
      }

      update() {
        //stores previous x, y and z and generates new coordinates
        this.px = this.x
        this.py = this.y
        this.z += speed
        this.x += this.x * (speed * 0.2) * this.z
        this.y += this.y * (speed * 0.2) * this.z
        if (
          this.x > canvas.width / 2 + 50 ||
          this.x < -canvas.width / 2 - 50 ||
          this.y > canvas.height / 2 + 50 ||
          this.y < -canvas.height / 2 - 50
        ) {
          this.x = Math.random() * canvas.width - canvas.width / 2
          this.y = Math.random() * canvas.height - canvas.height / 2
          this.px = this.x
          this.py = this.y
          this.z = 0
        }
      }

      //draws line from x,y to px,py
      show() {
        if (!c) throw new Error('Canvas context not found')
        c.lineWidth = this.z
        c.beginPath()
        c.moveTo(this.x, this.y)
        c.lineTo(this.px, this.py)
        c.stroke()
      }
    }
    let speed = 0.1
    const stars: Star[] = []
    //create 1500 stars (objects)
    for (let i = 0; i < 1500; i++) stars.push(new Star())
    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    // c.strokeStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
    //   Math.random() * 255
    // })`

    c.strokeStyle = `hsl(${getComputedStyle(canvas).getPropertyValue('--p')})`
    c.translate(canvas.width / 2, canvas.height / 2)
    function draw() {
      if (!c) throw new Error('Canvas context not found')
      //create rectangle
      c.fillRect(
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height,
      )
      for (let s of stars) {
        s.update()
        s.show()
      }
      //infinte call to draw
      requestAnimationFrame(draw)
    }
    draw()
  })
</script>

<template>
  <div class="relative grid min-h-screen place-items-center">
    <div
      class="z-10 flex flex-col items-center gap-4 p-6 shadow-inner bg-base-100 rounded-xl ring-4 bg-opacity-90 ring-primary"
    >
      <div class="">
        <div class="flex items-baseline gap-1 text-4xl">
          <icon-noto:satellite-antenna />
          <div class="font-bold text-primary">{{ title }}</div>
        </div>
      </div>
      <div>
        <div class="font-mono text-xs uppercase text-neutral-500">
          Provided by
        </div>
        <img class="w-80" :src="logoURL" alt="Synadia" />
      </div>
      <router-link to="/demo" class="btn btn-block btn-primary"
        >Let's Go!</router-link
      >
    </div>
    <canvas ref="starFieldRef" class="fixed top-0 left-0 w-full h-full" />
  </div>
</template>
