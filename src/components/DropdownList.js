import React from 'react';
import Select from 'react-select';

export default function DropdownList({
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