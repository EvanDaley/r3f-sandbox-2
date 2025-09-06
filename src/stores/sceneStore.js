import create from 'zustand'
import WelcomeScreen from '../scenes/WelcomeScreen'
import Scene1 from '../scenes/Scene1'
import Scene2 from '../scenes/Scene2'
import Sandbox from '../scenes/Sandbox'
import VideoPlane from '../scenes/examples/VideoPlane'
import GridScene from '../scenes/examples/GridScene'
import BirdScene from '../scenes/birds/BirdScene'
import SimpleGridScene from '../scenes/simple_grid/SimpleGridScene'

const scenes = [
  { id: 'welcome', scene: WelcomeScreen },
  { id: 'scene1', scene: Scene1 },
  { id: 'scene2', scene: Scene2 },
  { id: 'videoPlane', scene: VideoPlane },
  { id: 'sandbox', scene: Sandbox },
  { id: 'birdScene', scene: BirdScene },
  { id: 'grid1', scene: GridScene },
  { id: 'simpleGrid', scene: SimpleGridScene },
]

const defaultScene = 'welcome'

const useSceneStore = create(set => ({
  currentSceneId: defaultScene,
  scenes,
  setSceneId: (id) => set({ currentSceneId: id }),
  getCurrentSceneComponent: () => {
    const state = useSceneStore.getState()
    return scenes.find(s => s.id === state.currentSceneId)?.scene || null
  },
}))

export default useSceneStore
