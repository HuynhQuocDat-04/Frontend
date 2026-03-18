import { Table } from 'antd';
import React from 'react'

const TableComponent = (props) => {
    const { selectionType = 'checkbox', data = [], columns = [], handleDelteMany, setListSelected, selectedRowKeys } = props

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys) => {
            setListSelected(selectedRowKeys)
        },
    };

    return (
        <div>
            {handleDelteMany && (
                <div style={{
                    background: '#1d1d1d', color: '#fff', fontWeight: 'bold',
                    padding: '10px', cursor: 'pointer', width: 'fit-content', marginBottom: '10px'
                }} onClick={handleDelteMany}>
                    Xóa tất cả
                </div>
            )}
            <Table
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={data}
                {...props}
            />
        </div>
    )
}

export default TableComponent