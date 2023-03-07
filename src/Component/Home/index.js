import { Card, Col, DatePicker, Row } from "antd";
import { get, getDatabase, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { formatNumberNav, formatPriceRuleListAssets } from "../../Common";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
function Home() {

  const [db, setDb] = useState();
  const [dataTable,setDataTable] = useState([])
  const [loading,setLoading]= useState(false)


   const rangePresets = [
  {
    label: 'Last 7 Days',
    value: [dayjs().add(-7, 'd'), dayjs()],
  },
  {
    label: 'Last 30 Days',
    value: [dayjs().add(-30, 'd'), dayjs()],
  },
];
  const [fromDate,setFromDate] = useState()
  const [toDate,setToDate] = useState()
  const [revenue,setRevenue]=useState(0)
  const [totalToday,setToTalToday]=useState()
   const [dataWaitting,setDataWaiting]=useState()
   const[dataSendding,setDataSending]=useState()
const onRangeChange = (dates,dateStrings) => {
  if (dates) {
    setFromDate(dayjs(dateStrings[0]).valueOf())
    setToDate(dayjs(dateStrings[1]).valueOf())
    
  } else {
    setRevenue(0)
  }
};

  useEffect(() => {
    const db = getDatabase();
    setDb(db);
  }, []);
  const fetchDataTable = () => {

  setLoading(true);
    const refers = ref(db, "order/");
    get(refers)
      .then((snapshot) => {
        const value = snapshot.val();
        if (value) {
          const data=[]
           for (const [key, value1] of Object.entries(value)) {
            let arr={}
            arr={id:key,...value1}
            data.push(arr)
          }
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
  useEffect(()=>{
    if(!db) return;
    fetchDataTable()
  },[db])
   
   let total = 0
  useEffect(()=>{
    if(!dataTable) return
 const today=dayjs(dayjs().format('YYYY-MM-DD')).valueOf()
  const dataToDay= dataTable.filter((item) =>{ 
     const dateCurrent= dayjs(dayjs(item?.date,"DD-MM-YYYY").format('YYYY-MM-DD')).valueOf()
   return  dateCurrent===today
    })
  dataToDay.forEach((item) =>{total=total+ formatNumberNav(item?.total)  ; })
         setToTalToday(total)

  const waitStatus= dataTable.filter((item) =>item?.status==='waitting')
  setDataWaiting(waitStatus)
  const sendStatus= dataTable.filter((item) =>item?.status==='sending')
  setDataSending(sendStatus)
  },[dataTable])

  let totalAll=0
  useEffect(()=>{
    if(!fromDate&&!toDate) return;
 const dataDate= dataTable.filter((item) =>{ 
     const dateCurrent= dayjs(dayjs(item?.date,"DD-MM-YYYY").format('YYYY-MM-DD')).valueOf()
   return  (dateCurrent>=fromDate&&dateCurrent<=toDate)
    })
  dataDate.forEach((item) =>{totalAll=totalAll+ formatNumberNav(item?.total)  ; })
         setRevenue(totalAll)
  },[fromDate,toDate,dataTable])
 
  return (
    <div>
      <h1 className="p-4">Tổng quan</h1>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="Doanh thu hôm nay" size="large">
            <p className="text-center font-semibold text-xl">{ (totalToday)&&formatPriceRuleListAssets(formatNumberNav(totalToday.toString())) } VND</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Đơn hàng chờ" size="large">
            <p className="text-center font-semibold text-xl">{dataWaitting?.length}</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Đơn hàng đang vận chuyển" size="large">
            <p className="text-center font-semibold text-xl">{dataSendding?.length}</p>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className = "mt-5">
        <Col span={8}>
          <Card title={<div className= "flex justify-between"> <div>Doanh thu</div>   <RangePicker presets={rangePresets} onChange={onRangeChange} allowClear /></div>} size="large">
         
            <p className="text-center font-semibold text-xl">{ (revenue)&&formatPriceRuleListAssets(formatNumberNav(revenue.toString())) } VND</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Tổng đơn hàng" size="large">
   
            <p className="text-center font-semibold text-xl">{dataTable.length}</p>
          </Card>
        </Col>
      </Row>

     
    </div>
  );
}

export default Home;
