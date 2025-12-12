var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var employeesRouter = require('./routes/employees');
var employeesoutsideRouter = require('./routes/employeesoutside');
var workplacesRouter = require('./routes/workplaces');
var timerecordsRouter = require('./routes/timerecords');
var timerecordsoutsideRouter = require('./routes/timerecordsoutside');
var concludeRouter = require('./routes/conclude');
var accountingRouter = require('./routes/account');
var welfareRouter = require('./routes/welfare');
var leaveRouter = require('./routes/leave');
var basicSettingRouter = require('./routes/basicSetting');
var outsiderRouter = require('./routes/outsiderTimerecord');

var addsalaryRouter = require('./routes/addsalary');
var oldemployeesRouter = require('./routes/oldemployees');
var imgemployeeRouter = require('./routes/imgemployee');
var uploadRouter = require('./routes/upload');
var specialShiftApprovalRouter = require('./routes/specialShiftApproval');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/employee', employeesRouter);
app.use('/employeeoutside', employeesoutsideRouter);
app.use('/workplace', workplacesRouter);
app.use('/timerecord', timerecordsRouter );
app.use('/timerecordoutside', timerecordsoutsideRouter );
app.use('/addsalary', addsalaryRouter );
app.use('/oldemployee', oldemployeesRouter);
app.use('/imgemployee', imgemployeeRouter);
app.use('/conclude', concludeRouter );
app.use('/accounting', accountingRouter );
app.use('/welfare', welfareRouter);
app.use('/leave', leaveRouter);
app.use('/api', uploadRouter);
app.use('/basicsetting', basicSettingRouter);
app.use('/outsider', outsiderRouter);
app.use('/timerecord', specialShiftApprovalRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
