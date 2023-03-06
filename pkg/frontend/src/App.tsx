import { Component } from 'solid-js'
import { Metadata } from './Metadata'

const App: Component = () => {
  return (
    <div data-theme="dark" class="bg-base-100 min-h-screen p-4">
      <Metadata />
    </div>
  )
}

export default App
