import React from 'react'

function application3() {
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
                                <h2 class="title">ความสามารถพิเศษ</h2>
                                <section class="Frame">
                                    <div class="row">
                                        <div class="col-md-5">
                                            <div class="row">
                                                <label class="col-sm-5 col-form-label">ใบขับขี่จักรยานยนต์</label>
                                                <div class="col-sm-7 col-form-label">
                                                    <div class="icheck-primary d-inline">
                                                        <input type="radio" id="radioPrimary1" name="r1" checked=""/> ได้
                                                    </div>
                                                    <div class="icheck-primary d-inline">
                                                        <input type="radio" id="radioPrimary2" name="r2" />  ไม่ได้
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="row">
                                                <label class="col-sm-4 col-form-label">ใบขับขี่รถยนต์</label>
                                                <div class="col-sm-7 col-form-label">
                                                    <div class="icheck-primary d-inline">
                                                        <input type="radio" id="radioPrimary1" name="r3" checked="" /> ได้
                                                    </div>
                                                    <div class="icheck-primary d-inline">
                                                        <input type="radio" id="radioPrimary2" name="r4" />  ไม่ได้
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group row">
                                                <div class="col-md-6 col-form-label">ใบอนุญาติขับขี่เลขที่</div>
                                                <div class="col-md-6">
                                                    <input type="" class="form-control" id="" placeholder="0" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="row">
                                        <div class="col-md-5">
                                            <div class="row">
                                                <label class="col-md-5 col-form-label">ใบอนุญาตขับขี่ประเภท</label>
                                                <div class="col-md-7 col-form-label">
                                                    <div class="icheck-primary d-inline">
                                                        <input type="radio" id="radioPrimary1" name="r1" checked="" /> ชั่วคราว
                                                    </div>
                                                    <div class="icheck-primary d-inline">
                                                        <input type="radio" id="radioPrimary2" name="r2" />  ตลอดชีพ
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group row">
                                                <div class="col-md-4 col-form-label">วันหมดอายุ</div>
                                                <div class="col-sm-6">
                                                    <div class="input-group date" id="reservationdate" data-target-input="nearest">
                                                        <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate" />
                                                        <div class="input-group-append" data-target="#reservationdate" data-toggle="datetimepicker">
                                                            <div class="input-group-text"><i class="fa fa-calendar-alt"></i></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="form-group row">
                                        <label class="col-md-12">สามารถและพร้อมที่จะเดินทางไปปฏิบัติงานในสถานที่ต่างๆ ได้หรือไม่เพราะเหตุใด</label>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="form-group row">
                                        <div class="icheck-primary d-inline col-form-label">
                                            <input type="radio" id="radioPrimary1" name="r1" checked="" /> ได้
                                        </div>
                                        <div class="icheck-primary d-inline col-form-label">
                                            <input type="radio" id="radioPrimary2" name="r2" /> ไม่ได้
                                        </div>
                                        <div class="icheck-primary d-inline col-form-label">
                                            <input type="radio" id="radioPrimary2" name="r2" /> อื่นๆ
                                        </div>
                                        <div class="icheck-primary d-inline col-form-label" style="">
                                            <input type="" class="form-control" id="" placeholder="อื่นๆ" />
                                        </div>
                                    </div>
                                </section>
                                {/* <!--Frame--> */}
                                <div class="line_btn">
                                    <button type="submit" formaction="application2.php" class="btn b-previous"> <i class="fas fa-angle-left"></i>&nbsp; ก่อนหน้า  </button>
                                    <button type="submit" formaction="application4.php" class="btn b-next"> ต่อไป &nbsp; <i class="fas fa-angle-right"></i></button>
                                </div>
                            </form>
                        </div>
                        {/* <!-- /.container-fluid --> */}
                    </section>
                    {/* <!-- /.content --> */}
                </div>
            </div>
        </body>
    )
}

export default application3