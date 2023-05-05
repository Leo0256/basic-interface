import React, { useState, useEffect } from 'react';
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

	const url = 'https://api-qingresso-server.onrender.com/temp'//'http://localhost:3000/temp'

	function saveTaxa(e) {
		e.preventDefault();
		axios.post(`${url}/saveTaxa`, { taxa, parc })
		.then(resp => {
			setResp(resp.data)
		})
	}

	const [ pdvs, setPdvs ] = useState([]);
	const [ eventos, setEventos ] = useState([]);
	const [ classes, setClasses ] = useState([]);
	const [ pdvSelect, setPdv ] = useState(null);
	const [ eventoSelect, setEvento ] = useState(null);

	useEffect(() => {
		axios.get(`${url}/getPdvs`)
		.then(resp => {
			setPdvs(resp.data)
		})
	}, []);

	function getEventos(pdv) {
		axios.post(`${url}/getEventos`, { pdv })
		.then(resp => {
			setEventos(resp.data)
		})
	}

	function getClasses(evento) {
		axios.post(`${url}/getClasses`, {
			evento,
			pdv: pdvSelect?.pdv_id ?? null
		})
		.then(resp => {
			setClasses(resp.data)
		})
	}

	return <>
		<p>
			Taxa: {JSON.stringify(resp)}
		</p>

		<form onSubmit={saveTaxa}>
			<div>
				<label>
					<span>PDV: </span>
					<input list='pdvs' onChange={a => {
						var text = (a.target.value).trim();
						var pdv = pdvs.find(a => a.pdv_nome === text)

						if(!!pdv && pdvSelect !== text) {
							setPdv(pdv)
							getEventos(pdv?.pdv_id)
						}
						else {
							setPdv(null)
							setEventos([])
							setEvento(null)
						}
					}}/>
					<datalist id='pdvs'>
						{ pdvs.length > 0 && pdvs.map((pdv, index) => (
							<option key={index} value={pdv?.pdv_nome}/>
						)) }
					</datalist>
				</label>

				<label>
					<span>Evento: </span>
					<input list='eventos'
						disabled={!eventos.length}
						onChange={a => {
						var text = (a.target.value).trim();
						var evento = eventos.find(a => a.eve_nome === text)
						if(!!evento && eventoSelect !== text) {
							setEvento(evento)
							getClasses(evento?.eve_cod)
						}
						else {
							setEvento(null)
							setClasses([])
						}
					}}/>
					<datalist id='eventos'>
						{ eventos.length > 0 && eventos.map((evento, index) => (
							<option key={index} value={evento?.eve_nome}/>
						)) }
					</datalist>
				</label>
			</div>

		
			<label>
				<span>Classe: </span>
				<input list='classes'
					disabled={!classes.length}
					onChange={a => {
						var text = (a.target.value).trim();
						var classe = classes.find(a => a.cla_nome === text)
						let tax_classe = 0

						if(!!classe) {
							tax_classe = classe?.cla_cod
						}
						
						if(taxa.tax_classe !== tax_classe && parc.par_classe !== tax_classe) {
							setTaxa(e => {
								e.tax_classe = tax_classe
								return e
							})

							setParc(e => {
								e.par_classe = tax_classe
								return e
							})
						}
					}}
				/>
				<datalist id='classes'>
					{ classes.length > 0 && classes.map((classe, index) => (
						<option key={index} value={classe?.cla_nome}/>
					)) }
				</datalist>
			</label>
			<label>
				<span>Dinheiro: </span>
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
				<span className='auto'>Dinheiro em porcentagem: </span>
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
				<span>Crédito: </span>
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
				<span className='auto'>Crédito em porcentagem: </span>
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
				<span>Débito: </span>
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
				<span className='auto'>Débito em porcentagem: </span>
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
				<span>Pix: </span>
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
				<span className='auto'>Pix em porcentagem: </span>
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
					<span>Máximo de parcelas: </span>
					<input
						type="number"
						onChange={a => setParc(e => {
							e.par_max = !!a.target.value ? a.target.value : 0
							return e
						})}
					/>
				</label>
				<label>
					<span>Valor das parcelas: </span>
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
					<span className='auto'>Parcelas em porcentagem: </span>
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
			<button type="submit" disabled={!eventoSelect}>salvar taxa</button>
		</form>
	</>
}

export default App;
