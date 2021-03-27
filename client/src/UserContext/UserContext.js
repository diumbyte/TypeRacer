import { useState, createContext } from 'react';

const UserContext = createContext();

const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export {UserContextProvider, UserContext}