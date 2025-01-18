import './assets/css/home.css';
import './assets/css/photo3d.css';
import {RouterProvider} from "react-router-dom";
import {routes} from "./components/routes.tsx";


const App = () => {
  return <RouterProvider router={routes}/>;
};

export default App;
