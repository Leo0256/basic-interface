import React, { useEffect, useState } from 'react';
import Taxa from './Taxa';
import { DropdownList, NumberPercentMask } from '../components';
import Connection from '../model';
const axios = Connection()

export default function CadastroTaxa() {
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
		par_max: 1,
		par_acrescimo: 0,
		par_acrescimo_perc: 0,
		par_classe: null
	})
	const [ resp, setResp ] = useState();

    const [ pdvsList, setPdvsList ] = useState([]);
	const [ eventosList, setEventosList ] = useState([]);
	const [ classesList, setClassesList ] = useState([]);
	const [ pdv, setPdv ] = useState(null);
	const [ evento, setEvento ] = useState(null);
	const [ classe, setClasse ] = useState(null);
	const [ maxParc, setMaxParc ] = useState(1);

	const [ dinheiro, setDinheiro ] = useState('0,00')
	const [ credito, setCredito ] = useState('0,00')
	const [ debito, setDebito ] = useState('0,00')
	const [ pix, setPix ] = useState('0,00')
	const [ parcelaCredito, setParcelaCredito ] = useState('0,00')

    function saveTaxa(e) {
		e.preventDefault();

		axios.post(`saveTaxa`, { taxa, parc })
		.then(resp => {
			setResp({
                ...resp.data,
                pdv: pdv.value.pdv_nome,
                evento: evento.value.eve_nome,
                classe: classesList.find(a => a.value.cla_cod === taxa.tax_classe)?.value
            })
		})
	}

	function getEventos(pdv) {
		axios.post(`getEventos`, { pdv })
		.then(resp => {
			setEventosList(resp.data.map(a => ({
				value: a,
				label: a.eve_nome
			})))
		})
	}

	function getClasses(evento) {
		axios.post(`getClasses`, {
			evento,
			pdv: pdv?.value.pdv_id ?? null
		})
		.then(resp => {
			setClassesList(resp.data.map(a => ({
				value: a,
				label: a.cla_nome
			})))
		})
	}

    useEffect(() => {
		axios.get(`getPdvs`)
		.then(resp => {
			setPdvsList(resp.data.map(a => ({
				value: a,
				label: a.pdv_nome
			})))
		})
	}, []);

	return <>
		<form onSubmit={saveTaxa}>
			<h2>Sobretaxa de Ingresso</h2>
			<label>
				<span>PDV: </span>
				<DropdownList
					data={pdvsList}
					value={pdv}
					placeholder="Selecionar PDV..."
					disabled={false}
					onChangeHandler={a => {
						setPdv(a)

						if(a !== null) {
							getEventos(a?.value.pdv_id)
						}
						else {
							setEventosList([])
							setEvento(null)
							setClassesList([])
							setClasse(null)
						}
					}}
				/>
			</label>

			<label>
				<span>Evento: </span>
				<DropdownList
					data={eventosList}
					value={evento}
					placeholder={!eventosList.length ? 'Sem eventos alocados' : 'Selecionar Evento...'}
					disabled={!eventosList.length}
					onChangeHandler={a => {
						setEvento(a)

						if(a !== null) {
							getClasses(a?.value.eve_cod)
						}
						else {
							setClassesList([])
							setClasse(null)
						}
					}}
				/>
			</label>
		
			<label>
				<span>Classe: </span>
				<DropdownList
					data={classesList}
					value={classe}
					placeholder={!classesList.length ? 'Sem classes alocadas' : 'Selecionar Classe...'}
					disabled={!classesList.length}
					onChangeHandler={a => {
						setClasse(a)

						setTaxa(e => ({
							...e,
							tax_classe: a?.value.cla_cod ?? null
						}))

						setParc(e => ({
							...e,
							par_classe: a?.value.cla_cod ?? null
						}))

						if(a !== null) {
							setMaxParc(() => {
								var max = Math.trunc(a?.value.cla_valor)
	
								return max < 2 ? 1 : max
							})
						}
						else {
							setMaxParc(1)
						}
					}}
				/>
			</label>

			<div className='input'>
				<label>
					<span>Dinheiro: </span>
					<input
						type="text"
						className='money-percent'
						value={taxa.tax_dinheiro_perc ? `${dinheiro} %` : `R$ ${dinheiro}`}
						onChange={a => {
							const value_mask = NumberPercentMask(a.target.value, taxa.tax_dinheiro_perc);
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
						className='money-percent'
						value={taxa.tax_credito_perc ? `${credito} %` : `R$ ${credito}`}
						onChange={a => {
							const value_mask = NumberPercentMask(a.target.value, taxa.tax_credito_perc);
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
						className='money-percent'
						value={taxa.tax_debito_perc ? `${debito} %` : `R$ ${debito}`}
						onChange={a => {
							const value_mask = NumberPercentMask(a.target.value, taxa.tax_debito_perc);
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
						className='money-percent'
						value={taxa.tax_pix_perc ? `${pix} %` : `R$ ${pix}`}
						onChange={a => {
							const value_mask = NumberPercentMask(a.target.value, taxa.tax_pix_perc);
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

			<div className='box'>
				<p>Parcelas de Crédito</p>
				<hr/>

				<label>
					<span>Máximo de parcelas: </span>
					<input
						type="number"
						className='money-percent'
						max={maxParc}
						min="1"
                        defaultValue={1}
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
							className='money-percent'
							value={parc.par_acrescimo_perc ? `${parcelaCredito} %` : `R$ ${parcelaCredito}`}
							onChange={a => {
								const value_mask = NumberPercentMask(a.target.value, parc.par_acrescimo_perc);
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
			<button type="submit" disabled={!classe}>salvar taxa</button>
		</form>

        {!!resp && <Taxa data={resp}/>}
	</>
}