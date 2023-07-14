import React/* , { useMemo } */ from 'react';
import {
    //NavLink,
    Outlet
} from 'react-router-dom';

export default function Sidebar() {
    /* const links = useMemo(() => [
        {
            to: '/',
            title: 'Cadastro de Sobretaxa',
            text: 'Sobretaxa'
        },
        {
            to: '/alocacao',
            title: 'Alocação de Eventos',
            text: 'Alocar Evento'
        },
    ], []); */

    return <>
        {/* <nav>
            <ul>
                {links.map((link, index) => (
                    <li key={index}>
                        <NavLink
                            to={link.to}
                            title={link.title}
                        >
                            {link.text}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav> */}

        <div id='body'>
            <Outlet/>
        </div>
    </>
}