import create from 'zustand'

const useSceneStore = create(set => ({
  sceneIndex: 0,
}))

export default useSceneStore