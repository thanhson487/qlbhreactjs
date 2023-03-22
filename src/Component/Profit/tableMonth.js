import { Table } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { get, getDatabase, ref } from "firebase/database";
import { formatMoney, formatNumberNav } from "../../Common";
import { CSVLink } from "react-csv";
import { ExportOutlined } from "@ant-design/icons";

function TableMonth() {
  const [totalMoney, setTotalMoney] = useState();
  const [dataTable, setDataTable] = useState([]);
  const [dataMarketing, setDataMarketing] = useState([]);
  const [db, setDb] = useState();
  const [loading, setLoading] = useState(false);
  const now = dayjs();
  const startOfMonth = now.startOf("year");
  const diffInYears = now.diff(startOfMonth, "month");
  const columns = [
    {
      dataIndex: "month",
      title: "Tháng",
    },
    {
      dataIndex: "totalMonth",
      title: "Tổng tiền",
      render: (record) => formatMoney(record),
    },
    {
      dataIndex: "totalProfit",
      title: "doanh thu thực tế",
      render: (record) => formatMoney(record),
    },
  ];

  useEffect(() => {
    const db = getDatabase();
    setDb(db);
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchData = () => {
      const refers = ref(db, "order/");
      const refersMar = ref(db, "marketing/");
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
                date: dayjs(
                  dayjs(value1.date, "DD-MM-YYYY").format("YYYY-MM-DD")
                ).valueOf(),
              };
              data.push(arr);
            }

            setDataTable([...data]);
            setLoading(false);
          } else {
            setDataTable([]);
            setLoading(true);
          }
        })
        .catch((err) => {
          console.error(err);
        });

      get(refersMar)
        .then((snapshot) => {
          const value = snapshot.val();
          if (value) {
            let data = [];
            for (const [key, value1] of Object.entries(value)) {
              data.push(value1);
            }
            setDataMarketing([...data]);
          } else {
            setDataMarketing([]);
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {});
    };
    db && fetchData();
  }, [db]);
  const [dataDay, setDataDay] = useState([]);

  useEffect(() => {
    const data = [];
    for (let i = 0; i < diffInYears + 1; i++) {
      const diffMonth = dayjs(
        dayjs()
          .subtract(diffInYears - i, "month")
          .format("DD-MM-YYYY"),
        "DD-MM-YYYY"
      ).month();
      data.push(diffMonth + 1);
      setDataDay([...data]);
    }
  }, []);

  useEffect(() => {
    if (!dataTable || !dataDay||!dataMarketing) return;

   
    let moneyMonth = [];
    dataDay.forEach((itemData) => {
      
      const dataMonth = dataTable.filter((item) => {
        return (
          dayjs(dayjs(item.date).format("DD-MM-YYYY"), "DD-MM-YYYY").month() +
            1 ===
          itemData
        );
      });

      const dataMarketingMonth = dataMarketing.filter((item) => {
        console.log(item.dateCampaign);
        return (
          dayjs(
            dayjs(item.dateCampaign).format("DD-MM-YYYY"),
            "DD-MM-YYYY"
          ).month() + 1  ===
          itemData
        );
      });
    
      let total = 0;
      let totalProfit = 0;
      dataMonth.forEach((item) => {
        total = total + parseInt(item.total.replace(",", "") || 0);
        totalProfit = totalProfit + parseInt(item?.interest || 0);
     
      });
      dataMarketingMonth.forEach((items) => {
        totalProfit = totalProfit - parseInt(items?.priceCampaign || 0);
        console.log(totalProfit,parseInt(items?.priceCampaign))
      });
      moneyMonth.push({ totalMonth: total, month: itemData, totalProfit });
      return moneyMonth;
    });

    setTotalMoney(moneyMonth);
  }, [dataDay, dataTable, dataMarketing]);


  const headers = [
    { label: "Tháng ", key: "Month" },
    { label: "Doanh thu thực tế", key: "totalMonth" },
    { label: "Lãi lỗ", key: "totalProfit" },
  ];

  return (
    <>
      <div class="text-base my-3">
      {totalMoney&&  <CSVLink data={totalMoney} headers={headers}>
          <ExportOutlined /> Xuất Excel
        </CSVLink>} 
      </div>

      <Table
        columns={columns}
        dataSource={totalMoney}
        pagination={false}
        scroll={{ y: 700 }}
        loading={loading}
      />
    </>
  );
}

export default TableMonth;
