import React from 'react';
import {
	BrowserRouter,
	Routes,
	Route
} from 'react-router-dom';
import { Sidebar } from './components';
import * as Views from './views';

export default function App() {
	return <>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Sidebar/>}>
					<Route index element={<Views.CadastroTaxa/>}/>
					{/* <Route path='/alocacao' element={<Views.AlocacaoEventoPdv/>}/> */}
				</Route>
			</Routes>
		</BrowserRouter>
	</>
};
