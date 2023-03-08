import React from 'react'
// import Top from "./Top"
// import AsideLeft from './AsideLeft'

function Dashboard() {
  return (
    <>
    {/* <Top/> */}
    {/* <AsideLeft /> */}
    <div class="content-wrapper">
      {/* <!-- Content Header (Page header) --> */}
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
      </ol>
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> แดชบอร์ด</h1>
          </div>
        </div>
      </div>
      {/* <!-- /.content-header --> */}
      {/* <!-- Main content --> */}
      <section class="content">
        <div class="container-fluid">
          <div class="Inner-dash">
            <div class="row">
              <a href="" class="btn-d btn-app"><i class="fas fa-business-time"></i> ระบบลงเวลา</a>
              <a href="" class="btn-d btn-app"><i class="fas fa-file-invoice-dollar"></i> ระบบเงินเดือน</a>
              <a href="" class="btn-d btn-app"><i class="fas fa-paste"></i> ระบบออกเอกสาร</a>
              <a href="" class="btn-d btn-app"><i class="fas fa-file-alt"></i> ระบบรายงานผู้บริหาร</a>
              <a href="search.php" class="btn-d btn-app"><i class="fas fa-network-wired"></i> ระบบบริหารจัดการ<br/>พนักงาน</a>
              <a href="" class="btn-d btn-app"><i class="fas fa-cog"></i> การตั้งค่า</a>
            </div>
          </div>
        </div>
        {/* <!-- /.container-fluid --> */}
      </section>
      {/* <!-- /.content --> */}
    </div>
    </>
  )
}

export default Dashboard