// import React from "react";
import React, { useEffect, useState, useRef } from "react";
import endpoint from "./config";
import { useLocation } from "react-router-dom";

// import Posts from "./Post";
// import Home from "./Home";
// import Profile from './Profile';

import LoginForm from "./conponents/Login";

import AsideLeft from "./conponents/AsideLeft";
import Top from "./conponents/Top";

import Dashboard from "./conponents/componentsAside/Dashboard";
import Search from "./conponents/componentsAside/Search";
import Employee from "./conponents/componentsAside/Employee";
import EmployeesSelected from "./conponents/componentsAside/EmployeesSelected";

import Salary from "./conponents/componentsAside/Salary";
// import Salary from "./conponents/Salary";

import IncomeTax from "./conponents/componentsAside/IncomeTax";
import SocialSecurity from "./conponents/componentsAside/SocialSecurity";
import ProvidentFund from "./conponents/componentsAside/ProvidentFund";
import Collateral from "./conponents/componentsAside/Collateral";
import Document from "./conponents/componentsAside/Document";

import CalculateTax from "./conponents/componentsAside/CalculateTax";
import CalculateTaxDeductions from "./conponents/componentsAside/CalculateTaxDeductions";
import OtherExpenses from "./conponents/componentsAside/OtherExpenses";
import SearchResults from "./conponents/componentsAside/SearchResults";

import Application from "./conponents/componentsAside/Application";
import Application1 from "./conponents/componentsAside/Application1";
import Application2 from "./conponents/componentsAside/Application2";
import Application3 from "./conponents/componentsAside/Application3";
import Application4 from "./conponents/componentsAside/Application4";
import ApplicationSummary from "./conponents/componentsAside/ApplicationSummary";
import AddEditEmployee from "./conponents/componentsAside/AddEditEmployee";
import AddEditSalaryEmployee from "./conponents/componentsAside/AddEditSalaryEmployee";

import BasicSetting from "./conponents/componentsAside/BasicSetting";
import Setting from "./conponents/componentsAside/Setting";
import SettingComplex from "./conponents/componentsAside/SettingComplex";
import SettingAllList from "./conponents/componentsAside/SettingAllList";
import SettingEdit from "./conponents/componentsAside/SettingEdit";
import SettingSpecial from "./conponents/componentsAside/SettingSpecail";
import EmployeeWorkDay from "./conponents/componentsAside/componentsetting/EmployeeWorkDay";

import SystemUser from "./conponents/componentsAside/SystemUser";
import Addsettime from "./conponents/componentsAside/Addsettime";
import AddsettimeUpload from "./conponents/componentsAside/AddsettimeUpload";

import Salarysummary from "./conponents/componentsAside/Salarysummary";
// import Examine from "./conponents/componentsAside/salarysummary/examine";
// import Salaryresult from "./conponents/componentsAside/salarysummary/salaryresult";
// import Compensation from "./conponents/componentsAside/salarysummary/compensation";

import Examine from "./conponents/componentsAside/Examine";
import Compensation from "./conponents/componentsAside/Compensation";
import Salaryresult from "./conponents/componentsAside/SalaryResult";
import SalaryAllResult from "./conponents/componentsAside/SalaryAllResult";
import SalaryAllResultAudit from "./conponents/componentsAside/SalaryAllResultAudit";


import AddsettimeReplace from "./conponents/componentsAside/AddsettimeReplace";
import ReplaceReport from "./conponents/componentsAside/ReplaceReport";
import ReplaceWorkplaceReport from "./conponents/componentsAside/ReplaceWorkplaceReport";
import ReplaceEmployeeReport from "./conponents/componentsAside/ReplaceEmployeeReport";

import Worktimesheet from "./conponents/componentsAside/Worktimesheet";
import WorktimeSheetWorkplace from "./conponents/componentsAside/WorktimeSheetWorkplace";
import WorktimeSheetWorkplaceSpace from "./conponents/componentsAside/WorktimeSheetWorkplaceSpace";
import WorktimeSheetWorkplace_Save01_22_2024 from "./conponents/componentsAside/WorktimeSheetWorkplace_Save01-22-2024";

import TestPDF from "./conponents/componentsAside/TestPDF";

import SalarySlipPDF from "./conponents/componentsAside/SalarySlipPDF";
import BackReport from "./conponents/componentsAside/BackReport";
// import SendEmployeePDF from "./conponents/componentsAside/sendEmployeePDF";
import SendEmployeePDF from "./conponents/componentsAside/SendEmployeePDF";
import SendEmployeePDF2 from "./conponents/componentsAside/SendEmployeePDF2";
import SendEmployeePDF3 from "./conponents/componentsAside/SendEmployeePDF3";
import Testapp from "./conponents/componentsAside/Test";
import TestPDFSalary from "./conponents/componentsAside/TestPDFSalary";
import TestPDFResultSalay from "./conponents/componentsAside/TestPDFResultSalay";
import TestPDFResultSalayNew from "./conponents/componentsAside/TestPDFResultSalayNew";

// import Time from "./conponents/Time";
import Testcal from "./conponents/Testcal";
import Countday from "./conponents/Countday";
import TestShowManyData from "./conponents/componentsAside/TestShowManyData";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import Login from "./conponents/Login";
// import Registration from "./conponents/Registration";
// import Testcal from "./conponents/Testcal";

// import MyComponent from "./server/MyComponent";

function App() {

  const ScrollToTop = () => {
    const { pathname } = useLocation();
  
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
  
    return null;
  };
  const [workplaceList, setWorkplaceList] = useState([]);
  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/workplace/list")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        setWorkplaceList(data);
        // alert(data[0].workplaceName);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch(endpoint + "/employee/list")
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        setEmployeeList(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const [selectedEmployees, setSelectedEmployees] = useState([]);

  function handleEmployeeSelect(employee) {
    setSelectedEmployees((prevSelectedEmployees) => [
      ...prevSelectedEmployees,
      employee,
    ]);
  }

  function handleEmployeeRemove(employeeId) {
    setSelectedEmployees((prevSelectedEmployees) =>
      prevSelectedEmployees.filter((employee) => employee.id !== employeeId)
    );
  }

  //const [loggedIn, setLoggedIn] = useState(false);

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  function handleLogin(username, password) {
    // TODO: Implement the login process
    // For now, just set loggedIn to true
    //setLoggedIn(true);
  }

  function handleLogout() {
    setLoggedIn(false);
  }

  return (
    <div>
      {loggedIn ? (
        <Router>
                <ScrollToTop />

          <>
            {/* <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/posts">Posts</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul> */}
            <Top />
            <AsideLeft />
            <Routes>
              {/* <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/profile" element={<Profile />} /> */}
              {/* <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} /> */}
              <Route path="" element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="/search" element={<Search workplaceList={workplaceList} employeeList={employeeList}/>} />
              <Route path="/employee" element={<Employee />} />

              <Route path="/salary" element={<Salary />} />
              <Route path="/salarysummary" element={<Salarysummary />} />

              <Route path="/examine" element={<Examine />} />
              <Route path="/compensation" element={<Compensation />} />
              <Route path="/salaryresult" element={<Salaryresult />} />
              <Route
                path="/salaryAllresult"
                element={<SalaryAllResult employeeList={employeeList} workplaceList={workplaceList} />}
              />
               <Route
                path="/salaryAllresultAudit"
                element={<SalaryAllResultAudit employeeList={employeeList} workplaceList={workplaceList} />}
              />
              <Route
                path="/salarySlipPDF"
                element={<SalarySlipPDF employeeList={employeeList} workplaceList={workplaceList}/>}
              />
              <Route
                path="/backReport"
                element={<BackReport employeeList={employeeList} workplaceList={workplaceList}/>}
              />
               <Route
                path="/replaceReport"
                element={<ReplaceReport employeeList={employeeList} workplaceList={workplaceList} />}
              />
              <Route
                path="/replaceWorkplaceReport"
                element={<ReplaceWorkplaceReport employeeList={employeeList} workplaceList={workplaceList} />}
              />
              <Route
                path="/replaceEmployeeReport"
                element={<ReplaceEmployeeReport employeeList={employeeList} workplaceList={workplaceList} />}
              />

              <Route path="/worktimesheet" element={<Worktimesheet />} />
              <Route
                path="/worktimesheetworkplace"
                element={<WorktimeSheetWorkplace employeeList={employeeList} />}
              />
               <Route
                path="/worktimesheetworkplaceSpace"
                element={<WorktimeSheetWorkplaceSpace employeeList={employeeList} />}
              />
              <Route
                path="/worktimeSheetWorkplace_Save01_22_2024"
                element={<WorktimeSheetWorkplace_Save01_22_2024 />}
              />

              <Route path="/income_tax" element={<IncomeTax />} />
              <Route path="/social_security" element={<SocialSecurity />} />
              <Route path="/provident_fund" element={<ProvidentFund />} />
              <Route path="/collateral" element={<Collateral />} />
              <Route path="/document" element={<Document />} />

              <Route path="/calculate_tax" element={<CalculateTax />} />
              <Route
                path="/calculate_tax_deductions"
                element={<CalculateTaxDeductions />}
              />
              <Route path="/other_expenses" element={<OtherExpenses />} />
              <Route path="/search_results" element={<SearchResults />} />

              {/* <Route path="/setting" element={<Setting />} /> */}
              <Route
                path="/setting"
                element={
                  <Setting
                    workplaceList={workplaceList}
                    employeeList={employeeList}
                  />
                }
              />
              <Route
                path="/basicsetting"
                element={<BasicSetting workplaceList={workplaceList} />}
              />

              <Route
                path="/settingcomplex"
                element={<SettingComplex workplaceList={workplaceList} />}
              />
              <Route
                path="/settingAllList"
                element={
                  <SettingAllList
                    workplaceList={workplaceList}
                    employeeList={employeeList}
                  />
                }
              />
                <Route
                path="/settingEdit"
                element={
                  <SettingEdit
                    workplaceList={workplaceList}
                    employeeList={employeeList}
                  />
                }
              />
              <Route path="/settingspecial" element={<SettingSpecial />} />

              <Route path="/systemuser" element={<SystemUser />} />

              <Route
                path="/addsettime"
                element={<Addsettime workplaceList={workplaceList} employeeList={employeeList}/>}
              />

              <Route
                              path="/addsettimereplace"
                element={<AddsettimeReplace workplaceList={workplaceList} employeeList={employeeList}/>}
              />

              {/* <Route path="/addsettimeupload" element={<AddsettimeUpload workplaceList={workplaceList}/>} /> */}
              <Route path="/application" element={<Application />} />
              <Route path="/applicatio1" element={<Application1 />} />
              <Route path="/applicatio2" element={<Application2 />} />
              <Route path="/applicatio3" element={<Application3 />} />
              <Route path="/applicatio4" element={<Application4 />} />
              <Route
                path="/application_summary"
                element={<ApplicationSummary />}
              />

              <Route
                path="/addEdit_Employee"
                element={<AddEditEmployee workplaceList={workplaceList} />}
              />
              <Route
                path="/addEdit_SalaryEmployee"
                element={<AddEditSalaryEmployee />}
              />

              {/* <Route path="/testPDF" element={<TestShowManyData />} /> */}
              {/* <Route path="/testPDF" element={<TestPDF />} /> */}
              {/* <Route path="/testPDF" element={<PdfGenerator />} /> */}
              {/* <Route path="/testPDF" element={<Testapp />} /> */}
              <Route path="/listsendemployee" element={<SendEmployeePDF employeeList={employeeList}/>} />
              {/* <Route path="/testPDF" element={<SendEmployeePDF3 />} /> */}

              <Route path="/testPDF" element={<Testapp />} />
              <Route path="/testPDFSalary" element={<TestPDFSalary />} />
              <Route
                path="/testPDFResultSalay"
                element={<TestPDFResultSalayNew />}
              />

              <Route path="/time" element={<Testcal />} />
              <Route path="/countday" element={<Countday />} />
            </Routes>
            {/* <EmployeesSelected /> */}
          </>
        </Router>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
