import React, { useEffect, useState } from 'react';

function EmployeesSelected({ onEmployeeSelect }) {
  const [storedEmp, setStoredEmp] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);


  useEffect(() => {
    const storedItem = localStorage.getItem('selectedEmployees');
    if (storedItem) {
      const parsedData = JSON.parse(storedItem);
      setStoredEmp(parsedData);
    } else {
    }


  }, []);


  useEffect(() => {
    // Listen for the custom event when selectedEmployees change in localStorage
    const handleSelectedEmployeesChange = (event) => {
      const { selectedEmployees } = event.detail;
      setStoredEmp(selectedEmployees);
      localStorage.setItem('selectedEmployees', JSON.stringify(selectedEmployees));

    };

    window.addEventListener('selectedEmployeesChanged', handleSelectedEmployeesChange);

    return () => {
      window.removeEventListener('selectedEmployeesChanged', handleSelectedEmployeesChange);
    };
  }, [storedEmp]);



  const handleEmployeeSelect = (selectedEmployee) => {
    setSelectedEmployee(selectedEmployee);
    // alert(selectedEmployee.employeeId);
    onEmployeeSelect(selectedEmployee);
  };

  async function handleRemoveEmployee(employeeId) {
    const updatedSelectedEmployees = await storedEmp.filter(
      employee => employee.employeeId !== employeeId
    );
    // const selectedEmployeeCount = updatedSelectedEmployees.length;

    await localStorage.setItem('selectedEmployees', JSON.stringify(updatedSelectedEmployees));

    await setStoredEmp(updatedSelectedEmployees);

    // Dispatch a custom event to notify other components about the change
    const event = new CustomEvent('selectedEmployeesChanged', {
      detail: { selectedEmployees: updatedSelectedEmployees },
    });
    window.dispatchEvent(event);
    // Do any additional processing or redirection as needed

  }


  async function handleRemoveEmployeeAll() {
    const updatedSelectedEmployees = await storedEmp.filter(
      employee => employee.employeeId === ''
    );

    await localStorage.setItem('selectedEmployees', JSON.stringify(updatedSelectedEmployees));

    await setStoredEmp(updatedSelectedEmployees);

    // Dispatch a custom event to notify other components about the change
    const event = new CustomEvent('selectedEmployeesChanged', {
      detail: { selectedEmployees: updatedSelectedEmployees },
    });
    window.dispatchEvent(event);
    // Do any additional processing or redirection as needed

  }

  return (
    <>
    <div className='container' style={{fontSize:'12px',fontWeight:'500'}}>
      {storedEmp.length > 0 && (
        <div style={{ fontSize:'11px'}}>
          <div >
            <div className='text-center'>
            <h7 className='text-center'>จำนวนพนักงานที่เลือก: {storedEmp.length}</h7>
            </div>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {storedEmp.map((employee) => (
                <li
                  key={employee.employeeId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                    marginLeft: '-2rem',
                  }}
                >
                  <span style={{ marginLeft:'15px' , flex: 1 }}>{employee.employeeId}:{employee.name} {employee.lastName}</span>
                  <div>
                    <button className='btn btn-primary ' 
                    type='button'
                      aria-label="choose"
                      onClick={() => handleEmployeeSelect(employee)}
                      style={{
                        width: '2rem',
                        height: '2rem',
                        margin: '1px',
                        borderRadius: '30px',
                        padding:'1px'

                       
                      }}
                    >
                      <i class="bi bi-check-lg"></i>
                    </button>
                    <button className='btn btn-danger'
                      aria-label="remove"
                      type="button"
                      onClick={() => handleRemoveEmployee(employee.employeeId)}
                      style={{
                        width: '2rem',
                        height: '2rem',
                        margin: '0.1rem',
                        borderRadius: '30px',
                        padding:'1px'
                      }}
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                </li>
              ))}


              <div className='text-center'>
              <button
              className='btn btn-danger '
                type="button"
                onClick={() => handleRemoveEmployeeAll()}
                style={{
                  width:'100px',
                  borderRadius: '8px',
                }}
              >
                ล้างรายการ
              </button>
              </div>

            </ul>

          </div>
        </div>
      )}
    </div>

    </>
  );
}


export default EmployeesSelected;
