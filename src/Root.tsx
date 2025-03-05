import { Outlet } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header/Header";

function Root() {

  return (
    <>
    <Header />
      <main>
        <ScrollToTop />
        <Outlet />
      </main>
    </>
  )
}

export default Root