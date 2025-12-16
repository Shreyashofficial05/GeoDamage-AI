import Landing from "./pages/Landing";
import Analyze from "./pages/Analyze";
import About from "./pages/About";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;
