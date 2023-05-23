import React from 'react';
import {
	BrowserRouter,
	Routes,
	Route
} from 'react-router-dom';
import CadastroTaxa from './CadastroTaxa';

export default function App() {
	return <>
		<BrowserRouter>
			<Routes>
				<Route path='/'>
					<Route index element={<CadastroTaxa/>}/>
				</Route>
			</Routes>
		</BrowserRouter>
	</>
};
