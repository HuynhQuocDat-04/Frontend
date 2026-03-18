import { useEffect, useState } from "react"

// Hook nhận vào giá trị cần theo dõi và thời gian chờ
export const useDebounce = (value, delay) => {
    const [valueDebounce, setValueDebounce] = useState('')

    useEffect(() => {
        // Thiết lập bộ đếm thời gian
        const handle = setTimeout(() => {
            setValueDebounce(value)
        }, delay)

        // Nếu người dùng tiếp tục gõ, xóa bộ đếm cũ và bắt đầu lại từ đầu
        return () => {
            clearTimeout(handle)
        }
    }, [value, delay])

    return valueDebounce // Trả về giá trị cuối cùng sau khi đã dừng gõ
}