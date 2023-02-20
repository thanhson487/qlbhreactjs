import { Table } from "antd";
import styled from "styled-components";

function Product() {
   const dataSource = [
  {
    key: '1',
    name: 'Máy cạo râu PS197',
    total: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
];

const columns = [
  {
    title: 'Tên sản phẩm',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

  return (
    <div>
       <StyledTable  columns={columns}     pagination={false}  dataSource={dataSource}>

       </StyledTable>
    </div>
  );
}

export default Product;
const StyledTable = styled(Table)`
  .ant-table-container {
    border: 1px solid #f0f0f0 !important;
  }
  .ant-table-selection-column > .ant-checkbox-wrapper {
    display: inline-flex !important;
  }
  .ant-table-cell {
    padding: 8px 16px !important;
  }
  .ant-checkbox-indeterminate .ant-checkbox-inner::after {
    background-color: white;
  }
  .ant-pagination{
    display: none !important;
  }
`;