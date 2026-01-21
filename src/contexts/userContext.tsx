import { createContext } from "react";

export interface User{
    id: string
    email: string
    username: string
    posts_count: number
    following: string[]
    followers: string[]
}

export interface UserContextType{
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    backendUrl: string
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export default UserContext;