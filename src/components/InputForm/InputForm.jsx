import React from 'react'
import { WrapperInputStyle } from './style'

const InputForm = (props) => {
    const { placeholder = 'Nhập text', ...rests } = props
    
    // Hàm này bắt sự kiện gõ phím và truyền value ra ngoài
    const handleOnchangeInput = (e) => {
        props.onChange(e.target.value)
    }
    
    return (
        <WrapperInputStyle 
            placeholder={placeholder} 
            value={props.value} 
            {...rests} 
            onChange={handleOnchangeInput} 
        />
    )
}

export default InputForm