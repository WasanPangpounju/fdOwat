import React from 'react'

function application2() {
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
                                <h2 class="title">สถานะครอบครัว</h2>
                                <section class="Frame">
                                    <div class="row form-group">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" id="" value="" />
                                            <label class="form-check-label" for="">โสด</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" id="" value="" />
                                            <label class="form-check-label" for="">หมั้น</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" id="" value="" />
                                            <label class="form-check-label" for="">สมรส</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" id="" value="" />
                                            <label class="form-check-label" for="">หย่าร้าง</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" id="" value="" />
                                            <label class="form-check-label" for="">หม้าย</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" id="" value="" />
                                            <label class="form-check-label" for="">แยกกันอยู่</label>
                                        </div>
                                    </div>
                                    {/* <!-- row--> */}
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>ชื่อ-นามสกุลคู่สมรส</label>
                                                <input type="" class="form-control" id="" placeholder="ชื่อ-นามสกุลคู่สมรส" />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>สัญชาติ</label>
                                                <input type="" class="form-control" id="" placeholder="สัญชาติ" />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>อาชีพ</label>
                                                <input type="" class="form-control" id="" placeholder="อาชีพ" />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>สถานที่ทำงาน</label>
                                                <input type="" class="form-control" id="" placeholder="สถานที่ทำงาน" />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>โทรศัพท์</label>
                                                <input type="" class="form-control" id="" placeholder="โทรศัพท์" />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>มือถือ</label>
                                                <input type="" class="form-control" id="" placeholder="มือถือ" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- row--> */}

                                    <div class="form-group row">
                                        <label class="d-inline-block" style={{ marginLeft: "10px" }}>ทะเบียนสมรส</label>
                                        <div class="col-sm-9">
                                            <div class="icheck-primary d-inline">
                                                <input type="radio" id="" name="" checked="" /> มี
                                            </div>
                                            <div class="icheck-primary d-inline">
                                                <input type="radio" id="" name="" />  ไม่มี
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group row">
                                                <div class="col-md-4 col-form-label">จำนวนบุตร</div>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder="0" />
                                                </div>
                                                <label class="col-md-1 col-form-label">คน</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="row">
                                                <label class="col-md-4 col-form-label">กำลังศึกษา</label>
                                                <div class="col-md-5">
                                                    <input type="" class="form-control" id="" placeholder="0" />
                                                </div>
                                                <label class="col-md-1 col-form-label">คน</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row form-group">
                                        <div class="col-md-3 col-form-label">บุตรที่อายุต่ำกว่า 6 ปี มีจำนวน</div>
                                        <div class="col-md-2">
                                            <input type="" class="form-control" id="" placeholder="0" />
                                        </div>
                                        <label class="col-md-1 col-form-label">คน</label>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="row">
                                        <ol>
                                            <li>
                                                <div class="row">
                                                    <label class="col-md-2 col-form-label">เกิดวันที่</label>
                                                    <div class="col-md-2">
                                                        <select class="form-control">
                                                            <option>1</option>
                                                            <option>2</option>
                                                            <option>option 3</option>
                                                            <option>option 4</option>
                                                            <option>option 5</option>
                                                        </select>
                                                    </div>
                                                    <label class="col-md-1 col-form-label">เดือน</label>
                                                    <div class="col-md-3">
                                                        <select class="form-control">
                                                            <option>มกราคม</option>
                                                            <option>option 2</option>
                                                            <option>option 3</option>
                                                            <option>option 4</option>
                                                            <option>option 5</option>
                                                        </select>
                                                    </div>
                                                    <label class="col-md-1 col-form-label">พ.ศ.</label>
                                                    <div class="col-md-2">
                                                        <input type="" class="form-control" id="" placeholder="โปรดระบุ" />
                                                    </div>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>
                                </section>
                                {/* <!--Frame--> */}
                                <section class="Frame">
                                    <h2 class="title">ในกรณีเกิดอุบัติเหตุหรือเรื่องฉุกเฉิน บุคคลที่ท่านต้องการให้ติดต่อด้วยคือ</h2>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>ชื่อ</label>
                                                <input type="" class="form-control" id="" placeholder="ชื่อ" />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>นามสกุล</label>
                                                <input type="" class="form-control" id="" placeholder="นามสกุล" />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>ความเกี่ยวข้อง</label>
                                                <input type="" class="form-control" id="" placeholder="ความเกี่ยวข้อง" />
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>เบอร์โทรศัพท์ที่ติอต่อได้</label>
                                                <input type="" class="form-control" id="" placeholder="เบอร์โทรศัพท์ที่ติอต่อได้" />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                {/* <!--Frame--> */}
                                <div class="line_btn">
                                    <button type="submit" formaction="application1.php" class="btn b-previous"> <i class="fas fa-angle-left"></i>&nbsp; ก่อนหน้า  </button>
                                    <button type="submit" formaction="application3.php" class="btn b-next"> ต่อไป &nbsp; <i class="fas fa-angle-right"></i></button>
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

export default application2