import { useContext, useEffect } from 'react';
import { UserContext } from '../UserContext/UserContext';
import { useHistory, useLocation } from 'react-router-dom';

export default function AuthComponent(props) {
    const { user } = useContext(UserContext);
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        if(user === "" || !user) {
            window.localStorage.setItem('redirectUrl', location.pathname);
            history.push('/');
        }
    }, []);

    return (
        <>
            {props.children}
        </>
    )
}