import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Navbar() {
    const current = useLocation();
    
    function Navlink({ link, children }) {
        return <Link
            to={link}
            className={`${current.pathname === link ? 'active' : ''}`}
        >
            {children}
        </Link>
    }

    return <>
        <nav>
            <Navlink link='/'>Sobretaxa de ingresso</Navlink>
            <Navlink link='/taxa_padrao'>Taxa padrão de evento</Navlink>
        </nav>

        <div id='body'>
            <Outlet/>
        </div>
    </>
}