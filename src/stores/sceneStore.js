import create from 'zustand'
import WelcomeScreen from '../scenes/WelcomeScreen'
import Scene1 from '../scenes/Scene1'

const scenes = [
  { id: 'welcome', scene: WelcomeScreen },
  { id: 'scene1', scene: Scene1 },
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
