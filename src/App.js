import React, { useState } from 'react';
import axios from 'axios';

function App() {
	const [ taxa, setTaxa ] = useState({
		tax_classe: null,
		tax_dinheiro: 0,
		tax_dinheiro_perc: false,
		tax_credito: 0,
		tax_credito_perc: false,
		tax_debito: 0,
		tax_debito_perc: false,
		tax_pix: 0,
		tax_pix_perc: false
	});
	const [ resp, setResp ] = useState();

	function saveTaxa(e) {
		e.preventDefault();
		axios.post('http://localhost:3000/temp/saveTaxa', { taxa })
		.then(resp => {
			setResp(resp.data)
		})
	}

	return <div>

		<p>
			Taxa: {JSON.stringify(resp)}
		</p>
		
		<form onSubmit={saveTaxa}>
			<label>
				Classe: 
				<input
					type="number"
					onChange={a => setTaxa(e => {
						e.tax_classe = !!a.target.value ? a.target.value : 0
						return e
					})}
				/>
			</label>
			<label>
				Dinheiro: 
				<input
					type="number"
					step="0.001"
					onChange={a => setTaxa(e => {
						e.tax_dinheiro = !!a.target.value ? a.target.value : 0
						return e
					})}
				/>
			</label>
			<label>
				Dinheiro em porcentagem: 
				<input
					type="checkbox"
					defaultChecked={taxa.tax_dinheiro_perc}
					onChange={() => setTaxa(e => {
						e.tax_dinheiro_perc = !e.tax_dinheiro_perc
						return e
					})}
				/>
			</label>
			<label>
				Crédito: 
				<input
					type="number"
					step="0.001"
					onChange={a => setTaxa(e => {
						e.tax_credito = !!a.target.value ? a.target.value : 0
						return e
					})}
				/>
			</label>
			<label>
				Crédito em porcentagem: 
				<input
					type="checkbox"
					defaultChecked={taxa.tax_credito_perc}
					onChange={() => setTaxa(e => {
						e.tax_credito_perc = !e.tax_credito_perc
						return e
					})}
				/>
			</label>
			<label>
				Débito: 
				<input
					type="number"
					step="0.001"
					onChange={a => setTaxa(e => {
						e.tax_debito = !!a.target.value ? a.target.value : 0
						return e
					})}
				/>
			</label>
			<label>
				Débito em porcentagem: 
				<input
					type="checkbox"
					defaultChecked={taxa.tax_debito_perc}
					onChange={() => setTaxa(e => {
						e.tax_debito_perc = !e.tax_debito_perc
						return e
					})}
				/>
			</label>
			<label>
				Pix: 
				<input
					type="number"
					step="0.001"
					onChange={a => setTaxa(e => {
						e.tax_pix = !!a.target.value ? a.target.value : 0
						return e
					})}
				/>
			</label>
			<label>
				Pix em porcentagem: 
				<input
					type="checkbox"
					defaultChecked={taxa.tax_pix_perc}
					onChange={() => setTaxa(e => {
						e.tax_pix_perc = !e.tax_pix_perc
						return e
					})}
				/>
			</label>
			<button type="submit">salvar taxa</button>
		</form>
	</div>
}

export default App;
