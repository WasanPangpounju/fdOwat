import React, { useState } from 'react';

const EmployeeWorkDay = () => {

  return (
    <div>

    <section class="Frame">
    <div class="col-md-12">
        <div class="row">
            <div class="col-md-12">
                <div class="form-group">
                    <label role="personalLeave">วันทำงาน</label>
                    <div class="container" style={{ overflowX: 'scroll' }}>
                        <table id="" class="table table-bordered ">
                            <thead>
                                <tr>
                                    <th style={styles.th} id="test">วันจันทร์</th>
                                    <th style={styles.th} id="test">อังคาร</th>
                                    <th style={styles.th} id="test">พุธ</th>
                                    <th style={styles.th} id="test">พฤหัส</th>
                                    <th style={styles.th} id="test">ศุกร์</th>
                                    <th style={styles.th} id="test">เสาร์</th>
                                    <th style={styles.th} id="test">อาทิตย์</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* <tr>
                                    <td><input type="checkbox" class="form-control" name='' checked={workday1} onChange={handleCheckboxChange1} /></td>
                                    <td><input type="checkbox" class="form-control" name='' checked={workday2} onChange={handleCheckboxChange2} /></td>
                                    <td><input type="checkbox" class="form-control" name='' checked={workday3} onChange={handleCheckboxChange3} /></td>
                                    <td><input type="checkbox" class="form-control" name='' checked={workday4} onChange={handleCheckboxChange4} /></td>
                                    <td><input type="checkbox" class="form-control" name='' checked={workday5} onChange={handleCheckboxChange5} /></td>
                                    <td><input type="checkbox" class="form-control" name='' checked={workday6} onChange={handleCheckboxChange6} /></td>
                                    <td><input type="checkbox" class="form-control" name='' checked={workday7} onChange={handleCheckboxChange7} /></td>
                                </tr>
                                <tr>
                                    <td><input type="text" class="form-control" name='' value={workcount1} onChange={(e) => setWorkcount1(e.target.value)} /></td>
                                    <td><input type="text" class="form-control" name='' value={workcount2} onChange={(e) => setWorkcount2(e.target.value)} /></td>
                                    <td><input type="text" class="form-control" name='' value={workcount3} onChange={(e) => setWorkcount3(e.target.value)} /></td>
                                    <td><input type="text" class="form-control" name='' value={workcount4} onChange={(e) => setWorkcount4(e.target.value)} /></td>
                                    <td><input type="text" class="form-control" name='' value={workcount5} onChange={(e) => setWorkcount5(e.target.value)} /></td>
                                    <td><input type="text" class="form-control" name='' value={workcount6} onChange={(e) => setWorkcount6(e.target.value)} /></td>
                                    <td><input type="text" class="form-control" name='' value={workcount7} onChange={(e) => setWorkcount7(e.target.value)} /></td>
                                </tr> */}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
        {/* <!--row--> */}
    </div>
</section>
</div>

  );
};

export default EmployeeWorkDay;
