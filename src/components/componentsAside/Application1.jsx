import React from 'react'

function application1() {
    return (
        // <?php include("include/header.php");?>
        <body class="hold-transition sidebar-mini">
            <div class="wrapper">
                <div class="content-wrapper">
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
                    {/* /.content-header */}
                    {/* Main content */}
                    <section class="content">
                        <div class="container-fluid">
                            <form id="myForm" action="#">
                                <h2 class="title">ที่อยู่ตามบัตรประชาชน</h2>
                                <section class="Frame">
                                    <div class="row">
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <label>หมู่บ้าน</label>
                                                <input type="" class="form-control" id="" placeholder="หมู่บ้าน" />
                                            </div>
                                        </div>
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <label>เลขที่</label>
                                                <input type="" class="form-control" id="" placeholder="เลขที่" />
                                            </div>
                                        </div>
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <label>ตรอก/ซอย</label>
                                                <input type="" class="form-control" id="" placeholder="ตรอก/ซอย" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>ถนน</label>
                                                <input type="" class="form-control" id="" placeholder="ถนน" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>ตำบล</label>
                                                <input type="" class="form-control" id="" placeholder="ตำบล" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>อำเภอ</label>
                                                <input type="" class="form-control" id="" placeholder="อำเภอ" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>จังหวัด</label>
                                                <input type="" class="form-control" id="" placeholder="จังหวัด" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>รหัสไปรษณีย์</label>
                                                <input type="" class="form-control" id="" placeholder="รหัสไปรษณีย์" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>โทรศัพท์</label>
                                                <input type="" class="form-control" id="" placeholder="โทรศัพท์" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--row--> */}
                                </section>
                                <h2 class="title">ที่อยู่ปัจจุบัน</h2>
                                <section class="Frame">
                                    <div class="form-group form-check-inline">
                                        <input class="form-check-input" type="checkbox" id="" value="" style={{ marginLeft: "0px" }} />
                                        <label class="form-check-label">(ที่อยู่เดียวกับบัตรประชาชน)</label>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-1">
                                            <h2 class="title">สถานะ</h2>
                                        </div>
                                        <div class="col-md-10">
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="checkbox" id="" value="" />
                                                <label class="form-check-label">เป็นเจ้าของ</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="checkbox" id="" value="" />
                                                <label class="form-check-label">อยู่กับพ่อแม่</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="checkbox" id="" value="" />
                                                <label class="form-check-label">อยู่กับญาติ</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="checkbox" id="" value="" />
                                                <label class="form-check-label">บ้านเช่า</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="checkbox" id="" value="" />
                                                <label class="form-check-label">หอพัก</label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="row">
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <label>หมู่บ้าน</label>
                                                <input type="" class="form-control" id="" placeholder="หมู่บ้าน" />
                                            </div>
                                        </div>
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <label>เลขที่</label>
                                                <input type="" class="form-control" id="" placeholder="เลขที่" />
                                            </div>
                                        </div>
                                        <div class="col-md-2">
                                            <div class="form-group">
                                                <label>ตรอก/ซอย</label>
                                                <input type="" class="form-control" id="" placeholder="ตรอก/ซอย" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>ถนน</label>
                                                <input type="" class="form-control" id="" placeholder="ถนน" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>ตำบล</label>
                                                <input type="" class="form-control" id="" placeholder="ตำบล" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>อำเภอ</label>
                                                <input type="" class="form-control" id="" placeholder="อำเภอ" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>จังหวัด</label>
                                                <input type="" class="form-control" id="" placeholder="จังหวัด" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>รหัสไปรษณีย์</label>
                                                <input type="" class="form-control" id="" placeholder="รหัสไปรษณีย์" />
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>โทรศัพท์</label>
                                                <input type="" class="form-control" id="" placeholder="โทรศัพท์" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--row--> */}
                                </section>
                                {/* <!--Frame--> */}
                                <div class="line_btn">
                                    <button type="submit" formaction="application.php" class="btn b-previous"> <i class="fas fa-angle-left"></i>&nbsp; ก่อนหน้า  </button>
                                    <button type="submit" formaction="application2.php" class="btn b-next"> ต่อไป &nbsp; <i class="fas fa-angle-right"></i></button>
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

export default application1