import { createStore } from "redux";

import RootReducer from "./modules";

export const store = createStore(RootReducer);
