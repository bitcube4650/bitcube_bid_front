import React from 'react';
import LoginWrap from '../components/login/LoginWrap';
import LoginFooter from '../components/login/LoginFooter';

const Login = () => {
    const logoUrl = "../../images/bitcube_logo_black.png";

    return (
        <div>
            <div className="loginBg">
                <div className="inner">
                    <LoginWrap logoUrl={logoUrl}/>
                    <LoginFooter logoUrl={logoUrl}/>
                </div>
            </div>
        </div>
        
    );
};

export default Login;