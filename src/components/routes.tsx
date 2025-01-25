import {createBrowserRouter} from "react-router-dom";
import {Home} from "../pages/home.tsx";
import Contact from "../pages/contact.tsx";

export const routes = createBrowserRouter([
  {path: "/", element: <Home/>},
  {path: "/contact", element: <Contact/>},
  {path: "/photos", element: "Coming soon!"},
  {path: "/about", element: "Coming soon!"}
], {
  basename: "/photography"
});
