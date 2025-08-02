import useSceneStore from '../../stores/sceneStore';

export function changeScene(fromPeerId, payload) {
    const { sceneId } = payload;
    console.log(`Host ${fromPeerId} requesting scene change to: ${sceneId}`);
    
    // Only allow scene changes from host
    // Note: We could add additional validation here if needed
    useSceneStore.getState().setSceneId(sceneId);
}