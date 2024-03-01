import { DeleteOutlined } from '@ant-design/icons';
import { Button, Table, Tooltip, Typography } from 'antd';
import Search from 'antd/es/input/Search';
import { get, getDatabase, ref, remove, set } from 'firebase/database';
import { filter, isEmpty } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import ListingSkeletonTable from '../../Common/ListingSkeletonTable';
import useForm from '../../Common/useForm';
import { formatNumberNav, formatPriceRuleListAssets } from './../../Common';
import AddProductDialog from './AddProductDialog';
import OrderDay from './OrderDay';
const { Title } = Typography;
function Product() {
  const [db, setDb] = useState();
  const [data, setData] = useState([]);
  const [dataNotEdit, setDataNotEdit] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    setDb(db);
  }, []);

  const [dialogAddProduct, setDialogAddProduct] = useState(false);
  const { formList, onSubmitForm, payload, resetForm } = useForm();
  const [dialogOrderDay, setDialogOrderDay] = useState(false);
  const columns = [
    Table.EXPAND_COLUMN,
    {
      title: 'STT',
      key: 'STT',
      width: '80px',
      align: 'center',
      render: (text, object, index) => {
        return <div>{index + 1}</div>;
      }
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'id',
      key: 'id',
      align: 'center'
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      align: 'center'
    },
    {
      title: 'Tên loại sản phẩm',
      dataIndex: 'typeName',
      key: 'typeName',
      align: 'center'
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: value => {
        if (parseInt(value) < 20) {
          return (
            <div style={{ textAlign: 'right', color: 'red' }}>
              {formatPriceRuleListAssets(formatNumberNav(value.toString()))}
            </div>
          );
        } else {
          return (
            <div style={{ textAlign: 'right', color: '#1677ff' }}>
              {formatPriceRuleListAssets(formatNumberNav(value.toString()))}
            </div>
          );
        }
      },
      sorter: (a, b) => a.quantity - b.quantity
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: value => {
        if (parseInt(value) < 20) {
          return (
            <div style={{ textAlign: 'right', color: 'red' }}>
              {formatPriceRuleListAssets(formatNumberNav(value.toString()))}
            </div>
          );
        } else {
          return (
            <div style={{ textAlign: 'right', color: '#1677ff' }}>
              {formatPriceRuleListAssets(formatNumberNav(value.toString()))}
            </div>
          );
        }
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (text, record, index) => {
        return (
          <Tooltip title="Xóa">
            <Button
              shape="circle"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDeteleItem(record)}
            />
          </Tooltip>
        );
      }
    }
  ];
  const fetchData = () => {
    setLoading(true);
    const refers = ref(db, 'product/');
    get(refers)
      .then(snapshot => {
        const value = snapshot.val();
        if (value) {
          const arrValue = Object.values(value);
          setData([...arrValue]);
          setDataNotEdit([...arrValue]);
        } else {
          setData([]);
          setDataNotEdit([]);
        }
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!payload) return;
    const { id } = payload;

    try {
      const refers = ref(db, 'product/' + id);
      set(refers, payload);
      setDialogAddProduct(false);
      fetchData();
      formList.resetFields();
    } catch {}
  }, [payload]);

  useEffect(() => {
    if (!db) return;
    fetchData();
  }, [db]);

  const handleDeteleItem = item => {
    const refers = ref(db, 'product/' + item.id);
    remove(refers)
      .then(() => {
        toast.success('Xóa thành công', {
          position: 'top-right',
          autoClose: 2000,
          theme: 'light'
        });
        fetchData();
      })
      .catch(() => {
        toast.error('Xóa thất bại. vui lòng thử lại', {
          position: 'top-right',
          autoClose: 2000,
          theme: 'light'
        });
      });
  };
  const handleFillter = e => {
    if (isEmpty(e.target.value)) {
      setData([...dataNotEdit]);
      return;
    }
    const filterDataname = filter(
      dataNotEdit,
      item =>
        item.productName.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1
    );
    setData([...filterDataname]);
  };

  const dataSource = useMemo(() => {
    const listProduct = [];
    data.forEach(item => {
      item.productTypes.forEach(itemTypeProduct => {
        const product = {
          ...item,
          ...itemTypeProduct
        };
        listProduct.push(product);
      });
    });
    return listProduct;
  }, [data]);
  return (
    <div>
      <CustomTitle>
        <Title level={3}>Danh sách sản phẩm</Title>
      </CustomTitle>
      <WrapperGroup>
        <Button type="primary" onClick={() => setDialogAddProduct(true)}>
          Thêm sản phẩm
        </Button>
        <Button
          type="primary"
          className="ml-2"
          danger
          onClick={() => setDialogOrderDay(true)}>
          Xuất kho
        </Button>
      </WrapperGroup>
      <div>
        <div style={{ fontWeight: '500' }}>Tìm kiếm sản phẩm</div>
        <Search
          placeholder="Nhập tên sản phẩm"
          onChange={handleFillter}
          style={{ marginTop: '20px', marginBottom: '20px' }}
        />
      </div>
      {loading ? (
        <ListingSkeletonTable columns={columns} size={3} />
      ) : (
        <StyledTable
          columns={columns}
          bordered
          pagination={false}
          dataSource={dataSource}
          scroll={{
            y: 600
          }}
        />
      )}

      <AddProductDialog
        formList={formList}
        onSubmitForm={onSubmitForm}
        payload={payload}
        resetForm={resetForm}
        dialogAddProduct={dialogAddProduct}
        setDialogAddProduct={setDialogAddProduct}
      />
      <OrderDay
        dataProduct={data}
        dialogOrderDay={dialogOrderDay}
        setDialogOrderDay={setDialogOrderDay}
        db={db}
        fetchData={fetchData}
      />
    </div>
  );
}

export default Product;
const CustomTitle = styled.div`
  text-align: center;
`;
const WrapperGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px;
`;
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
  .ant-pagination {
    display: none !important;
  }
`;
