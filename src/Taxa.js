import React from 'react';

export default function Taxa({ data }) {
    var {
        taxa,
        parcela,
        classe
    } = data;

    function moneyFormat(value) {
        const format = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(value);
        return `R$ ${format}`;
    }

    function taxFormat(value, percent) {
        if(percent) {
            const aux = moneyFormat(
                parseFloat(classe.cla_valor) * parseFloat(value)
            );
            return `${aux} (${parseFloat(value) * 100}%)`;
        }

        return moneyFormat(parseFloat(value));
    }

    return <div className='form-result box'>
        <p><b>Taxa Registrada</b></p>
        <hr/>
        <p><b>PDV:</b> {data?.pdv}</p>
        <p><b>Evento:</b> {data?.evento}</p>
        <p><b>Classe:</b> {classe?.cla_nome}</p>
        <p><b>Valor Ingresso:</b> {moneyFormat(classe?.cla_valor)}</p>
        <p><b>Taxa:</b></p>
        <div className='box'>
            <p><b>Dinheiro:</b> {taxFormat(taxa?.tax_dinheiro, taxa?.tax_dinheiro_perc)}</p>
            <p><b>Crédito:</b> {taxFormat(taxa?.tax_credito, taxa?.tax_credito_perc)}</p>
            <p><b>Débito:</b> {taxFormat(taxa?.tax_debito, taxa?.tax_debito_perc)}</p>
            <p><b>Pix:</b> {taxFormat(taxa?.tax_pix, taxa?.tax_pix_perc)}</p>
        </div>
        <p><b>Parcelas de Crédito:</b></p>
        <div className='box'>
            <p><b>Máximo de Parcelas:</b> {parcela?.par_max}</p>
            <p><b>Valor:</b> {taxFormat(parcela?.par_acrescimo, parcela?.par_acrescimo_perc)}</p>
        </div>
    </div>
}