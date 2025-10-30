// <? php include("include/header.php");?>
<body class="hold-transition sidebar-mini">
  <div class="wrapper">
    {/* <!-- Navbar -->
            <?php include("include/top.php");?>
            <!-- /.navbar -->
            <!-- Main Sidebar Container -->
            <?php include("include/aside_left.php");?> */}
    <div class="content-wrapper">
      {/* <!-- Content Header (Page header) --> */}
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a>
        </li>
        <li class="breadcrumb-item">
          <a href="#"> ระบบบริหารจัดการข้อมูล</a>
        </li>
        <li class="breadcrumb-item active">ข้อมูลเงินเดือน</li>
      </ol>
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <h1 class="m-0">
              <i class="far fa-arrow-alt-circle-right"></i> ข้อมูลเงินเดือน
            </h1>
          </div>
        </div>
      </div>
      {/* <!-- /.content-header -->
                <!-- Main content --> */}
      <section class="content">
        <div class="container-fluid">
          <form action="">
            <h2 class="head-title">ผลลัพท์การค้นหาพนักงาน</h2>
            <h2 class="title">หน่วยงานสังกัด</h2>
            <section class="Frame">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>รหัสพนักงาน</label>
                      <input
                        type=""
                        class="form-control"
                        id=""
                        placeholder="รหัสพนักงาน"
                      />
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>ตำแหน่ง</label>
                      <input
                        type=""
                        class="form-control"
                        id=""
                        placeholder="ตำแหน่ง"
                      />
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>แผนก</label>
                      <select class="form-control">
                        <option>แผนก 1</option>
                        <option>option 2</option>
                        <option>option 3</option>
                        <option>option 4</option>
                        <option>option 5</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>หน่วยงาน</label>
                      <select class="form-control">
                        <option>ไม่สังกัดหน่วยงาน</option>
                        <option>option 2</option>
                        <option>option 3</option>
                        <option>option 4</option>
                        <option>option 5</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>ประเภทการจ้าง</label>
                      <select class="form-control">
                        <option value="">ไม่ระบุ</option>

                        <option>รายวัน</option>
                        <option>รายเดือน</option>
                        <option>รายครั้ง</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>ลงบัญชีเป็นค่าใช้จ่าย</label>
                      <div class="" style={{ marginTop: "10px" }}>
                        <div class="icheck-primary d-inline">
                          <input type="radio" id="" name="" checked="" /> ทางตรง
                        </div>
                        <div class="icheck-primary d-inline">
                          <input type="radio" id="" name="" /> ทางอ้อม
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!--row--> */}
              </div>
            </section>
            {/* <!--Frame--> */}
            <h2 class="title">ระบบบันทึกเวลาและระบบลา</h2>
            <section class="Frame">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>ตารางงาน</label>
                      <select class="form-control">
                        <option>ไม่กำหนด</option>
                        <option></option>
                        <option></option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>ผู้อนุมัติ</label>
                      <select class="form-control">
                        <option>ไม่ได้ใช้งาน</option>
                        <option></option>
                        <option></option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>ผู้บันทึกเวลา</label>
                      <select class="form-control">
                        <option>บันทึกผ่านเว็บ</option>
                        <option></option>
                        <option></option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* <!--row--> */}
                <div class="row">
                  <h2 class="title">สถานที่ปฎิบัติงานประจำ</h2>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>ประเภทการจ้าง</label>
                      <select class="form-control">
                        <option>รายวัน</option>
                        <option></option>
                        <option></option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>เป็นหน่วยงาน</label>
                      <select class="form-control">
                        <option>ไม่จำกัด</option>
                        <option></option>
                        <option></option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>ผู้บันทึกข้มูลแทน</label>
                      <select class="form-control">
                        <option>บันทึกผ่านเว็บ</option>
                        <option></option>
                        <option></option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* <!--row--> */}
              </div>
              {/* <!--col-md-12--> */}
            </section>
            {/* <!--Frame--> */}
            <section class="Frame">
              <div class="row">
                <div class="col-md-6">
                  <div class="row">
                    <h2 class="title">วันที่เริ่มงาน</h2>
                  </div>
                  <div class="form-group row">
                    <label class="col-sm-3 col-form-label">
                      วันที่เริ่มงาน
                    </label>
                    <div class="col-sm-9">
                      <div
                        class="input-group date"
                        id="reservationdate"
                        data-target-input="nearest"
                      >
                        <input
                          type="text"
                          class="form-control datetimepicker-input"
                          data-target="#reservationdate"
                        />
                        <div
                          class="input-group-append"
                          data-target="#reservationdate"
                          data-toggle="datetimepicker"
                        >
                          <div class="input-group-text">
                            <i class="fa fa-calendar-alt"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-sm-3 col-form-label">วันที่บรรจุ</label>
                    <div class="col-sm-9">
                      <div
                        class="input-group date"
                        id="reservationdate"
                        data-target-input="nearest"
                      >
                        <input
                          type="text"
                          class="form-control datetimepicker-input"
                          data-target="#reservationdate"
                        />
                        <div
                          class="input-group-append"
                          data-target="#reservationdate"
                          data-toggle="datetimepicker"
                        >
                          <div class="input-group-text">
                            <i class="fa fa-calendar-alt"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-sm-3 col-form-label">
                      วันที่เริ่มต้นคำนวณ
                    </label>
                    <div class="col-sm-9">
                      <div
                        class="input-group date"
                        id="reservationdate"
                        data-target-input="nearest"
                      >
                        <input
                          type="text"
                          class="form-control datetimepicker-input"
                          data-target="#reservationdate"
                        />
                        <div
                          class="input-group-append"
                          data-target="#reservationdate"
                          data-toggle="datetimepicker"
                        >
                          <div class="input-group-text">
                            <i class="fa fa-calendar-alt"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!--col-md-6--> */}
                <div class="col-md-6">
                  <div class="row">
                    <h2 class="title">เงินเดือนปัจจุบัน</h2>
                  </div>
                  <div class="form-group row">
                    <label class="col-sm-2 col-form-label">*อัตรา</label>
                    <div class="col-sm-10">
                      <input
                        type=""
                        class="form-control"
                        id=""
                        placeholder="350"
                      />
                    </div>
                  </div>
                  <div class="form-group row">
                    <div class="col-md-8">
                      <div class="row">
                        <label class="col-sm-3 col-form-label">*ต่อ</label>
                        <div class="col-sm-9">
                          <select class="form-control">
                            <option>ต่อวัน</option>
                            <option></option>
                            <option></option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="row">
                        <label class="col-sm-5 col-form-label">สกุลเงิน</label>
                        <div class="col-sm-7">
                          <select class="form-control">
                            <option>บาท</option>
                            <option></option>
                            <option></option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group row">
                    <label class="col-sm-3 col-form-label">
                      วันที่ปรับปรุง
                    </label>
                    <div class="col-sm-9">
                      <div
                        class="input-group date"
                        id="reservationdate"
                        data-target-input="nearest"
                      >
                        <input
                          type="text"
                          class="form-control datetimepicker-input"
                          data-target="#reservationdate"
                        />
                        <div
                          class="input-group-append"
                          data-target="#reservationdate"
                          data-toggle="datetimepicker"
                        >
                          <div class="input-group-text">
                            <i class="fa fa-calendar-alt"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!--col-md-6--> */}
              </div>
              {/* <!--row--> */}
              <div class="form-group row">
                <label class="col-sm-1">งวดที่จ่าย</label>
                <div class="col-sm-9">
                  <div class="icheck-primary d-inline">
                    <input type="radio" id="" name="" checked="" /> เดือน
                  </div>
                  <div class="icheck-primary d-inline">
                    <input type="radio" id="" name="" /> ครึ่งเดือน
                  </div>
                  <div class="icheck-primary d-inline">
                    <input type="radio" id="" name="" checked="" /> สัปดาห์
                  </div>
                  <div class="icheck-primary d-inline">
                    <input type="radio" id="" name="" /> งวดพิเศษ
                  </div>
                  <div class="icheck-primary d-inline">
                    <input type="radio" id="" name="" /> 10 วัน
                  </div>
                </div>
              </div>
              {/* <!--row--> */}
              <div class="form-group row">
                <label class="col-sm-4">วิธีจ่ายเงิน</label>
                <div class="col-sm-9">
                  <div class="icheck-primary d-inline">
                    <input type="radio" id="" name="" checked="" /> เงินสด
                  </div>
                  <div class="icheck-primary d-inline">
                    <input type="radio" id="" name="" /> โอนผ่านธนาคาร
                  </div>
                </div>
              </div>
              {/* <!--row--> */}
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group row">
                    <label class="col-sm-3 col-form-label">ชื่อธนาคาร</label>
                    <div class="col-sm-9">
                      <select class="form-control">
                        <option>กสิกรไทย</option>
                        <option>กสิกรไทย</option>
                        <option>กสิกรไทย</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* <!--col-md-6--> */}
                <div class="col-md-6">
                  <div class="form-group row">
                    <label class="col-sm-2 col-form-label">เลขที่บัญชี</label>
                    <div class="col-sm-10">
                      <input
                        type=""
                        class="form-control"
                        id=""
                        placeholder="เลขที่บัญชี"
                      />
                    </div>
                  </div>
                </div>
                {/* <!--col-md-6--> */}
              </div>
              {/* <!--row--> */}
            </section>
            {/* <!--Frame--> */}
            <h2 class="title">ช่องเงินพิเศษ</h2>
            <section class="Frame">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>ตารางงาน</label>
                      <select class="form-control">
                        <option>ไม่กำหนด</option>
                        <option></option>
                        <option></option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>ผู้อนุมัติ</label>
                      <select class="form-control">
                        <option>ไม่ได้ใช้งาน</option>
                        <option></option>
                        <option></option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>ผู้บันทึกเวลา</label>
                      <select class="form-control">
                        <option>บันทึกผ่านเว็บ</option>
                        <option></option>
                        <option></option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* <!--row--> */}
                <div class="row">
                  <h2 class="title">สถานที่ปฎิบัติงานประจำ</h2>
                </div>
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>ประเภทการจ้าง</label>
                      <select class="form-control">
                        <option>รายวัน</option>
                        <option></option>
                        <option></option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>เป็นหน่วยงาน</label>
                      <select class="form-control">
                        <option>ไม่จำกัด</option>
                        <option></option>
                        <option></option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label>ผู้บันทึกข้มูลแทน</label>
                      <select class="form-control">
                        <option>บันทึกผ่านเว็บ</option>
                        <option></option>
                        <option></option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* <!--row--> */}
              </div>
              {/* <!--col-md-12--> */}
            </section>
            {/* <!--Frame--> */}
            <div class="line_btn">
              <button type="submit" class="btn b_save">
                <i class="nav-icon fas fa-save"></i> &nbsp;บันทึก
              </button>
              <button type="reset" class="btn clean">
                <i class="far fa-window-close"></i> &nbsp;ยกเลิก
              </button>
            </div>
          </form>
        </div>
        {/* <!-- /.container-fluid --> */}
      </section>
      {/* <!-- /.content --> */}
    </div>
    {/* <?php include("include/footer.php");?> */}
  </div>
</body>;
