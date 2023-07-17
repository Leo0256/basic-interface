/**
 * @param {string|number} value 
 * @param {boolean} percent 
 * @returns 
 */
export default function NumberPercentMask(value, percent) {
    const percentMask = (text) => {
        if(percent) {
            if(text.includes('%'))
                return text.replace('%', '').trim()
            return text.trim().slice(0, -1)
        }

        return text.replace('R$', '').trim()
    }

    const number_aux = percentMask(value.toString()).replace(/\./, '').replace(/,/, '').replace(/\D/g, '');

    return new Intl.NumberFormat(
        'pt-BR',
        { minimumFractionDigits: 2 }
    )
    .format(parseFloat(!!number_aux ? number_aux : 0) / 100);
}