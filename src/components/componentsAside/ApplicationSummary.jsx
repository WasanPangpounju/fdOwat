import React from 'react'

import '../editwindowcss.css';

function application_summary() {
    return (
        <body class="hold-transition sidebar-mini" className='editlaout'>
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
                                <h1 class="m-0"><i class="far fa-arrow-alt-circle-right"></i> ข้อมูลสมัครงาน</h1>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /.content-header -->
                    <!-- Main content --> */}
                    <section class="content">
                        <div class="container-fluid">
                            <form id="myForm" action="#">
                                <section class="clr">
                                    <div class="m-b row">
                                        <div class="col-md-2 form-detail">วันที่เริ่มงาน</div>
                                        <div class="col-md-5 form-detail">10/04/2566 </div>
                                    </div>
                                    <div class="m-b row">
                                        <div class="col-md-2 form-detail">ตำแหน่งงาน</div>
                                        <div class="col-md-5 form-detail">พนักงานทำความสะอาด </div>
                                    </div>
                                    <div class="m-b row">
                                        <div class="col-md-2 form-detail">แผนก</div>
                                        <div class="col-md-5 form-detail">แม่บ้าน </div>
                                    </div>
                                </section>
                                <h2 class="head-a">ทราบข่าวการสมัคร</h2>
                                <section class="clr">
                                    <div class="m-b row">
                                        <div class="col-md-2 form-detail">อื่นๆ </div>
                                        <div class="col-md-5 form-detail">xxxxxxxxxxxxxx </div>
                                    </div>
                                </section>
                                <h2 class="head-a">บัตรประกันสังคม</h2>
                                <section class="clr">
                                    <div class="m-b row">
                                        <div class="col-md-2 form-detail">มีประกันสังคม </div>
                                        <div class="col-md-5 form-detail">xxxxxxxxxxxxxx </div>
                                    </div>
                                </section>
                                <h2 class="head-a">ประวัติข้อมูลส่วนตัว</h2>
                                <section class="clr">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">คำนำหน้า </div>
                                                <div class="col-md-6 form-detail">ชาย </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">ชื่อจริง นามสกุล</div>
                                                <div class="col-md-6 form-detail">สมชาย ฉันทเศรษฐ</div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">บัตรประจำตัวประชาชน</div>
                                                <div class="col-md-6 form-detail">0000000000000</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">สัญชาติ </div>
                                                <div class="col-md-6 form-detail">ไทย </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">เชื้อชาติ</div>
                                                <div class="col-md-6 form-detail">ไทย</div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">ศาสนา</div>
                                                <div class="col-md-6 form-detail">พุทธ</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">วันเดือนปีเกิด</div>
                                                <div class="col-md-6 form-detail">10/04/2566 </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">อายุ</div>
                                                <div class="col-md-6 form-detail">30 ปี</div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">สถานที่เกิด</div>
                                                <div class="col-md-6 form-detail">โรงพยาบาล</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--row--> */}
                                </section>
                                {/* <!--clr--> */}

                                <h2 class="head-a">ที่อยู่ตามบัตรประชาชน</h2>
                                <section class="clr">
                                    <div class="m-b row">
                                        <div class="col-md-2 form-detail">ที่อยู่</div>
                                        <div class="col-md-8 form-detail">หมู่บ้าน - เลขที่ 630 ซอย - ถนนสุรนารี ตำบลในเมือง อำเภอเมือง รหัสไปรษณีย์ 30000 </div>
                                    </div>

                                    <div class="m-b row">
                                        <div class="col-md-2 form-detail">โทรศัพท์</div>
                                        <div class="col-md-5 form-detail">0250224896 </div>
                                    </div>
                                    {/* <!--row--> */}
                                </section>
                                {/* <!--clr--> */}
                                <h2 class="head-a">ที่อยู่ปัจจุบัน</h2>
                                <section class="clr">
                                    <div class="m-b row">
                                        <div class="col-md-2 form-detail">สถานะ</div>
                                        <div class="col-md-8 form-detail">เป็นเจ้าของ</div>
                                    </div>
                                    <div class="m-b row">
                                        <div class="col-md-2 form-detail">ที่อยู่</div>
                                        <div class="col-md-8 form-detail">หมู่บ้าน - เลขที่ 630 ซอย - ถนนสุรนารี ตำบลในเมือง อำเภอเมือง รหัสไปรษณีย์ 30000 </div>
                                    </div>
                                    <div class="m-b row">
                                        <div class="col-md-2 form-detail">โทรศัพท์</div>
                                        <div class="col-md-5 form-detail">0250224896 </div>
                                    </div>
                                    {/* <!--row--> */}
                                </section>
                                {/* <!--clr--> */}
                                <h2 class="head-a">สถานะครอบครัว</h2>
                                <section class="clr">
                                    <div class="m-b row">
                                        <div class="col-md-2 form-detail">สถานะครอบครัว</div>
                                        <div class="col-md-8 form-detail">สมรส</div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">ชื่อ-นามสกุลคู่สมรส </div>
                                                <div class="col-md-6 form-detail">xxxxxxxxxxxxxxxxxxxxxxxx</div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">สัญชาติ</div>
                                                <div class="col-md-6 form-detail">xxxxxx</div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">อาชีพ</div>
                                                <div class="col-md-6 form-detail">0000000000000</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">สถานที่ทำงาน </div>
                                                <div class="col-md-6 form-detail">xxxxxxxxxxxxxxxxxxxxxxxx</div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">โทรศัพท์</div>
                                                <div class="col-md-6 form-detail">xxxxxx</div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">มือถือ</div>
                                                <div class="col-md-6 form-detail">0000000000000</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="m-b row">
                                        <div class="col-md-2 form-detail">ทะเบียนสมรส</div>
                                        <div class="col-md-8 form-detail">มี</div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-7 form-detail">บุตรที่อายุต่ำกว่า 6 ปี มีจำนวน </div>
                                                <div class="col-md-4 form-detail">2 คน</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <ol>
                                            <li>
                                                <label class="col-form-label" style={{ paddingRight: "10px" }}>เกิดวันที่ 20</label>
                                                <label class="col-form-label" style={{ paddingRight: "10px" }}>เดือนเมษายน</label>
                                                <label class="col-form-label">พ.ศ. 2550</label>
                                            </li>
                                            <li>
                                                <label class="col-form-label" style={{ paddingRight: "10px" }}>เกิดวันที่ 10</label>
                                                <label class="col-form-label" style={{ paddingRight: "10px" }}>เดือนเมษายน</label>
                                                <label class="col-form-label">พ.ศ. 2550</label>
                                            </li>
                                        </ol>
                                    </div>
                                </section>
                                {/* <!--clr--> */}
                                <h2 class="head-a">ในกรณีเกิดอุบัติเหตุหรือเรื่องฉุกเฉิน บุคคลที่ท่านต้องการให้ติดต่อด้วยคือ</h2>
                                <section class="clr">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">ชื่อ-นามสกุล</div>
                                                <div class="col-md-6 form-detail">xxxxxxxxxxxxxxxxxxxxxxxx</div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">ความเกี่ยวข้อง</div>
                                                <div class="col-md-6 form-detail">xxxxxx</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="m-b row">
                                        <div class="col-md-2 form-detail">เบอร์โทรศัพท์ที่ติอต่อได้</div>
                                        <div class="col-md-6 form-detail">xxxxxxxxxxxxxxxxxxxxxxxx</div>
                                    </div>
                                </section>
                                {/* <!--clr--> */}
                                <h2 class="head-a">ความสามารถพิเศษ</h2>
                                <section class="clr">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">ใบขับขี่จักรยานยนต์</div>
                                                <div class="col-md-6 form-detail">ได้</div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">ใบขับขี่รถยนต์</div>
                                                <div class="col-md-6 form-detail">ได้</div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">ใบอนุญาติขับขี่เลขที่</div>
                                                <div class="col-md-6 form-detail">0000000000</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">ใบอนุญาตขับขี่ประเภท</div>
                                                <div class="col-md-6 form-detail">ตลอดชีพ</div>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="m-b row">
                                                <div class="col-md-6 form-detail">วันหมดอายุ</div>
                                                <div class="col-md-6 form-detail">10/04/2566</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!--row--> */}
                                    <div class="m-b row">
                                        <div class="col-md-12 form-detail">สามารถและพร้อมที่จะเดินทางไปปฏิบัติงานในสถานที่ต่างๆ ได้หรือไม่เพราะเหตุใด</div>
                                    </div>
                                    <div class="m-b row">
                                        <div class="col-md-2 form-detail">อื่นๆ</div>
                                        <div class="col-md-6 form-detail">xxxxxxxxxxxxxxxxxxxxxxx</div>
                                    </div>
                                </section>
                                {/* <!--clr--> */}
                                <h2 class="head-a">ประวัติการศึกษา</h2>
                                <section class="clr">
                                    <div class="m-b row">
                                        <div class="col-md-2 form-detail">ระดับการศึกษา</div>
                                        <div class="col-md-6 form-detail">xxxxxxxxxxxxxxxxxxxxxxx</div>
                                    </div>
                                    <div class="m-b row">
                                        <div class="col-md-2 form-detail">ชื่อสถานศึกษา</div>
                                        <div class="col-md-6 form-detail">xxxxxxxxxxxxxxxxxxxxxxx</div>
                                    </div>
                                </section>
                                {/* <!--clr--> */}
                                <h2 class="head-a">ประวัติการทำงาน</h2>
                                <section class="clr">
                                    <ol class="work-history">
                                        <li>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">ระยะเวลา</label>
                                                <div class="col-md-7">
                                                    <div class="row">
                                                        <label class="col-md-1 col-form-label">ตั้งแต่</label>
                                                        <div class="col-md-2 col-form-label">
                                                            1/04/2566
                                                        </div>
                                                        <div class="col-md-1 col-form-label">จนถึง</div>
                                                        <div class="col-md-2 col-form-label">
                                                            10/04/2566
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">ชื่อบริษัท</label>
                                                <div class="col-md-5 col-form-label">
                                                    xxxxxxxxxxxxxxxxxx
                                                </div>
                                            </div>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">ตำแหน่งหน้าที่</label>
                                                <div class="col-md-5 col-form-label">
                                                    xxxxxxxxxxxxxxxxx
                                                </div>
                                            </div>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">เงินเดือน</label>
                                                <div class="col-md-5 col-form-label">
                                                    xxxxxxxxxxxxxxxxx
                                                </div>
                                            </div>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">เหตุผลที่ออก</label>
                                                <div class="col-md-5 col-form-label">
                                                    xxxxxxxxxxxxxxxxx
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">ระยะเวลา</label>
                                                <div class="col-md-7">
                                                    <div class="row">
                                                        <label class="col-md-1 col-form-label">ตั้งแต่</label>
                                                        <div class="col-md-2 col-form-label">
                                                            1/04/2566
                                                        </div>
                                                        <div class="col-md-1 col-form-label">จนถึง</div>
                                                        <div class="col-md-2 col-form-label">
                                                            10/04/2566
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">ชื่อบริษัท</label>
                                                <div class="col-md-5 col-form-label">
                                                    xxxxxxxxxxxxxxxxxx
                                                </div>
                                            </div>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">ตำแหน่งหน้าที่</label>
                                                <div class="col-md-5 col-form-label">
                                                    xxxxxxxxxxxxxxxxx
                                                </div>
                                            </div>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">เงินเดือน</label>
                                                <div class="col-md-5 col-form-label">
                                                    xxxxxxxxxxxxxxxxx
                                                </div>
                                            </div>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">เหตุผลที่ออก</label>
                                                <div class="col-md-5 col-form-label">
                                                    xxxxxxxxxxxxxxxxx
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">ระยะเวลา</label>
                                                <div class="col-md-7">
                                                    <div class="row">
                                                        <label class="col-md-1 col-form-label">ตั้งแต่</label>
                                                        <div class="col-md-2 col-form-label">
                                                            1/04/2566
                                                        </div>
                                                        <div class="col-md-1 col-form-label">จนถึง</div>
                                                        <div class="col-md-2 col-form-label">
                                                            10/04/2566
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">ชื่อบริษัท</label>
                                                <div class="col-md-5 col-form-label">
                                                    xxxxxxxxxxxxxxxxxx
                                                </div>
                                            </div>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">ตำแหน่งหน้าที่</label>
                                                <div class="col-md-5 col-form-label">
                                                    xxxxxxxxxxxxxxxxx
                                                </div>
                                            </div>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">เงินเดือน</label>
                                                <div class="col-md-5 col-form-label">
                                                    xxxxxxxxxxxxxxxxx
                                                </div>
                                            </div>
                                            <div class="row">
                                                <label class="col-md-2 col-form-label">เหตุผลที่ออก</label>
                                                <div class="col-md-5 col-form-label">
                                                    xxxxxxxxxxxxxxxxx
                                                </div>
                                            </div>
                                        </li>
                                    </ol>
                                </section>
                                {/* <!--clr--> */}
                                <div class="line_btn">
                                    <button type="submit" formaction="application2.php" class="btn b-previous"> <i class="fas fa-angle-left"></i>&nbsp; ก่อนหน้า  </button>
                                    <button type="button" class="btn b_save" data-toggle="modal" data-target="#modal-default">
                                        สมัครงาน &nbsp; <i class="fas fa-angle-right"></i>
                                    </button>
                                </div>

                                {/* <!-- modal --> */}
                                <section>
                                    <div class="modal fade" id="modal-default">
                                        <div class="modal-dialog modal-xl">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h4 class="modal-title">ข้อตกลงและเงื่อนไขในการสมัครงาน</h4>
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body">
                                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.</p>

                                                    <p>Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit.</p>

                                                    <p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit.</p>

                                                    <p>Sed lectus. Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris.</p>
                                                    <div>
                                                        <p>Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet.</p>
                                                        <p>Sed lectus. Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris.</p>
                                                        <div>
                                                            <p>Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue. Proin sodales libero eget ante. Nulla quam. Aenean laoreet.</p>
                                                            <div>
                                                                <div>
                                                                    <div class="tacbox">
                                                                        <input id="accept" type="checkbox" />
                                                                        <label for="checkbox"> ฉันยอมรับ <a href="#">ข้อกำหนดและเงื่อนไขเหล่านี้</a>.</label>
                                                                    </div>
                                                                </div>
                                                                <div class="modal-footer justify-content-between">
                                                                    <button class="btn clean" type="button" data-dismiss="modal"><i class="far fa-window-close"></i> &nbsp;ยกเลิก</button>
                                                                    <button type="submit" id="apply" class="btn b_save" disabled><i class="fas fa-envelope"></i> &nbsp; สมัครงาน  </button>
                                                                </div>
                                                            </div>
                                                            {/* <!-- /.modal-content --> */}
                                                        </div>
                                                        {/* <!-- /.modal-dialog --> */}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        {/* <!-- /.container-fluid --> */}
                                    </div>
                                </section>
                                {/* <!-- /.content --> */}
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </body>
    )
}

export default application_summary