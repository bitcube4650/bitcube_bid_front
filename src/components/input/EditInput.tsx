import React from 'react';
import { EditInputProps } from 'components/types'

/**
 * @param props 
    editData: MapType;
    setEditData: Dispatch<SetStateAction<MapType>>;
    type?: string;
    className?: string;
    defaultValue?: string;
    placeholder?: string;
    name?: string;
    maxLength?: number;
    readOnly?: boolean;
    disabled?: boolean;
 * @returns 
 */
const EditInput = (props: EditInputProps) => {
    const onFormEventSrcData = (e: React.FormEvent<HTMLInputElement>) => {
        props.setEditData({
            ...props.editData,
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    return (
        <input type={ props.type?props.type:"text" } className={ "inputStyle " + (props.className?props.className:"") }
            defaultValue={ props.defaultValue } placeholder={ props.placeholder }
            name={ props.name } maxLength={ props.maxLength }
            readOnly={ props.readOnly } disabled={ props.disabled }
            onKeyUp={ onFormEventSrcData }
        />
    )
}

export default EditInput;