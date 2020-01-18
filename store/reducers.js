import { combineReducers } from "redux";

import { userReducer } from "../resources/js/components/User/duck";

const reducers = combineReducers({
    user: userReducer
});

export default reducers;
