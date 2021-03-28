import { nanoid } from 'nanoid';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../UserContext/UserContext';
import { useHistory } from 'react-router-dom';

export default function Login(props) {
    const [username, setUsername] = useState("");
    const [redirectPath, setRedirectPath] = useState("");
    const { setUser } = useContext(UserContext);
    const history = useHistory();

    const onChange = (e) => {
        setUsername(e.target.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setUser(username);

        if(redirectPath) {
            window.localStorage.removeItem('redirectUrl');
            setRedirectPath("");
            return history.push(redirectPath);
        }
        history.push(nanoid(8));
    }

    useEffect(() => {
        setRedirectPath(window.localStorage.getItem('redirectUrl'));

        return () => {
            setRedirectPath("");
            window.localStorage.removeItem('redirectUrl')
        }
    }, []);
    
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
                    {!redirectPath ? "Create Room" : `Enter Room ${redirectPath.substring(1)}`}
                </button>
            </form>
        </div>
    );
}
