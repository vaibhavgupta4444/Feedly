import { createContext } from "react";
import type { UserContextType } from "../type";

const UserContext = createContext<UserContextType | undefined>(undefined)

export default UserContext;