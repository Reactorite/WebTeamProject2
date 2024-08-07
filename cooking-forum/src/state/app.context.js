import { createContext } from "react";

export const AppContext = createContext({
  user: null,
  userData: null,
  isAdmin: false,
  isBlocked: false,
  setAppState: () => {}
});
