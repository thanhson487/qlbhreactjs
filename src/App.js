import logo from './logo.svg';
import './App.css';
import 'antd/dist/reset.css';
import { Button, Layout } from 'antd';
// import IndexMenu from './component/Menu/indexMenu';
import MenuRoute from './Component/Menu/MenuRoute';
import LayoutApp from './Component/LayoutApp';

function App() {
  return (
    <div className="App">
       {/* <Button type="primary">Button</Button> */}
       {/* <MenuRoute/> */}
       <LayoutApp/>
    </div>
  );
}

export default App;
