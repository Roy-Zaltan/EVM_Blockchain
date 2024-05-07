import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import i18next from "i18next";

const Layout = () => {
  const [openLangSelector, setOpenLangSelector] = React.useState(false);
  return (
    <>
      <Header setOpenLangSelector={setOpenLangSelector} />
      <Outlet />
      <Footer />
      {openLangSelector && (
        <dialog
          className="absolute bg-n-6/85 left-0 right-0 bottom-0 h-screen w-full z-50 flex items-center justify-center"
          open={openLangSelector}
          onClick={() => setOpenLangSelector(false)}
        >
          <div
            className="flex flex-col w-[400px] h-fit bg-n-8 p-8 rounded-[10px]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="h5">Select Language</p>
            <div className="w-full">
              <select
                id="countries"
                onChange={(e) => {
                  console.log(e.target.value);
                  i18next.changeLanguage(e.target.value);
                }}
                class="bg-n-2 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-n-1/10 focus:ring focus:ring-n-1/10 focus:ring-opacity-50"
              >
                <option selected>Choose a Language</option>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="bn">Bengali</option>
              </select>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default Layout;
