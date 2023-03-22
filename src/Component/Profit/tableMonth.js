import { Table } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { get, getDatabase, ref } from "firebase/database";
import { formatMoney, formatNumberNav } from '../../Common';

function TableMonth() {
  const now = dayjs();
const startOfMonth = now.startOf('year');
const diffInYears = now.diff(startOfMonth, 'month');
// console.log(diffInYears);
    const columns =[
        {
            dataIndex: 'month',
            title:'Tháng',
        },
        {   
            dataIndex:'totalMonth',
            title:'Tổng tiền',
            render:(record)=>formatMoney(record)
        },
        {
            title:'doanh thu thực tế',
        }
    ]
    // const data = [];
    const [dataTable, setDataTable] = useState([]);
    const [db, setDb] = useState();
     useEffect(() => {
    const db = getDatabase();
    setDb(db);
  }, []);
  useEffect(() => {
    const fetchDataTable = () => {
      // setLoading(true);
      const refers = ref(db, "order/");
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
          } else {
            setDataTable([]);
            // setLoading(true);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    };
    fetchDataTable();
  }, []);
  const [dataDay,setDataDay]=useState([])
  
  useEffect(()=>{
  const data=[]
  for (let i = 0; i < diffInYears+1; i++) {
   const diffMonth= dayjs(dayjs().subtract(diffInYears-i, 'month').format('DD-MM-YYYY'),'DD-MM-YYYY').month();
  data.push(diffMonth+1);
  setDataDay([...data]);
}
},[])
// console.log(dataDay);
const [totalMoney,setTotalMoney]=useState()

useEffect(()=>{
  if(!dataTable||!dataDay)return
  let moneyMonth=[]
dataDay.forEach((itemData)=>{
 const dataMonth=dataTable.filter((item)=>
 (dayjs(dayjs(item.date).format('DD-MM-YYYY'),'DD-MM-YYYY').month()+1)===itemData)
let total = 0;
          dataMonth.forEach(item =>{
            total = total + parseFloat((item.total).replace(',', '')) 
        })
          moneyMonth.push({totalMonth:total,month:itemData})
return moneyMonth
})

setTotalMoney(moneyMonth);
},[dataDay,dataTable]);

  return (
    <Table
    columns={columns}
    dataSource={totalMoney}
    pagination={false}
    scroll={{ y: 700 }}
    />
  )
}

export default TableMonth
