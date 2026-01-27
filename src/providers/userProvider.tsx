import { useEffect, useState } from "react";
import UserContext from "../contexts/userContext";
import axios from "axios";
import type { Props, User } from "../type";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UserProvider = ({children}: Props) => {
    const [user, setUser] = useState<User | null>(null);
    const token = localStorage.getItem('access_token');

    async function getUser() {
        const response = await axios(`${backendUrl}/users/me`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        if(response.data){
            setUser({
                id: response.data.id,
                email: response.data.email,
                username: response.data.username || response.data.name,
                posts_count: response.data.posts_count || 0,
                following: response.data.following || [],
                followers: response.data.followers || [],
            });
        }
        
    }

    useEffect(()=>{
        getUser()
    },[token])

    return (
        <UserContext.Provider value={{user, setUser, backendUrl}}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;