import * as actionTypes from "store/constants";

const initialUserData = {
  avatar: "assets/img/avatars/avatar.jpg",
  imageCover: "/assets/img/bg/bg.png",
  firstName: "User",
  lastName: "",
  nickName: "@user",
  account: null,
  bio: "",
  twitter: "",
  telegram: "",
  instagram: "",
  subscribe: "",
  followers: [],
};

export function userReducer(state = initialUserData, action) {
  switch (action.type) {
    case actionTypes.SET_PROFILE:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}
