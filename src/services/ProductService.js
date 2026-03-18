import axios from "axios"

export const getAllProduct = async (search, limit) => {
    let res = {}
    if (search?.length > 0) {
        res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/product/get-all?filter=name&filter=${search}&limit=${limit}`)
    } else {
        res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/product/get-all?limit=${limit}`)
    }
    return res.data
}

export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/product/get-details/${id}`)
    return res.data
}

export const createProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/product/create`, data)
    return res.data
}

export const updateProduct = async (id, access_token, data) => {
    const res = await axios.put(`${process.env.REACT_APP_API_URL_BACKEND}/product/update/${id}`, data, {
        headers: { token: `Bearer ${access_token}`, }
    })
    return res.data
}

export const deleteProduct = async (id, access_token) => {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL_BACKEND}/product/delete/${id}`, {
        headers: { token: `Bearer ${access_token}`, }
    })
    return res.data
}

export const deleteManyProduct = async (data, access_token) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL_BACKEND}/product/delete-many`, data, {
        headers: { token: `Bearer ${access_token}`, }
    })
    return res.data
}

export const getAllTypeProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/product/get-all-type`)
    return res.data
}

// Bổ sung tham số page và limit vào hàm
export const getProductType = async (type, page, limit) => {
    if (type) {
        // Gắn thêm query params limit và page vào URL API
        const res = await axios.get(`${process.env.REACT_APP_API_URL_BACKEND}/product/get-all?filter=type&filter=${type}&limit=${limit}&page=${page}`)
        return res.data
    }
}