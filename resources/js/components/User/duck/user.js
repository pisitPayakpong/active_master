import axios from "axios";

const initState = {
    currentUser: {},
    userOptions: {}
};

export const fetchCurrentUser = () => {
    const payload = JSON.parse(
        document.getElementById("initial-state").innerHTML
    );

    return {
        type: "USER/FETCH_CURRENT_USER",
        payload
    };
};

export const fetchOptionUsers = () => ({
    type: "USER/FETCH_OPTIONS",
    payload: axios.get(`/api/test_v1/user/as_options`)
});

export default function reducer(state = initState, action = {}) {
    switch (action.type) {
        case "USER/FETCH_CURRENT_USER":
            return {
                ...state,
                currentUser: { ...action.payload }
            };

        case "USER/FETCH_OPTIONS_FULFILLED":
            return {
                ...state,
                userOptions: { ...action.payload?.data?.data }
            };

        default:
            return state;
    }
}
