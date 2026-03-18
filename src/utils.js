export const isJsonString = (data) => {
    try {
        JSON.parse(data)
    } catch (error) {
        return false
    }
    return true
}

export const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

export function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

export const renderOptions = (arr) => {
    let results = []
    if (arr) {
        results = arr?.map((opt) => {
            return { value: opt, label: opt }
        })
    }
    results.push({ label: 'Thêm mới', value: 'add_type' })
    return results
}

export const convertPrice = (price) => {
    try {
        const result = price?.toLocaleString().replaceAll(',', '.')
        return `${result} VNĐ`
    } catch (error) {
        return null
    }
}

export const convertDataChart = (data = [], type) => {
    if (!Array.isArray(data) || !type) return []
    const grouped = {}
    data.forEach((item) => {
        const key = item?.[type]
        if (key) {
            grouped[key] = (grouped[key] || 0) + 1
        }
    })
    return Object.keys(grouped).map((key) => {
        let name = key
        if (type === 'paymentMethod') {
            if (key === 'later_money') name = 'Tiền mặt'
            if (key === 'chuyen_khoan') name = 'QR Chuyển khoản'
        }
        return { name, value: grouped[key] }
    })
}