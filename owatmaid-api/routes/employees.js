const connectionString = require("../config");
const Employee = require('./models/employeeModel');

var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

//Connect mongodb
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));


function fixKeys(obj) {
  let newObj = {};
  for (let key in obj) {
    // Replace dot with underscore in the key
    let newKey = key.replace(/\./g, '_');
    
    // Check if the value is an object, if yes, recursively fix the keys
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      newObj[newKey] = fixKeys(obj[key]);
    } else {
      newObj[newKey] = obj[key];
    }
  }
  return newObj;
}

// Apply this transformation to each employee in the JSON array
router.get("/import-json", async (req, res) => {
  try {
    const data = fs.readFileSync(__dirname + "/importemployees.json", "utf8");
    let employees = JSON.parse(data);

    // Fix the keys of each employee object
    employees = employees.map(fixKeys);

    // Insert many documents into the Employee collection
    const result = await Employee.insertMany(employees);

    res.status(200).json({ message: "Employees successfully added!", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error importing data", error: error.message });
  }
});


// update employee by JSON file
router.get("/update-json", async (req, res) => {
  try {
    const data = fs.readFileSync(__dirname + "/updateemployees.json", "utf8");
    let employees = JSON.parse(data);

    // Fix the keys of each employee object
    employees = employees.map((employee) => {
      if (!employee.addSalary || !Array.isArray(employee.addSalary)) {
        employee.addSalary = [];
      }
      if (!employee.deductSalary || !Array.isArray(employee.deductSalary)) {
        employee.deductSalary = [];
      }
      return fixKeys(employee);
    });

    const updatePromises = employees.map(async (employee) => {
      const updateData = {
        name: employee.name,
        startjob: employee.startjob,
        exceptjob: employee.exceptjob,
        department: employee.department || '',
        addSalary: employee.addSalary,
        deductSalary: employee.deductSalary,
        ...(employee.idCard && { idCard: employee.idCard }),
      };

      // Debug: Log the update data and the match condition
      console.log('Attempting to update employee with ID:', employee.employeeId);
      console.log('Update data:', updateData);

      const result = await Employee.findOneAndUpdate(
        { employeeId: employee.employeeId }, // Ensure this matches your schema's identifier
        { $set: updateData },
        {
          upsert: true,
          new: true,
        }
      );

      // Log the result of each update operation
      console.log('Update result for employeeId', employee.employeeId, ':', result);

      return result;
    });

    // Await all update/insert operations
    const result = await Promise.all(updatePromises);

    res.status(200).json({ message: "Employees successfully added/updated!", result });
  } catch (error) {
    console.error('Error during update:', error);
    res.status(500).json({ message: "Error importing data", error: error.message });
  }
});


// // update employee by JSON file
// router.get("/update-json", async (req, res) => {
//   try {
//     const data = fs.readFileSync(__dirname + "/updateemployees.json", "utf8");
//     let employees = JSON.parse(data);

//     // Fix the keys of each employee object
//     employees = employees.map((employee) => {
//       // Ensure `addSalary` is an array or default to an empty array
//       if (!employee.addSalary || !Array.isArray(employee.addSalary)) {
//         employee.addSalary = [];
//       }
//       // Ensure `deductSalary` is an array or default to an empty array
//       if (!employee.deductSalary || !Array.isArray(employee.deductSalary)) {
//         employee.deductSalary = [];
//       }
//       return fixKeys(employee);
//     });

//     const updatePromises = employees.map(async (employee) => {
//       const updateData = {
//         name: employee.name,
//         startjob: employee.startjob,
//         exceptjob: employee.exceptjob,
//         department: employee.department || '',
//         addSalary: employee.addSalary,
//         deductSalary: employee.deductSalary,
//       };

//       // Only set `idCard` if it is not null or undefined
//       if (employee.idCard) {
//         updateData.idCard = employee.idCard;
//       }

//       return Employee.findOneAndUpdate(
//         { employeeId: employee.employeeId }, // Use a unique identifier here
//         { $set: updateData },
//         {
//           upsert: true, // Create a new document if one doesn't exist
//           new: true, // Return the updated document
//         }
//       );
//     });

    // Await all update/insert operations
//     const result = await Promise.all(updatePromises);

//     res.status(200).json({ message: "Employees successfully added/updated!", result });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error importing data", error: error.message });
//   }
// });

//update employee by json file
router.get("/update-json1", async (req, res) => {
  try {
    const data = fs.readFileSync(__dirname + "/updateemployees.json", "utf8");
    let employees = JSON.parse(data);

    // Fix the keys of each employee object
    employees = employees.map(fixKeys);

    const updatePromises = employees.map(async (employee) => {
      // Update if the employee exists or insert if it doesn't
      return Employee.findOneAndUpdate(
        { employeeId: employee.employeeId }, // Use a unique identifier here
        employee,
        { upsert: true, new: true } // `upsert` creates a new document if none is found
      );
    });

    // Await all update/insert operations
    const result = await Promise.all(updatePromises);

    res.status(200).json({ message: "Employees successfully added/updated!", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error importing data", error: error.message });
  }
});
// Route to push JSON data to MongoDB
// router.get("/import-json", async (req, res) => {
//   try {
//     // Read the JSON file (replace 'path/to/your/file.json' with the actual file path)
//     const data = fs.readFileSync(__dirname + "/importemployees.json", "utf8");
//     const employees = JSON.parse(data);

//     // Insert many documents into the Employee collection
//     const result = await Employee.insertMany(employees);

//     res.status(200).json({ message: "Employees successfully added!", result });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error importing data", error: error.message });
//   }
// });

// Get list of employees
router.get("/list", async (req, res) => {
  const employees = await Employee.find();

  const employeesReturn  = employees.map(employee => {
    // Format the startjob field from dd/mm/yyyy to mm/dd/yyyy
      if (employee.startjob) {
        const [day, month, year] = employee.startjob.split('/');
        employee.startjob = `${month}/${day}/${year}`;
      }
      if (employee.exceptjob) {
        const [day, month, year] = employee.exceptjob.split('/');
        employee.exceptjob= `${month}/${day}/${year}`;
      }
      if (employee.addSalary == null) {
        employee.addSalary= [];
      }
      if (employee.deductSalary == null) {
        employee.deductSalary = [];
      }
      if (employee.department  && employee.department == null) {
        employee.department= '';
      }

return employee;
  });

  res.json(employeesReturn  );
});


router.get("/list-count", async (req, res) => {
  const employees = await Employee.find();

  const employeesReturn  = employees.map(employee => {
    // Format the startjob field from dd/mm/yyyy to mm/dd/yyyy
      if (employee.startjob) {
        const [day, month, year] = employee.startjob.split('/');
        employee.startjob = `${month}/${day}/${year}`;
      }
      if (employee.exceptjob) {
        const [day, month, year] = employee.exceptjob.split('/');
        employee.exceptjob= `${month}/${day}/${year}`;
      }
      if (employee.addSalary == null) {
        employee.addSalary= [];
      }
      if (employee.deductSalary == null) {
        employee.deductSalary = [];
      }
      if (employee.department  && employee.department == null) {
        employee.department= '';
      }

return employee;
  });

  const count = employeesReturn.length;

  res.json({
    count,
    employees: employeesReturn,
  });
//   res.json(employeesReturn  );
});


router.get("/delete-all", async (req, res) => {
  try {
    await Employee.deleteMany({});
    res.json({ message: "All employees have been deleted." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting employees", error: error.message });
  }
});

// Get  employee by Id
router.get("/:employeeId", async (req, res) => {
  try {
    const employee = await Employee.findOne({
      employeeId: req.params.employeeId,
    });
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ [API #1] GET /api/employees/:employeeId/custom-workplace
// 🔍 ดึง customWorkplace จาก employeeId
router.get('/:employeeId/custom-workplace', async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ message: 'ไม่พบพนักงาน' });
    }

    if (!employee.customWorkplace) {
      return res.status(404).json({ message: 'ไม่มีข้อมูล customWorkplace' });
    }

    res.status(200).json({ customWorkplace: employee.customWorkplace });
  } catch (err) {
    console.error('❌ Error fetching customWorkplace:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});


// ✅ [API #2] PUT /api/employees/:employeeId/custom-workplace
// 📝 รับ customWorkplace จาก frontend แล้วบันทึกลงในพนักงาน
router.put('/:employeeId/custom-workplace', async (req, res) => {
  const { employeeId } = req.params;
  const { customWorkplace } = req.body;

  // ตรวจสอบว่า customWorkplace เป็น object ที่ส่งมาจาก frontend
  if (!customWorkplace || typeof customWorkplace !== 'object') {
    return res.status(400).json({ message: 'กรุณาส่ง customWorkplace ที่ถูกต้อง' });
  }

  try {
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ message: 'ไม่พบพนักงาน' });
    }

    employee.customWorkplace = customWorkplace;
    await employee.save();

    res.status(200).json({
      message: 'บันทึก customWorkplace สำเร็จ',
      customWorkplace: employee.customWorkplace,
    });
  } catch (err) {
    console.error('❌ Error saving customWorkplace:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

// ✅ DELETE /api/employees/:employeeId/custom-workplace
// 👉 ลบ field customWorkplace ใน employee
router.delete('/:employeeId/custom-workplace', async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ message: 'ไม่พบพนักงาน' });
    }

    // ❌ ลบ field customWorkplace
    employee.customWorkplace = undefined;
    await employee.save();

    res.status(200).json({ message: 'ลบ customWorkplace สำเร็จ' });
  } catch (err) {
    console.error('❌ Error deleting customWorkplace:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
});

router.post("/search", async (req, res) => {
  try {
    const { employeeId, name, idCard, workPlace } = req.body;

    // Construct the search query based on the provided parameters
    const query = {};

    if (employeeId) {
      query.employeeId = employeeId;
    }

    if (name) {
      query.name = { $regex: new RegExp(name, "i") };
      //{ $regex: name, $options: 'i' };
    }

    if (idCard) {
      query.idCard = idCard;
    }

    if (workPlace) {
      // query.workplace = workPlace;
      // console.log(query.workplace );
      query.workplace = { $regex: new RegExp(workPlace, "i") };
      // query.workPlace = { $regex: workPlace, $options: 'i' };
    }

    console.log("Search Parameters:");
    // console.log({ employeeId, name, idCard, workPlace });

    // console.log('Constructed Query:');
    // console.log(query);
    if (employeeId == "" && name == "" && idCard == "" && workPlace == "") {
      res.status(200).json({});
    }

    // Query the employee collection for matching documents
    const employees = await Employee.find(query);

    // Format the startjob field from dd/mm/yyyy to mm/dd/yyyy
      if (employees[0].startjob) {
        const [day, month, year] = employees[0].startjob.split('/');
        employees[0].startjob = `${month}/${day}/${year}`;
        console.log('employees.startjob ' + employees[0].startjob )
      }
      if (employees[0].exceptjob) {
        const [day, month, year] = employees[0].exceptjob.split('/');
        employees[0].exceptjob= `${month}/${day}/${year}`;
        console.log('employees.exceptjob' + employees[0].exceptjob)
      }
      if (employees[0].addSalary == null) {
        employees[0].addSalary= [];
      }
      if (employees[0].deductSalary == null) {
        employees[0].deductSalary = [];
      }
      if (employees[0].department  && employees[0].department == null) {
        employees[0].department= '';
      }

      
    // console.log('Search Results:');
    // console.log(employees);
    let textSearch = "test";
    await res.status(200).json({ employees });
  } catch (error) {
    console.error(error);
    // res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new employee
router.post("/create", async (req, res) => {
  const {
    employeeId,
    position,
    department,
    workplace,
    jobtype,
    startjob,
    endjob,
    exceptjob,
    prefix,
    name,
    lastName,
    nickName,
    gender,
    dateOfBirth,
    age,
    idCard,
    idCardIssueDate,
    idCardPlace,
    stayLive,

    natnalty,
    origin,
    blood,
    height,
    weight,
    fatherName,
    fatherNatnalty,
    motherName,
    motherNatnalty,
    emr_cntt,
    emr_adr1,
    emr_adr2,
    emr_adr3,
    country,
    statusEmergencyContact,
    tax_id,
    i_type,
    i_card,
    i_exp,
    i_iss,
    iss_ampur,
    iss_prov,
    sp_intl,
    sp_name,
    sp_surnme,
    domicile,
    domicile_origin,
    fml_natnalty,
    fml_religion,
    fml_military,
    fml_blood,
    fml_height,
    fml_weight,
    fml_card_adr1,
    fml_card_adr2,
    fml_card_adr3,
    Fml_fatherName,
    Fml_motherName,
    Fml_fatherName2,
    Fml_fatherID,
    Fml_motherID,
    ssoEntryDate,
    bank_initial,
    branchBank,
    costtype,
    ethnicity,
    religion,
    maritalStatus,
    militaryStatus,
    address,
    province,
    district,
    subDistrict,
    postalCode,
    houseNumber,

    province2,
    district2,
    subDistrict2,
    postalCode2,
    houseNumber2,

    currentAddress,
    currentProvince,
    currentDistrict,
    currentSubdistrict,
    currentZipcode,

    phoneNumber,
    emergencyContactNumber,
    idLine,
    vaccination,
    treatmentRights,

    selectedOption,
    idPerson,
    salary,
    minus,
    socialsecurity,
    socialsecurityemployer,
    minusemployer,

    selectedHospDFSelect,
    selectedHospSelect1,
    selectedHospSelect2,
    selectedHospSelect3,

    selectedHospDf,
    selectedHosp1,
    selectedHosp2,
    selectedHosp3,

    beforebecomeEmployee,
    wagesbeforeusingProgram,
    wagesafterusingProgram,
    companybeforeusingProgram,

    salaryadd1Sec,
    salaryadd2Sec,
    salaryadd3Sec,
    salaryadd4Sec,
    salaryadd5Sec,

    ////otherExp
    number1,
    number2,

    input1,
    input2,
    input3,
    anything,

    crimeinvestigation,
    shirt,
    shirtcount,
    trousers,
    trouserscount,
    wholeset,
    wholesetcount,
    saveftyShoes,
    saveftyShoescount,
    apron,
    aproncount,
    hat,
    hatcount,
    custom,

    admoney1,
    admoney2,
    admoney3,

    commentadmoney1,
    commentadmoney2,
    commentadmoney3,
    PriceType,
    divide,
    salarytype,
    addSalary,
    selectAddSalary,
    sumAddSalary,
  } = req.body;
  console.log(`Name: ${name}, Id card: ${idCard}`);

  // Create employee
  const employee = new Employee({
    employeeId,
    position,
    department,
    workplace,
    jobtype,
    startjob,
    endjob,
    exceptjob,
    prefix,
    name,
    lastName,
    nickName,
    gender,
    dateOfBirth,
    age,
    idCard,
    idCardIssueDate,
    idCardPlace,
    stayLive,

    natnalty,
    origin,
    blood,
    height,
    weight,
    fatherName,
    fatherNatnalty,
    motherName,
    motherNatnalty,
    emr_cntt,
    emr_adr1,
    emr_adr2,
    emr_adr3,
    country,
    statusEmergencyContact,
    tax_id,
    i_type,
    i_card,
    i_exp,
    i_iss,
    iss_ampur,
    iss_prov,
    sp_intl,
    sp_name,
    sp_surnme,
    domicile,
    domicile_origin,
    fml_natnalty,
    fml_religion,
    fml_military,
    fml_blood,
    fml_height,
    fml_weight,
    fml_card_adr1,
    fml_card_adr2,
    fml_card_adr3,
    Fml_fatherName,
    Fml_motherName,
    Fml_fatherName2,
    Fml_fatherID,
    Fml_motherID,
    ssoEntryDate,
    bank_initial,
    branchBank,
    costtype,
    ethnicity,
    religion,
    maritalStatus,
    militaryStatus,
    address,
    province,
    district,
    subDistrict,
    postalCode,
    houseNumber,

    province2,
    district2,
    subDistrict2,
    postalCode2,
    houseNumber2,

    currentAddress,
    currentProvince,
    currentDistrict,
    currentSubdistrict,
    currentZipcode,
    phoneNumber,
    emergencyContactNumber,
    idLine,
    vaccination,
    treatmentRights,

    selectedOption,
    idPerson,
    salary,
    minus,
    socialsecurity,
    socialsecurityemployer,
    minusemployer,

    selectedHospDFSelect,
    selectedHospSelect1,
    selectedHospSelect2,
    selectedHospSelect3,

    selectedHospDf,
    selectedHosp1,
    selectedHosp2,
    selectedHosp3,

    beforebecomeEmployee,
    wagesbeforeusingProgram,
    wagesafterusingProgram,
    companybeforeusingProgram,

    salaryadd1Sec,
    salaryadd2Sec,
    salaryadd3Sec,
    salaryadd4Sec,
    salaryadd5Sec,

    ////otherExp
    number1,
    number2,

    input1,
    input2,
    input3,
    anything,

    crimeinvestigation,
    shirt,
    shirtcount,
    trousers,
    trouserscount,
    wholeset,
    wholesetcount,
    saveftyShoes,
    saveftyShoescount,
    apron,
    aproncount,
    hat,
    hatcount,
    custom,

    admoney1,
    admoney2,
    admoney3,

    commentadmoney1,
    commentadmoney2,
    commentadmoney3,
    PriceType,
    divide,
    salarytype,
    addSalary,
    selectAddSalary,
    sumAddSalary,
  });

  try {
    await employee.save();
    res.json(employee);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});

//Update Employee data
router.put("/update/:_id", async (req, res) => {
  const employeeIdToUpdate = req.params._id;
  const updateFields = req.body;

  try {
    // Find the resource by ID and update it
    const updatedResource = await Employee.findByIdAndUpdate(
      employeeIdToUpdate,
      updateFields,
      { new: true } // To get the updated document as the result
    );
    if (!updatedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Send the updated resource as the response
    res.json(updatedResource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete employee by Id
// router.delete('/delete/:employeeId', async (req, res) => {
//   try {
//     const employeeIdToDelete = req.params.employeeId;

//     // Find the employee by ID and delete it
//     const deletedEmployee = await Employee.findOneAndDelete({ employeeId: employeeIdToDelete });

//     if (deletedEmployee) {
//       res.json({ message: 'Employee deleted successfully', deletedEmployee });
//     } else {
//       res.status(404).json({ error: 'Employee not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

router.delete("/delete/:_id", async (req, res) => {
  try {
    const employeeIdToDelete = req.params._id;

    // Find the employee by ID and delete it
    const deletedEmployee = await Employee.findOneAndDelete({
      _id: employeeIdToDelete,
    });

    if (deletedEmployee) {
      res
        .status(200)
        .json({ message: "Employee deleted successfully", deletedEmployee });
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.delete('/delete/:_id', async (req, res) => {
//   try {
//     const employeeIdToDelete = req.params._id;

//     // Find the employee by ID and delete it
//     const deletedEmployee = await Employee.findOneAndDelete({ _id: employeeIdToDelete });

//     if (deletedEmployee) {
//       res.json({ message: 'Employee deleted successfully', deletedEmployee });
//     } else {
//       res.status(404).json({ error: 'Employee not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Delete employee by _id
router.delete("/delete/:_id", async (req, res) => {
  try {
    const employeeIdToDelete = req.params._id;

    // Find the employee by _id and delete it
    const deletedEmployee = await Employee.findByIdAndDelete(
      employeeIdToDelete
    );

    if (deletedEmployee) {
      res.json({ message: "Employee deleted successfully", deletedEmployee });
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete_id/:_id", async (req, res) => {
  try {
    const employeeIdToDelete = req.params._id; // Use _id instead of employeeId

    // Find the employee by ID and delete it
    const deletedEmployee = await Employee.findOneAndDelete({
      _id: employeeIdToDelete,
    });

    if (deletedEmployee) {
      res.json({ message: "Employee deleted successfully", deletedEmployee });
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
