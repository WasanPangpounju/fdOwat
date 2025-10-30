// import React from "react";
import React, { useEffect, useState, useRef } from "react";
import endpoint from "./config";
import { useLocation } from "react-router-dom";
// import Posts from "./Post";
// import Home from "./Home";
// import Profile from './Profile';

import WorkplaceSpecialShiftDetail from "./components/componentsAside/WorkplaceSpecialShiftDetail";

import LoginForm from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";

import BankReport from "./components/componentsAside/BankReport";
import BankReportExecutiveCommittee from "./components/componentsAside/BankReportExecutiveCommittee";

import AsideLeft from "./components/AsideLeft";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import AddSetTimeAuto from "./components/componentsAside/addsettimeauto";

import Top from "./components/Top";

import Dashboard from "./components/componentsAside/Dashboard";
import Search from "./components/componentsAside/Search";
import Employee from "./components/componentsAside/Employee";

import Salary from "./components/componentsAside/Salary";
// import Salary from "./components/Salary";

import IncomeTax from "./components/componentsAside/IncomeTax";
import SocialSecurity from "./components/componentsAside/SocialSecurity";
import ProvidentFund from "./components/componentsAside/ProvidentFund";
import Collateral from "./components/componentsAside/Collateral";
import Document from "./components/componentsAside/Document";

import CalculateTax from "./components/componentsAside/CalculateTax";
import CalculateTaxDeductions from "./components/componentsAside/CalculateTaxDeductions";
import OtherExpenses from "./components/componentsAside/OtherExpenses";
import SearchResults from "./components/componentsAside/SearchResults";
import SpecialShiftCash from "./components/componentsAside/SpecialShiftCash";

import Application from "./components/componentsAside/Application";
import Application1 from "./components/componentsAside/Application1";
import Application2 from "./components/componentsAside/Application2";
import Application3 from "./components/componentsAside/Application3";
import Application4 from "./components/componentsAside/Application4";
import ApplicationSummary from "./components/componentsAside/ApplicationSummary";
import AddEditEmployee from "./components/componentsAside/AddEditEmployee";
import AddEditSalaryEmployee from "./components/componentsAside/AddEditSalaryEmployee";
import AddSettingEmp from "./components/componentsAside/AddSettingEmp";

import BasicSetting from "./components/componentsAside/BasicSetting";
import Setting from "./components/componentsAside/Setting";
import SettingComplex from "./components/componentsAside/SettingComplex";
import SettingAllList from "./components/componentsAside/SettingAllList";
import SettingEdit from "./components/componentsAside/SettingEdit";
import SettingSpecial from "./components/componentsAside/SettingSpecail";

import SystemUser from "./components/componentsAside/SystemUser";
import Addsettime from "./components/componentsAside/Addsettime";

import Salarysummary from "./components/componentsAside/Salarysummary";
// import Examine from "./components/componentsAside/salarysummary/examine";
// import Salaryresult from "./components/componentsAside/salarysummary/salaryresult";
// import Compensation from "./components/componentsAside/salarysummary/compensation";

import Examine from "./components/componentsAside/Examine";
import Compensation from "./components/componentsAside/Compensation";
import Salaryresult from "./components/componentsAside/SalaryResult";
import SalaryAllResult from "./components/componentsAside/SalaryAllResult";
import SalaryAllResultAudit from "./components/componentsAside/SalaryAllResultAudit";
import WorktimeSheetWorkplacefor10105 from "./components/componentsAside/WorktimeSheetWorkplacefor10105";


import ReplaceReport from "./components/componentsAside/ReplaceReport";
import ReplaceWorkplaceReport from "./components/componentsAside/ReplaceWorkplaceReport";
import ReplaceEmployeeReport from "./components/componentsAside/ReplaceEmployeeReport";

import Worktimesheet from "./components/componentsAside/Worktimesheet";
import WorktimeSheetWorkplace from "./components/componentsAside/WorktimeSheetWorkplace";
import WorktimeSheetWorkplaceSpace from "./components/componentsAside/WorktimeSheetWorkplaceSpace";

import SalarySlipPDF from "./components/componentsAside/SalarySlipPDF";
// import SendEmployeePDF from "./components/componentsAside/sendEmployeePDF";
import SendEmployeePDF from "./components/componentsAside/SendEmployeePDF";
import Testapp from "./components/componentsAside/Test";
import TestPDFSalary from "./components/componentsAside/TestPDFSalary";
import TestPDFResultSalayNew from "./components/componentsAside/TestPDFResultSalayNew";

// import Time from "./components/Time";
import Testcal from "./components/Testcal";
import Countday from "./components/Countday";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import Login from "./components/Login";
// import Registration from "./components/Registration";
// import Testcal from "./components/Testcal";

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
      console.log("Original data:", data.map(item => item.workplaceId));
      
      // Sort data by workplaceId (handle numbers with parentheses) - ASCENDING ORDER
      const sortedData = [...data].sort((a, b) => {
        // Extract main number and number in parentheses
        const parseWorkplaceId = (id) => {
          const idStr = String(id).trim();
          
          // Handle numbers with parentheses like "10296(1)"
          const matchWithParens = idStr.match(/^(\d+)\((\d+)\)$/);
          if (matchWithParens) {
            return {
              main: parseInt(matchWithParens[1], 10),
              sub: parseInt(matchWithParens[2], 10)
            };
          }
          
          // Handle pure numbers like "10296" - treat as if it has (0)
          const matchPureNumber = idStr.match(/^\d+$/);
          if (matchPureNumber) {
            return { 
              main: parseInt(idStr, 10), 
              sub: 0
            };
          }
          
          return { main: 0, sub: 0 };
        };
        
        const aData = parseWorkplaceId(a.workplaceId);
        const bData = parseWorkplaceId(b.workplaceId);
        
        // Compare main number first - ASCENDING (น้อยไปมาก)
        if (aData.main !== bData.main) {
          return aData.main - bData.main;
        }
        
        // If main numbers are equal, compare sub numbers - ASCENDING (น้อยไปมาก)
        return aData.sub - bData.sub;
      });
      
      console.log("Sorted data (ASCENDING):", sortedData.map(item => item.workplaceId));
      console.log("Setting workplaceList with:", sortedData); // Debug: ตรวจสอบข้อมูลที่จะ set
      
      // ✅ Fixed: Update state once (removed unnecessary double render)
      setWorkplaceList(sortedData);
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
                            <Route
                path="/addsettingemp"
                element={
                  <AddSettingEmp
                    workplaceList={workplaceList}
                    employeeList={employeeList}
                  />
                }
              />

              <Route path="/salarysummary" element={<Salarysummary />} />

              <Route path="/examine" element={<Examine />} />
              <Route path="/compensation" element={<Compensation />} />
              <Route path="/salaryresult" element={<Salaryresult />} />
              <Route path="/addsettimeauto" element={<AddSetTimeAuto workplaceList={workplaceList}
                    employeeList={employeeList} /> }/>
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
                path="/bankReport"
                element={<BankReport employeeList={employeeList} workplaceList={workplaceList}/>}
              />
              <Route
                path="/bankReportExecutiveCommittee"
                element={
                  <AdminRoute 
                    element={<BankReportExecutiveCommittee employeeList={employeeList} workplaceList={workplaceList}/>}
                  />
                }
              />
               <Route
                path="/speacialshiftcash"
                element={<SpecialShiftCash employeeList={employeeList} workplaceList={workplaceList} />}
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
                path="/worktimesheetworkplacefor10105"
                element={<WorktimeSheetWorkplacefor10105 employeeList={employeeList} />}
              />
               <Route
                path="/worktimesheetworkplaceSpace"
                element={<WorktimeSheetWorkplaceSpace employeeList={employeeList} />}
              />

              <Route path="/income_tax" element={<IncomeTax />} />
              <Route path="/social_security" element={<SocialSecurity />} />
              <Route path="/provident_fund" element={<ProvidentFund />} />
              <Route path="/collateral" element={<Collateral />} />
              <Route path="/document" element={<Document />} />
              <Route path="/workplace-special-shift-detail" element={<WorkplaceSpecialShiftDetail />} />

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
        <Router>
          <Routes>
            <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
            <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
            {/* <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} /> */}
          </Routes>
          <Footer isLoginPage={true} />
        </Router>
      )}
      {loggedIn && <Footer isLoginPage={false} />}
    </div>
  );
}

export default App;
