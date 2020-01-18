import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

import reducers from "./reducers";
import errorMiddleware from "./errorMiddleware";

const middlewares = [thunk, errorMiddleware, promise];

export function initializeStore(initialState = {}) {
    return createStore(reducers, initialState, applyMiddleware(...middlewares));
}
