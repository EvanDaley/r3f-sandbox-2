import * as scene1Handlers from './handlers/scene1';
import * as birdSceneHandler from './../scenes/birds/handlers/birdSceneHandler';
import * as commonHandlers from './handlers/common';

const HANDLERS = {
    common: commonHandlers,
    scene1: scene1Handlers,
    birdScene: birdSceneHandler,
    // scene2: scene2Handlers,
};

export const routeMessage = (fromPeerId, message) => {
    const { scene, type, payload } = message;

    const handlers = HANDLERS[scene] || {};
    const handler = handlers[type] || commonHandlers[type];

    if (handler) {
        handler(fromPeerId, payload);
    } else {
        console.log(handler)
        console.log(handlers)

        console.warn(`No handler for message: ${scene}/${type}`);
    }
};
