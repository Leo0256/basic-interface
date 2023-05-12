import React from 'react';
import {
	BrowserRouter,
	Routes,
	Route
} from 'react-router-dom';
import Navbar from './Navbar';
import CadastroTaxa from './CadastroTaxa';

export default function App() {
	return <>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Navbar/>}>
					<Route index element={<CadastroTaxa/>}/>
					<Route path='/taxa_padrao' element={<p>teste</p>}/>
				</Route>
			</Routes>
		</BrowserRouter>
	</>
};
