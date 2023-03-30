import { DeleteOutlined } from "@ant-design/icons";
import { Button, Table, Tooltip } from "antd";
import { get, getDatabase, ref, remove, set } from "firebase/database";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import ListingSkeletonTable from "../../Common/ListingSkeletonTable";
import { default as useForm } from "../../Common/useForm";
import DialogMarketing from "./DialogMarketing";

import dayjs from "dayjs";
import _ from "lodash";
import {
  formatDDtoValue,
  formatNumberNav,
  formatPriceRuleListAssets,
} from "../../Common";

function Marketing(props) {
  const { formList, onSubmitForm, resetForm, payload } = useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);

  const [db, setDb] = useState();
  useEffect(() => {
    const db = getDatabase();
    setDb(db);
  }, []);
  useEffect(() => {
    if (!db) return;
    fetchDataTable();
  }, [db]);
  useEffect(() => {
    if (!payload) return;
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );
    const id = nanoid();
    const refers = ref(db, "marketing/" + id);
    set(refers, {
      ...payload,
      dateCampaign: formatDDtoValue(payload.date),
    })
      .then(() => {
        toast.success("Tạo chiến dịch thành công", {
          position: "top-center",
          autoClose: 2000,
          theme: "light",
        });
        formList.resetFields();
        setOpen(false);
      })
      .finally(() => {
        fetchDataTable();
      });
  }, [payload]);

  const fetchDataTable = () => {
    setLoading(true);
    const refers = ref(db, "marketing/");
    get(refers)
      .then((snapshot) => {
        const value = snapshot.val();
        if (value) {
          let data = [];
          for (const [key, value1] of Object.entries(value)) {
            let arr = {};
            arr = {
              id: key,
              ...value1,
            };
            data.push(arr);
          }
          data = _.reverse(
            _.sortBy(data, [
              function (o) {
                return o.dateCampaign;
              },
            ])
          );
          setDataTable([...data]);
        } else {
          setDataTable([]);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleDeteleItem = (item) => {
    const { id } = item;
    const refers = ref(db, "marketing/" + id);
    remove(refers)
      .then(() => {
        toast.success("Xóa thành công", {
          position: "top-right",
          autoClose: 2000,
          theme: "light",
        });
        fetchDataTable();
      })
      .catch(() => {
        toast.error("Xóa thất bại. vui lòng thử lại", {
          position: "top-right",
          autoClose: 2000,
          theme: "light",
        });
      });
  };
  const columns = [
    {
      title: "STT",
      key: "STT",
      width: "100px",
      render: (text, object, index) => {
        return <div>{index + 1}</div>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "dateCampaign",
      key: "dateCampaign",
      render: (value) => {
        return dayjs(value).format("DD-MM-YYYY");
      },
      align: "center",
    },
    {
      title: "Tên chiến dịch",
      dataIndex: "nameCampaign",
      key: "nameCampaign",
      align: "center",
    },
    {
      title: "Chi phí",
      dataIndex: "priceCampaign",
      render: (value) => {
        return (
          <div style={{ textAlign: "right" }}>
            {formatPriceRuleListAssets(formatNumberNav(value.toString()))}
          </div>
        );
      },
    },

    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      align: "center",
      render: (text, record) => (
        <div className="flex justify-center">
          <Tooltip title="Xóa">
            <Button
              shape="circle"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDeteleItem(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  return (
    <div>
      <Wrapper>
        <CustomButton>
          <Button type="primary" onClick={() => setOpen(true)}>
            Chiến dịch mới
          </Button>
        </CustomButton>
      </Wrapper>
      {loading ? (
        <ListingSkeletonTable columns={columns} size={3} />
      ) : (
        <div>
          <div className="mb-3 ml-2 bold">
            {`Tổng đơn hàng ${dataTable.length}`}{" "}
          </div>
          <StyledTable
            columns={columns}
            bordered
            pagination={false}
            dataSource={dataTable}
            scroll={{
              y: 600,
            }}
          />
        </div>
      )}
      <DialogMarketing
        open={open}
        formList={formList}
        onSubmitForm={onSubmitForm}
        resetForm={resetForm}
        setOpen={setOpen}
        db={db}
      />
    </div>
  );
}

export default Marketing;
const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const CustomButton = styled.div`
  display: flex;
  justify-content: flex-end;
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
