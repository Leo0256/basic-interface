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

	const url = 'https://api-qingresso-server.onrender.com/temp'
	//const url = 'http://localhost:3000/temp'

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
	const [ maxParc, setMaxParc ] = useState(1);

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
							setClasses([])
						}

						document.getElementById('eventoInput').value = ''
						document.getElementById('classeInput').value = ''
					}}/>
					<datalist id='pdvs'>
						{ pdvs.length > 0 && pdvs.map((pdv, index) => (
							<option key={index} value={pdv?.pdv_nome}/>
						)) }
					</datalist>
				</label>

				<label>
					<span>Evento: </span>
					<input id='eventoInput' list='eventos'
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

						document.getElementById('classeInput').value = ''
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
				<input id='classeInput' list='classes'
					disabled={!classes.length}
					onChange={a => {
						var text = (a.target.value).trim();
						var classe = classes.find(a => a.cla_nome === text)
						let tax_classe = 0

						if(!!classe) {
							tax_classe = classe?.cla_cod
							setMaxParc(() => {
								var max = Math.trunc(classe.cla_valor)
								if(max < 2)
									return 1
								return max
							})
						}
						else {
							setMaxParc(1)
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
					step="0.01"
					min="0"
					onChange={a => {
						var value = parseFloat(!!a.target.value ? a.target.value : 0)
						setTaxa(e => {
							e.tax_dinheiro = !!e.tax_dinheiro_perc ? value / 100 : value
							return e
						})
					}}
				/>
			</label>
			<label>
				<span className='auto'>Dinheiro em porcentagem: </span>
				<input
					type="checkbox"
					onChange={() => setTaxa(e => {
						e.tax_dinheiro_perc = !e.tax_dinheiro_perc

						if(!!e.tax_dinheiro_perc)
							e.tax_dinheiro /= 100
						else
							e.tax_dinheiro *= 100

						return e
					})}
				/>
			</label>
			<label>
				<span>Crédito: </span>
				<input
					type="number"
					step="0.01"
					min="0"
					onChange={a => {
						var value = parseFloat(!!a.target.value ? a.target.value : 0)
						setTaxa(e => {
							e.tax_credito = !!e.tax_credito_perc ? value / 100 : value
							return e
						})
					}}
				/>
			</label>
			<label>
				<span className='auto'>Crédito em porcentagem: </span>
				<input
					type="checkbox"
					onChange={() => setTaxa(e => {
						e.tax_credito_perc = !e.tax_credito_perc

						if(!!e.tax_credito_perc)
							e.tax_credito /= 100
						else
							e.tax_credito *= 100

						return e
					})}
				/>
			</label>
			<label>
				<span>Débito: </span>
				<input
					type="number"
					step="0.01"
					min="0"
					onChange={a => {
						var value = parseFloat(!!a.target.value ? a.target.value : 0)
						setTaxa(e => {
							e.tax_debito = !!e.tax_debito_perc ? value / 100 : value
							return e
						})
					}}
				/>
			</label>
			<label>
				<span className='auto'>Débito em porcentagem: </span>
				<input
					type="checkbox"
					onChange={() => setTaxa(e => {
						e.tax_debito_perc = !e.tax_debito_perc

						if(!!e?.tax_debito_perc)
							e.tax_debito /= 100
						else
							e.tax_debito *= 100

						return e
					})}
				/>
			</label>
			<label>
				<span>Pix: </span>
				<input
					type="number"
					step="0.01"
					min="0"
					onChange={a => {
						var value = parseFloat(!!a.target.value ? a.target.value : 0)
						setTaxa(e => {
							e.tax_pix = !!e.tax_pix_perc ? value / 100 : value
							return e
						})}
					}
				/>
			</label>
			<label>
				<span className='auto'>Pix em porcentagem: </span>
				<input
					type="checkbox"
					onChange={() => setTaxa(e => {
						e.tax_pix_perc = !e.tax_pix_perc

						if(!!e.tax_pix_perc)
							e.tax_pix /= 100
						else
							e.tax_pix *= 100
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
						max={maxParc}
						min="1"
						onChange={a => setParc(e => {
							e.par_max = a.target.value
							return e
						})}
					/>
				</label>
				<label>
					<span>Taxa por parcela: </span>
					<input
						type="number"
						step="0.01"
						min="0"
						onChange={a => {
							var value = parseFloat(!!a.target.value ? a.target.value : 0)
							setParc(e => {
								e.par_acrescimo = !!e.par_acrescimo_perc ? value / 100 : value
								return e
							})
					}}
					/>
				</label>
				<label>
					<span className='auto'>Parcelas em porcentagem: </span>
					<input
						type="checkbox"
						onChange={() => setParc(e => {
							e.par_acrescimo_perc = !e.par_acrescimo_perc

							if(!!e.par_acrescimo_perc)
								e.par_acrescimo /= 100
							else
								e.par_acrescimo *= 100
							
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
