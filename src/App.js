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

	const [ dinheiro, setDinheiro ] = useState('0,00')
	const [ credito, setCredito ] = useState('0,00')
	const [ debito, setDebito ] = useState('0,00')
	const [ pix, setPix ] = useState('0,00')
	const [ parcelaCredito, setParcelaCredito ] = useState('0,00')




	function numberMask(value, percent) {
		const percentMask = (text) => {
			if(percent) {
				if(text.includes('%'))
					return text.replace('%', '').trim()
				return text.trim().slice(0, -1)
			}

			return text.replace('R$', '').trim()
		}

		const number_aux = percentMask(value).replace('.', '').replace(',', '').replace(/\D/g, '');

		return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(
			parseFloat(number_aux) / 100
		);
	}

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

			<div className='input'>
				<label>
					<span>Dinheiro: </span>
					<input
						type="text"
						value={taxa.tax_dinheiro_perc ? `${dinheiro} %` : `R$ ${dinheiro}`}
						onChange={a => {
							const value_mask = numberMask(a.target.value, taxa.tax_dinheiro_perc);
							const value = parseFloat(value_mask.replace(/\./g,'').replace(/,/g,'.'));

							setDinheiro(value_mask);
							setTaxa(a => ({ ...a, tax_dinheiro: taxa.tax_dinheiro_perc ? value / 100 : value }));
						}}
					/>
				</label>
				<label className='percent'>
					<input
						type="checkbox"
						onChange={() => setTaxa(e => ({
							...e,
							tax_dinheiro: !e.tax_dinheiro_perc ? e.tax_dinheiro / 100 : e.tax_dinheiro * 100,
							tax_dinheiro_perc: !e.tax_dinheiro_perc
						}) )}
					/>
					<span>%</span>
				</label>
			</div>

			<div className='input'>
				<label>
					<span>Crédito: </span>
					<input
						type="text"
						value={taxa.tax_credito_perc ? `${credito} %` : `R$ ${credito}`}
						onChange={a => {
							const value_mask = numberMask(a.target.value, taxa.tax_credito_perc);
							const value = parseFloat(value_mask.replace(/\./g,'').replace(/,/g,'.'));

							setCredito(value_mask);
							setTaxa(a => ({ ...a, tax_credito: taxa.tax_credito_perc ? value / 100 : value }));
						}}
					/>
				</label>
				<label className='percent'>
					<input
						type="checkbox"
						onChange={() => setTaxa(e => ({
							...e,
							tax_credito: !e.tax_credito_perc ? e.tax_credito / 100 : e.tax_credito * 100,
							tax_credito_perc: !e.tax_credito_perc
						}) )}
					/>
					<span>%</span>
				</label>
			</div>

			<div className='input'>
				<label>
					<span>Débito: </span>
					<input
						type="text"
						value={taxa.tax_debito_perc ? `${debito} %` : `R$ ${debito}`}
						onChange={a => {
							const value_mask = numberMask(a.target.value, taxa.tax_debito_perc);
							const value = parseFloat(value_mask.replace(/\./g,'').replace(/,/g,'.'));

							setDebito(value_mask);
							setTaxa(a => ({ ...a, tax_debito: taxa.tax_debito_perc ? value / 100 : value }));
						}}
					/>
				</label>
				<label className='percent'>
					<input
						type="checkbox"
						onChange={() => setTaxa(e => ({
							...e,
							tax_debito: !e.tax_debito_perc ? e.tax_debito / 100 : e.tax_debito * 100,
							tax_debito_perc: !e.tax_debito_perc
						}) )}
					/>
					<span>%</span>
				</label>
			</div>

			<div className='input'>
				<label>
					<span>Pix: </span>
					<input
						type="text"
						value={taxa.tax_pix_perc ? `${pix} %` : `R$ ${pix}`}
						onChange={a => {
							const value_mask = numberMask(a.target.value, taxa.tax_pix_perc);
							const value = parseFloat(value_mask.replace(/\./g,'').replace(/,/g,'.'));

							setPix(value_mask);
							setTaxa(a => ({ ...a, tax_pix: taxa.tax_pix_perc ? value / 100 : value }));
						}}
					/>
				</label>
				<label className='percent'>
					<input
						type="checkbox"
						onChange={() => setTaxa(e => ({
							...e,
							tax_pix: !e.tax_pix_perc ? e.tax_pix / 100 : e.tax_pix * 100,
							tax_pix_perc: !e.tax_pix_perc
						}) )}
					/>
					<span>%</span>
				</label>
			</div>

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
				<div className='input'>
					<label>
						<span>Taxa por parcela: </span>
						<input
							type="text"
							value={parc.par_acrescimo_perc ? `${parcelaCredito} %` : `R$ ${parcelaCredito}`}
							onChange={a => {
								const value_mask = numberMask(a.target.value, parc.par_acrescimo_perc);
								const value = parseFloat(value_mask.replace(/\./g,'').replace(/,/g,'.'));

								setParcelaCredito(value_mask);
								setParc(e => ({
									...e,
									par_acrescimo: !!e.par_acrescimo_perc ? value / 100 : value
								}));
							}}
						/>
					</label>
					<label className='percent'>
						<input
							type="checkbox"
							onChange={() => setParc(e => ({
								...e,
								par_acrescimo: !e.par_acrescimo_perc ? e.par_acrescimo / 100 : e.par_acrescimo * 100,
								par_acrescimo_perc: !e.par_acrescimo_perc
							}) )}
						/>
						<span>%</span>
					</label>
				</div>
			</div>
			<button type="submit" disabled={!taxa.tax_classe}>salvar taxa</button>
		</form>
	</>
}

export default App;
