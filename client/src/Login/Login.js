import { nanoid } from 'nanoid';
import { useContext, useState } from 'react';
import { UserContext } from '../UserContext/UserContext';
import { useHistory } from 'react-router-dom';

export default function Login(props) {
    const [username, setUsername] = useState("");
    const { setUser } = useContext(UserContext);
    const history = useHistory();

    const onChange = (e) => {
        setUsername(e.target.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setUser(username);
        
        const redirectPath = window.localStorage.getItem('redirectUrl');

        if(redirectPath) {
            window.localStorage.removeItem('redirectUrl')    ;
            return history.push(redirectPath);
        }
        history.push(nanoid(8));
    }
    
    return (
        <div className="login">
            <form className="login-form">
                <input 
                    className="text-input"
                    type="text"
                    value={username}
                    onChange={onChange}
                    placeholder="Enter username"
                    required
                />
                <button 
                    className="btn"
                    type="submit" 
                    onClick={onSubmit}
                    disabled={username === ""}
                >
                    Enter
                </button>
            </form>
        </div>
    );
}
