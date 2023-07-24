import React, { useEffect, useMemo, useState } from 'react';
import { DropdownList, NumberPercentMask } from '../components';
import ArrowDown from '../components/icons/arrow_down-short.svg';
import ArrowUp from '../components/icons/arrow_up-short.svg';
import Connection from '../model';
const axios = Connection()

export default function CadastroTaxa() {
	const [ loading, setLoading ] = useState(false);
	const [ classe_loading, setClasseLoading ] = useState(false);

	const [ evento, setEvento ] = useState(null);
	const [ eventosList, setEventosList ] = useState([]);
	const [ classesList, setClassesList ] = useState([]);

	const [ taxaPadrao, setTaxaPadrao ] = useState('0,00');

	const [ dinheiro, setDinheiro ] = useState('0,00');
	const [ dinheiro_perc, setDinheiro_perc ] = useState(0);

	const [ credito, setCredito ] = useState('0,00');
	const [ credito_perc, setCredito_perc ] = useState(0);

	const [ debito, setDebito ] = useState('0,00');
	const [ debito_perc, setDebito_perc ] = useState(0);

	const [ pix, setPix ] = useState('0,00');
	const [ pix_perc, setPix_perc ] = useState(0);

	const [ parcelaMax, setParcelaMax ] = useState(1);

	const [ parcela, setParcela ] = useState('0,00');
	const [ parcela_perc, setParcela_perc ] = useState(0);

	const limite_parcelas = useMemo(() => {
		if(classesList.length > 0) {
			let limits = classesList.map(classe => {
				return Math.floor(parseFloat(classe.value.cla_valor));
			});

			return limits.reduce((prev, next) => {
				if(prev > next) prev = next;
				return prev;
			});
		}

		return 1;
	}, [classesList]);

	/**
	 * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e 
	 */
    function saveTaxa(e) {
		e.preventDefault();

		setLoading(true);
		axios.post(`save/taxa`, {
			evento: evento.value,
			classes: classesList.map(a => a.value)
		})
		.then(resp => {
			if(resp.data) {
				alert('Sobretaxa Salva')
			}
		})
		.finally(() => setLoading(false));
	}

	/**
	 * @param {number} evento 
	 */
	function getClasses(evento) {
		setClasseLoading(true);
		axios.post('classes', { evento })
		.then(resp => {
			setClassesList(resp.data.map(a => ({
				value: a,
				label: a.cla_nome
			})));
		})
		.finally(() => setClasseLoading(false));
	}

	/**
	 * @param {string} local 
	 * @param {string} prop 
	 * @param {string|number} valor 
	 */
	function updateAllTax(local, prop, valor) {
		classesList.map(classe => (
			classe.value.pdvs.map(pdv => {
				pdv[local][prop] = valor
				return pdv
			})
		));
	}

    useEffect(() => {
		let execute = true;

		axios.get('eventos')
		.then(resp => {
			if(!eventosList.length && execute) {
				setEventosList(resp.data.map(a => ({
					value: a,
					label: a.eve_nome
				})));
			}
		});

		return () => { execute = false; }
	}, [eventosList]);

	/**
	 * @param {{
	 * 	taxa: string,
	 * 	setTaxa: React.Dispatch<React.SetStateAction<string>>,
	 * 	onChange: (value: string) => void,
	 * 	percent: 0|1,
	 * 	setPercent: React.Dispatch<React.SetStateAction<0|1>>,
	 * 	onCheck: (perc: string) => void
	 * }} 
	 * @returns 
	 */
	function TaxaInput({
		taxa, setTaxa, onChange,
		percent, setPercent, onCheck
	}) {
		return <>
			{/* Taxa */}
			<td>
				<input
					type="text"
					className='money-percent'
					value={percent ? `${taxa} %` : `R$ ${taxa}`}
					onChange={a => {
						let value = NumberPercentMask(a.target.value, percent);

						setTaxa(value);
						onChange(value);
					}}
				/>
			</td>
			{/* % */}
			<td>
				<input
					type="checkbox"
					className='percent'
					checked={percent}
					onChange={() => {
						let perc = !percent ? 1 : 0;

						setPercent(perc);
						onCheck(perc);
					}}
				/>
			</td>
		</>
	}

	/**
	 * @param {{
	 * 	pdv: {
	 * 		pdv_id: number,
	 * 		pdv_nome: string,
	 * 		taxa: {
	 * 			tax_id: number,
	 * 			tax_classe: number,
	 * 			tax_dinheiro: string,
	 * 			tax_dinheiro_perc: 0|1,
	 * 			tax_credito: string,
	 * 			tax_credito_perc: 0|1,
	 * 			tax_debito: string,
	 * 			tax_debito_perc: 0|1,
	 * 			tax_pix: string,
	 * 			tax_pix_perc: 0|1,
	 * 			tax_pdv: number
	 * 		},
	 * 		"parcela": {
	 *			par_id: number,
	 *			par_mpgto: number,
	 *			par_max: number,
	 *			par_acrescimo: string,
	 *			par_acrescimo_perc: 0|1,
	 *			par_pdv: number,
	 *			par_classe: number
	 *		}
	 * 	},
	 * 	valor_ing: number,
	 * 	show: boolean
	 * }}  
	 * @returns 
	 */
	function TaxaFragment({ pdv, valor_ing, show }) {
		const [ dinheiro, setDinheiro ] = useState(NumberPercentMask(pdv.taxa.tax_dinheiro))
		const [ dinheiro_perc, setDinheiro_perc ] = useState(pdv.taxa.tax_dinheiro_perc)

		const [ credito, setCredito ] = useState(NumberPercentMask(pdv.taxa.tax_credito))
		const [ credito_perc, setCredito_perc ] = useState(pdv.taxa.tax_credito_perc)

		const [ debito, setDebito ] = useState(NumberPercentMask(pdv.taxa.tax_debito))
		const [ debito_perc, setDebito_perc ] = useState(pdv.taxa.tax_debito_perc)

		const [ pix, setPix ] = useState(NumberPercentMask(pdv.taxa.tax_pix))
		const [ pix_perc, setPix_perc ] = useState(pdv.taxa.tax_pix_perc);

		const [ parcelaMax, setParcelaMax ] = useState(pdv.parcela.par_max);

		const [ parcela, setParcela ] = useState(NumberPercentMask(pdv.parcela.par_acrescimo))
		const [ parcela_perc, setParcela_perc ] = useState(pdv.parcela.par_acrescimo_perc)

		const limite_parcelas = Math.floor(valor_ing);

		return <tr className={show ? '' : 'collapsed'}>
			{/* PDV */}
			<td>{pdv.pdv_nome}</td>

			{/* Dinheiro */}
			<TaxaInput
				taxa={dinheiro}
				setTaxa={setDinheiro}
				onChange={value => pdv.taxa.tax_dinheiro = value}
				percent={dinheiro_perc}
				setPercent={setDinheiro_perc}
				onCheck={perc => pdv.taxa.tax_dinheiro_perc = perc}
			/>

			{/* Crédito */}
			<TaxaInput
				taxa={credito}
				setTaxa={setCredito}
				onChange={value => pdv.taxa.tax_credito = value}
				percent={credito_perc}
				setPercent={setCredito_perc}
				onCheck={perc => pdv.taxa.tax_credito_perc = perc}
			/>

			{/* Débito */}
			<TaxaInput
				taxa={debito}
				setTaxa={setDebito}
				onChange={value => pdv.taxa.tax_debito = value}
				percent={debito_perc}
				setPercent={setDebito_perc}
				onCheck={perc => pdv.taxa.tax_debito_perc = perc}
			/>

			{/* PIX */}
			<TaxaInput
				taxa={pix}
				setTaxa={setPix}
				onChange={value => pdv.taxa.tax_pix = value}
				percent={pix_perc}
				setPercent={setPix_perc}
				onCheck={perc => pdv.taxa.tax_pix_perc = perc}
			/>

			{/* Parcelas Max */}
			<td>
				<input
					type="number"
					className='money-percent'
					max={limite_parcelas}
					min="0"
					value={parcelaMax}
					onChange={a => {
						let value = parseInt(!!a.target.value
							? a.target.value : 1
						);

						if(value <= limite_parcelas) {
							setParcelaMax(value);
							pdv.parcela.par_max = value;
						}
					}}
				/>
			</td>

			{/* Taxa Parcela */}
			<TaxaInput
				taxa={parcela}
				setTaxa={setParcela}
				onChange={value => pdv.parcela.par_acrescimo = value}
				percent={parcela_perc}
				setPercent={setParcela_perc}
				onCheck={perc => pdv.parcela.par_acrescimo_perc = perc}
			/>
		</tr>
	}

	/**
	 * @param {{
	 * 	classe: {
	 * 		label: string,
	 * 		value: {
	 * 			cla_cod: number,
	 * 			cla_nome: string,
	 * 			cla_valor: string,
	 * 			pdvs: {}[]
	 * 		}
	 * 	}
	 * }}  
	 * @returns 
	 */
	function ClasseFragment({ classe }) {
		const [ collapsed, setCollapsed ] = useState(true);
		
		let rowSpan = collapsed ? Object.keys(classe.value.pdvs).length +1 : 1;

		return <>
			<tr className='classe'>
				<td rowSpan={rowSpan}>
					<div>
						<button
							type='button'
							className='circle'
							onClick={() => setCollapsed(!collapsed)}
							title='Ocultar Classe'
						>
							<img src={collapsed ? ArrowDown : ArrowUp} alt=''/>
						</button>
						<p>{classe.label}</p>
					</div>
				</td>
				<td rowSpan={rowSpan}>
					<p>R$ {NumberPercentMask(classe.value.cla_valor, 0)}</p>
				</td>
			</tr>
			{classe.value.pdvs.map((pdv, index) => (
				<TaxaFragment
					key={index}
					pdv={pdv}
					valor_ing={parseFloat(classe.value.cla_valor)}
					show={collapsed}
				/>
			))}
			<tr className='table-separator'/>
		</>
	}

	return <>
		<form>
			<h2>Sobretaxa de Ingresso</h2>
			<label>
				<span>Evento: </span>
				<DropdownList
					data={eventosList}
					value={evento}
					placeholder={'Selecionar Evento...'}
					disabled={!eventosList.length}
					onChangeHandler={evento => {
						setEvento(evento);

						if(evento !== null) {
							getClasses(evento?.value.eve_cod);
							setTaxaPadrao(NumberPercentMask(evento?.value.eve_taxa_valor, 0));
						}
						else {
							setClassesList([]);
							setTaxaPadrao('0,00');
						}
					}}
				/>
			</label>
			
			<label>
				<span>Taxa Padrão:</span>
				<input
					type='text'
					className='money-percent'
					value={`R$ ${taxaPadrao}`}
					onChange={a => {
						let value = NumberPercentMask(a.target.value, 0);
						setTaxaPadrao(value);
						evento.value.eve_taxa_valor = value;
					}}
				/>
			</label>
			<button
				type='submit'
				disabled={loading || !evento}
				onClick={saveTaxa}
			>
				{loading ? 'Salvando...' : 'Salvar'}
			</button>
		</form>
        <table>
            <thead>
                <tr>
                    <th className='medium'>Classes</th>
                    <th className='small'>Valor Ingresso</th>
					<th className='large'>PDV</th>
					<th className='medium'>Dinheiro</th>
					<th className='small'>%</th>
					<th className='medium'>Crédito</th>
					<th className='small'>%</th>
					<th className='medium'>Débito</th>
					<th className='small'>%</th>
					<th className='medium'>PIX</th>
					<th className='small'>%</th>
					<th className='medium'>Parcelas Max</th>
					<th className='medium'>Taxa Parcela</th>
					<th className='small'>%</th>
                </tr>
            </thead>
            <tbody>
				<tr>
					<td colSpan={3}/>
					{/* Dinheiro */}
					<td>
						<input
							type="text"
							className='money-percent'
							value={dinheiro_perc ? `${dinheiro} %` : `R$ ${dinheiro}`}
							onChange={a => {
								let value = NumberPercentMask(a.target.value, dinheiro_perc);

								setDinheiro(value);
								updateAllTax('taxa', 'tax_dinheiro', value);
							}}
						/>
					</td>
					{/* % */}
					<td>
						<input
							type="checkbox"
							className='percent'
							checked={dinheiro_perc}
							onChange={() => {
								let perc = !dinheiro_perc ? 1 : 0;

								setDinheiro_perc(perc);
								updateAllTax('taxa', 'tax_dinheiro_perc', perc);
							}}
						/>
					</td>

					{/* Crédito */}
					<td>
						<input
							type="text"
							className='money-percent'
							value={credito_perc ? `${credito} %` : `R$ ${credito}`}
							onChange={a => {
								let value = NumberPercentMask(a.target.value, credito_perc);

								setCredito(value);
								updateAllTax('taxa', 'tax_credito', value);
							}}
						/>
					</td>
					{/* % */}
					<td>
						<input
							type="checkbox"
							className='percent'
							checked={credito_perc}
							onChange={() => {
								let perc = !credito_perc ? 1 : 0;

								setCredito_perc(perc);
								updateAllTax('taxa', 'tax_credito_perc', perc);
							}}
						/>
					</td>

					{/* Débito */}
					<td>
						<input
							type="text"
							className='money-percent'
							value={debito_perc ? `${debito} %` : `R$ ${debito}`}
							onChange={a => {
								let value = NumberPercentMask(a.target.value, debito_perc);

								setDebito(value);
								updateAllTax('taxa', 'tax_debito', value);
							}}
						/>
					</td>
					{/* % */}
					<td>
						<input
							type="checkbox"
							className='percent'
							checked={debito_perc}
							onChange={() => {
								let perc = !debito_perc ? 1 : 0;

								setDebito_perc(perc);
								updateAllTax('taxa', 'tax_debito_perc', perc);
							}}
						/>
					</td>

					{/* PIX */}
					<td>
						<input
							type="text"
							className='money-percent'
							value={pix_perc ? `${pix} %` : `R$ ${pix}`}
							onChange={a => {
								let value = NumberPercentMask(a.target.value, pix_perc);

								setPix(value);
								updateAllTax('taxa', 'tax_pix', value);
							}}
						/>
					</td>
					{/* % */}
					<td>
						<input
							type="checkbox"
							className='percent'
							checked={pix_perc}
							onChange={() => {
								let perc = !pix_perc ? 1 : 0;

								setPix_perc(perc);
								updateAllTax('taxa', 'tax_pix_perc', perc);
							}}
						/>
					</td>
					
					{/* Parcelas Max */}
					<td>
						<input
							type="number"
							className='money-percent'
							max={limite_parcelas}
							min="0"
							value={parcelaMax}
							onChange={a => {
								let value = parseInt(!!a.target.value
									? a.target.value : 1
								);

								if(value <= limite_parcelas) {
									setParcelaMax(value);
									updateAllTax('parcela', 'par_max', value);
								}
							}}
						/>
					</td>

					{/* Taxa Parcela */}
					<td>
						<input
							type="text"
							className='money-percent'
							value={parcela_perc ? `${parcela} %` : `R$ ${parcela}`}
							onChange={a => {
								let value = NumberPercentMask(a.target.value, parcela_perc);

								setParcela(value);
								updateAllTax('parcela', 'par_acrescimo', value);
							}}
						/>
					</td>
					{/* % */}
					<td>
						<input
							type="checkbox"
							className='percent'
							checked={parcela_perc}
							onChange={() => {
								let perc = !parcela_perc ? 1 : 0;

								setParcela_perc(perc);
								updateAllTax('parcela', 'par_acrescimo_perc', perc);
							}}
						/>
					</td>
				</tr>
				<tr className='table-separator'/>
				{!!classesList.length && classesList.map((classe, index) => {
					return <ClasseFragment
						key={index}
						classe={classe}
					/>
				})}
				{!!evento && classesList.length === 0 && !classe_loading && <tr>
					<th colSpan={13}>
						Sem ingressos alocados
					</th>
				</tr>}
            </tbody>
        </table>
	</>
}