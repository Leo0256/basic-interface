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
	const [ parc, setParc ] = useState({
		par_mpgto: 2,
		par_max: 0,
		par_acrescimo: 0,
		par_acrescimo_perc: 0,
		par_classe: null
	})
	const [ resp, setResp ] = useState();

	function saveTaxa(e) {
		e.preventDefault();
		axios.post('http://localhost:3000/temp/saveTaxa', { taxa, parc })
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
					onChange={a => {
						setTaxa(e => {
							e.tax_classe = !!a.target.value ? a.target.value : 0
							return e
						})

						setParc(e => {
							e.par_classe = !!a.target.value ? a.target.value : 0
							return e
						})
				}}
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
			<div>
				<p>Parcelas de Crédito</p>

				<label>
					Máximo de parcelas: 
					<input
						type="number"
						onChange={a => setParc(e => {
							e.par_max = !!a.target.value ? a.target.value : 0
							return e
						})}
					/>
				</label>
				<label>
					Valor das parcelas: 
					<input
						type="number"
						step="0.001"
						onChange={a => setParc(e => {
							e.par_acrescimo = !!a.target.value ? a.target.value : 0
							return e
						})}
					/>
				</label>
				<label>
					Parcelas em porcentagem: 
					<input
						type="checkbox"
						defaultChecked={parc.par_acrescimo_perc}
						onChange={() => setTaxa(e => {
							e.par_acrescimo_perc = !e.par_acrescimo_perc
							return e
						})}
					/>
				</label>
			</div>
			<button type="submit">salvar taxa</button>
		</form>
	</div>
}

export default App;
