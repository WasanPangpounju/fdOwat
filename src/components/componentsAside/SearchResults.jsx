import React from 'react'
import '../editwindowcss.css';

function SearchResults() {
    return (
        <body class="hold-transition sidebar-mini" className='editlaout'>
            <div class="wrapper">
                <div class="content-wrapper">
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> ระบบบริหารจัดการข้อมูล</a></li>
                        <li class="breadcrumb-item active">ข้อมูลส่วนบุคคลพนักงาน</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> ข้อมูลส่วนบุคคลพนักงาน</h1>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /.content-header -->
                    <!-- Main content --> */}
                    <section class="content">
                        <div class="container-fluid">
                            <h2 class="head-title">ผลลัพท์การค้นหาพนักงาน</h2>
                            <h2 class="title">ข้อมูลพนักงาน</h2>
                            <section class="Frame">
                                <div class="col-md-12">
                                    <form action="">
                                        <div class="row">
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label>รหัสพนักงาน</label>
                                                    <input type="" class="form-control" id="" disabled placeholder="651430" />
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label>ตำแหน่ง</label>
                                                    <input type="" class="form-control" id="" disabled placeholder="พนักงานทำความสะอาด" />
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label>แผนก</label>
                                                    <select class="form-control" disabled>
                                                        <option>แม่บ้าน</option>
                                                        <option>option 2</option>
                                                        <option>option 3</option>
                                                        <option>option 4</option>
                                                        <option>option 5</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label>หน่วยงาน</label>
                                                    <input type="" class="form-control" id="" disabled placeholder="A1" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label>ประเภทการจ้าง</label>
                                                    <select class="form-control" disabled>
                                                        <option>ประจำ</option>
                                                        <option>option 2</option>
                                                        <option>option 3</option>
                                                        <option>option 4</option>
                                                        <option>option 5</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label>วันที่เริ่มงาน</label>
                                                    <div class="input-group date" id="reservationdate" data-target-input="nearest">
                                                        <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate" />
                                                        <div class="input-group-append" data-target="#reservationdate" data-toggle="datetimepicker">
                                                            <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label>วันที่บรรจุ</label>
                                                    <div class="input-group date" id="reservationdate2" data-target-input="nearest">
                                                        <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate2" />
                                                        <div class="input-group-append" data-target="#reservationdate2" data-toggle="datetimepicker">
                                                            <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>อัพโหลดลายนิ้วมือ</label>
                                                    <div class="">
                                                        <img src="assets/images/01.png" class="" alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>อัพโหลดใบหน้า</label>
                                                    <div class="">
                                                        <img src="assets/images/01.png" class="" alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </section>
                            {/* <!--Frame--> */}
                            <h2 class="title">ข้อมูลส่วนบุคคลพนักงาน</h2>
                            <section class="Frame">
                                <div class="col-md-12">
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>คำนำหน้า</label>
                                                <select class="form-control" disabled>
                                                    <option>นาง</option>
                                                    <option></option>
                                                    <option>นางสาว</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>ชื่อ</label>
                                                <input type="" class="form-control" id="" disabled placeholder="ชุติมา" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>นามสกุล</label>
                                                <input type="" class="form-control" id="" disabled placeholder="จอมนก" />
                                            </div>
                                        </div>

                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>ชื่อเล่น</label>
                                                <input type="" class="form-control" id="" disabled placeholder="นก" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>เพศ</label>
                                                <select class="form-control" disabled>
                                                    <option>หญิง</option>
                                                    <option>option 2</option>
                                                    <option>option 3</option>
                                                    <option>option 4</option>
                                                    <option>option 5</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>วันเดือนปีเกิด</label>
                                                <div class="input-group date" id="reservationdate3" data-target-input="nearest">
                                                    <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate3" />
                                                    <div class="input-group-append" data-target="#reservationdate3" data-toggle="datetimepicker">
                                                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>อายุ</label>
                                                <input type="" class="form-control" id="" disabled placeholder="46" />
                                            </div>
                                        </div>

                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>เลขบัตรประจำตัวประชาชน</label>
                                                <input type="" class="form-control" id="" disabled placeholder="1328800075236" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>เชื้อชาติ</label>
                                                <input type="" class="form-control" id="" disabled placeholder="ไทย" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>ศาสนา</label>
                                                <input type="" class="form-control" id="" disabled placeholder="พุทธ" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>สถานภาพการสมรส</label>
                                                <input type="" class="form-control" id="" disabled placeholder="สมรสแล้ว" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>สถานภาพทางการทหาร</label>
                                                <select class="form-control" disabled>
                                                    <option>-</option>
                                                    <option>option 2</option>
                                                    <option>option 3</option>
                                                    <option>option 4</option>
                                                    <option>option 5</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label>ที่อยู่ตามบัตรประชาชน</label>
                                                <textarea class="form-control" rows="3" disabled placeholder="152/184 อ.เมือง  จ.ฉะเชิงเทรา 24000"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label>ที่อยู่ปัจจุบัน</label>
                                                <div class="icheck-primary d-inline">
                                                    <input type="radio" id="radio" name="radio1" disabled /> ใช้ที่อยู่ตามบัตรประชาชน
                                                </div>
                                                <textarea class="form-control" rows="3" disabled placeholder="152/184 อ.เมือง  จ.ฉะเชิงเทรา 24000"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>เบอร์โทรศัพท์</label>
                                                <input type="" class="form-control" id="" disabled placeholder="0898033953" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>เบอร์ติดต่อกรณีฉุกเฉิน</label>
                                                <input type="" class="form-control" id="" disabled placeholder="0898033953" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>ไอดีไลน์</label>
                                                <input type="" class="form-control" id="" disabled placeholder="0898033953" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* <!--Frame--> */}
                            <h2 class="title">ข้อมูลสุขภาพ</h2>
                            <section class="Frame">
                                <div class="row">
                                    <div class="form-group">
                                        <label style={{ paddingLeft: "10px" }}>การรับวัคซีน</label>
                                        <div class="col-md-12" style={{ marginTop: "10px" }}>
                                            <div class="icheck-primary d-inline">
                                                <input type="radio" id="radioPrimary1" name="r1" disabled checked="" /> ได้รับวัคซีนแล้ว
                                            </div>
                                            <div class="icheck-primary d-inline">
                                                <input type="radio" id="radioPrimary2" name="r1" />  ยังไม่ได้รับวัคซีนแล้ว
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>สิทธิการรักษาพยาบาล</label>
                                            <input type="" class="form-control" id="" disabled placeholder="โรงพยาบาลลาดพร้าว" />
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* <!--Frame--> */}
                            <div class="line_btn">
                                <button type="submit" class="btn clean"><i class="far fa-edit"></i> &nbsp;แก้ไขข้อมูล</button>
                                <button type="reset" class="btn b_save"><i class="nav-icon fas fa-save"></i> &nbsp;บันทึก</button>
                            </div>
                        </div>
                        {/* <!-- /.container-fluid --> */}
                    </section>
                    {/* <!-- /.content --> */}
                </div>
            </div>
        </body>
    )
}

export default SearchResults