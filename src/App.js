
import 'antd/dist/reset.css';
import './App.css';
// import IndexMenu from './component/Menu/indexMenu';
import LayoutApp from './Component/LayoutApp';
import { BrowserRouter , Route ,Routes} from "react-router-dom"
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { firebaseConfig } from './Constant';
import Home from './Component/Home';
function App() {

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app)
  function writeUserData(userId, name, email) {
    const db = getDatabase()
    const refers = ref(db, 'users/' + userId)
    set(refers, {
      username: name,
      email: email,
    })
  }

  writeUserData("CamCam2", "Son Pham", "son.phamthanh97")
  return (
    <div className="App">
          <Routes >
        <Route path="/san-pham" element={ <Home/> } />
      </Routes>
       <LayoutApp/>
    </div>
  );
}

export default App;
