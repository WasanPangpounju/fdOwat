import React from 'react'

function application4() {
    return (
        <body class="hold-transition sidebar-mini">
            <div class="wrapper">
                <div class="content-wrapper">
                    {/* <!-- Content Header (Page header) --> */}
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><i class="fas fa-home"></i> <a href="index.php">หน้าหลัก</a></li>
                        <li class="breadcrumb-item"><a href="#"> ระบบบริหารจัดการข้อมูล</a></li>
                        <li class="breadcrumb-item active">กรอกข้อมูลสมัครงาน</li>
                    </ol>
                    <div class="content-header">
                        <div class="container-fluid">
                            <div class="row mb-2">
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> กรอกข้อมูลสมัครงาน</h1>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /.content-header -->
                    <!-- Main content --> */}
                    <section class="content">
                        <div class="container-fluid">
                            <form id="myForm" action="#">
                                <h2 class="title">ประวัติการศึกษา</h2>
                                <section class="Frame">
                                    <div class="form-group row">
                                        <label class="col-md-2 col-form-label">ระดับการศึกษา</label>
                                        <div class="col-md-5">
                                            <select class="form-control">
                                                <option>ปริญญาตรี</option>
                                                <option>option 2</option>
                                                <option>option 3</option>
                                                <option>option 4</option>
                                                <option>option 5</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label class="col-md-2 col-form-label">ชื่อสถานศึกษา</label>
                                        <div class="col-md-5">
                                            <input type="" class="form-control" id="" placeholder=""/>
                                        </div>
                                    </div>
                                </section>
                                <h2 class="title">ประวัติการทำงาน</h2>
                                <section class="Frame">
                                    <ol class="work-history">
                                        <li>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">ระยะเวลา</label>
                                                <div class="col-md-10">
                                                    <div class="row form-group">
                                                        <label class="col-md-1 col-form-label">ตั้งแต่</label>
                                                        <div class="col-md-2">
                                                            <div class="input-group date" id="reservationdate" data-target-input="nearest">
                                                                <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate"/>
                                                                    <div class="input-group-append" data-target="#reservationdate" data-toggle="datetimepicker">
                                                                        <div class="input-group-text"><i class="fa fa-calendar-alt"></i></div>
                                                                    </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-1 col-form-label">จนถึง</div>
                                                        <div class="col-md-2">
                                                            <div class="input-group date" id="reservationdate2" data-target-input="nearest">
                                                                <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate2"/>
                                                                    <div class="input-group-append" data-target="#reservationdate2" data-toggle="datetimepicker">
                                                                        <div class="input-group-text"><i class="fa fa-calendar-alt"></i></div>
                                                                    </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-2 col-form-label">ชื่อบริษัท</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder=""/>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-2 col-form-label">ตำแหน่งหน้าที่</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder=""/>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-2 col-form-label">เงินเดือน</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder=""/>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-2 col-form-label">เหตุผลที่ออก</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder=""/>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">ระยะเวลา</label>
                                                <div class="col-md-10">
                                                    <div class="row form-group">
                                                        <label class="col-md-1 col-form-label">ตั้งแต่</label>
                                                        <div class="col-md-2">
                                                            <div class="input-group date" id="reservationdate" data-target-input="nearest">
                                                                <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate"/>
                                                                    <div class="input-group-append" data-target="#reservationdate" data-toggle="datetimepicker">
                                                                        <div class="input-group-text"><i class="fa fa-calendar-alt"></i></div>
                                                                    </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-1 col-form-label">จนถึง</div>
                                                        <div class="col-md-2">
                                                            <div class="input-group date" id="reservationdate2" data-target-input="nearest">
                                                                <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate2"/>
                                                                    <div class="input-group-append" data-target="#reservationdate2" data-toggle="datetimepicker">
                                                                        <div class="input-group-text"><i class="fa fa-calendar-alt"></i></div>
                                                                    </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-2 col-form-label">ชื่อบริษัท</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder=""/>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-2 col-form-label">ตำแหน่งหน้าที่</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder=""/>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-2 col-form-label">เงินเดือน</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder=""/>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-2 col-form-label">เหตุผลที่ออก</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder=""/>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">ระยะเวลา</label>
                                                <div class="col-md-10">
                                                    <div class="row form-group">
                                                        <label class="col-md-1 col-form-label">ตั้งแต่</label>
                                                        <div class="col-md-2">
                                                            <div class="input-group date" id="reservationdate" data-target-input="nearest">
                                                                <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate"/>
                                                                    <div class="input-group-append" data-target="#reservationdate" data-toggle="datetimepicker">
                                                                        <div class="input-group-text"><i class="fa fa-calendar-alt"></i></div>
                                                                    </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-1 col-form-label">จนถึง</div>
                                                        <div class="col-md-2">
                                                            <div class="input-group date" id="reservationdate2" data-target-input="nearest">
                                                                <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate2"/>
                                                                    <div class="input-group-append" data-target="#reservationdate2" data-toggle="datetimepicker">
                                                                        <div class="input-group-text"><i class="fa fa-calendar-alt"></i></div>
                                                                    </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-2 col-form-label">ชื่อบริษัท</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder=""/>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-2 col-form-label">ตำแหน่งหน้าที่</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder=""/>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-2 col-form-label">เงินเดือน</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder=""/>
                                                </div>
                                            </div>
                                            <div class="form-group row">
                                                <label class="col-md-2 col-form-label">เหตุผลที่ออก</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder=""/>
                                                </div>
                                            </div>
                                        </li>
                                    </ol>
                                </section>
                                <div class="line_btn">
                                    <button type="submit" formaction="application3.php" class="btn b-previous"> <i class="fas fa-angle-left"></i>&nbsp; ก่อนหน้า  </button>
                                    <button type="submit" formaction="application_summary.php" class="btn b-next"> ต่อไป &nbsp; <i class="fas fa-angle-right"></i></button>
                                </div>
                            </form>
                        </div>
                        {/* <!-- /.container-fluid --> */}
                    </section>
                    {/* <!-- /.content --> */}
                </div>
                {/* <?php include("include/footer.php");?> */}
            </div>
        </body>

    )
}

export default application4