import create from 'zustand'

const useStore = create(set => ({
  sceneIndex: 0,
}))

export default useStore