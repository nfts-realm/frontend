import * as actionTypes from "store/constants";

export function setUserProfile(payload) {
  return {
    type: actionTypes.SET_PROFILE,
    payload: payload,
  };
}
