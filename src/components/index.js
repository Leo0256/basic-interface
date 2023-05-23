import React from 'react';
import Select from 'react-select';

export function DropdownList({
    data,
    value,
    disabled,
    loading,
    placeholder,
    onChangeHandler
}) {

    const styles = {
        container: style => ({
            ...style,
            width: '100%'
        }),
        control: style => ({
            ...style,
            backgroundColor: disabled ? '#ccc' :  'white',
            flexDirection: 'row'
        }),
        indicatorsContainer: style => ({ ...style, flexDirection: 'row' })
    }

    return <div className='list'>
        <Select
            isSearchable={true}
            isClearable={true}
            isDisabled={disabled}
            isLoading={loading ?? false}
            placeholder={placeholder}
            onChange={e => onChangeHandler(e ?? null)}
            value={value}
            options={data}
            styles={styles}
        />
    </div>
}

export function NumberPercentMask(value, percent) {
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