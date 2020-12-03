var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');

var db = admin.database().ref();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login');
});

router.post('/', function(req, res, next) {
    var name = req.body.username;
    var pwd = req.body.pass;

    if (name.toLowerCase() == "sathish") {
        if (pwd == "8088684138") {
            res.redirect('/secured/home/');
        } else {
            res.send("Invalid password");
        }
    } else {
        res.send("Invalid username")
    }
});
router.get('/secured/home/', function(req, res, next) {
    var d = new Date();
    var dd = d.getDate();
    var m = d.getMonth() + 1;
    var y = d.getFullYear();
    var date = dd + '/' + m + '/' + y;
    res.render('index', { title: 'Attendance', date: date, info: null, morning: false, evening: false, empty: false });
});


router.get('/secured/morning/', function(req, res, next) {
    var map = {};
    var info = {};
    var d = new Date();
    var dd = d.getDate();
    var m = d.getMonth() + 1;
    var month = "";
    switch (m) {
        case 1:
            month = "Jan";
            break;
        case 2:
            month = "Feb";
            break;
        case 3:
            month = "Mar";
            break;
        case 4:
            month = "Apr";
            break;
        case 5:
            month = "May";
            break;
        case 6:
            month = "Jun";
            break;
        case 7:
            month = "Jul";
            break;
        case 8:
            month = "Aug";
            break;
        case 9:
            month = "Sep";
            break;
        case 10:
            month = "Oct";
            break;
        case 11:
            month = "Nov";
            break;
        case 12:
            month = "Dec";
            break;
    }
    var y = d.getFullYear();
    if (dd < 10) {
        var dd = "0" + dd;
    }
    if (m < 10) {
        var m = "0" + m;
    }
    var date = dd + '-' + m + '-' + y;
    console.log(month, date);
    db.child("Details").child(month).child(date).once("value", function(snapshot) {
        if (snapshot.val() != null) {
            map = snapshot.val();
            for (var key in map) {
                if ("Morning" in map[key]) {
                    info[key] = map[key];
                }
            }
            var k = 0;
            for (var key in info) {
                k = 1;
                break;
            }
            if (k == 0) {
                res.render('index', { title: 'Attendance', date: date, info: null, morning: false, evening: false, empty: true });
            } else {
                res.render('index', { title: 'Attendance', date: date, info: info, morning: true, evening: false, empty: false });
            }
        } else {
            res.render('index', { title: 'Attendance', date: date, info: null, morning: false, evening: false, empty: true });
        }
    });
});

router.get('/secured/evening/', function(req, res, next) {
    var map = {};
    var info = {};
    var d = new Date();
    var dd = d.getDate();
    var m = d.getMonth() + 1;
    var month = "";
    switch (m) {
        case 1:
            month = "Jan";
            break;
        case 2:
            month = "Feb";
            break;
        case 3:
            month = "Mar";
            break;
        case 4:
            month = "Apr";
            break;
        case 5:
            month = "May";
            break;
        case 6:
            month = "Jun";
            break;
        case 7:
            month = "Jul";
            break;
        case 8:
            month = "Aug";
            break;
        case 9:
            month = "Sep";
            break;
        case 10:
            month = "Oct";
            break;
        case 11:
            month = "Nov";
            break;
        case 12:
            month = "Dec";
            break;
    }
    var y = d.getFullYear();
    if (dd < 10) {
        var dd = "0" + dd;
    }
    if (m < 10) {
        var m = "0" + m;
    }
    var date = dd + '-' + m + '-' + y;
    console.log(month, date);
    db.child("Details").child(month).child(date).once("value", function(snapshot) {
        if (snapshot.val() != null) {
            map = snapshot.val();
            for (var key in map) {
                if ("Evening" in map[key]) {
                    info[key] = map[key];
                }
            }
            var k = 0;
            for (var key in info) {
                k = 1;
                break;
            }
            if (k == 0) {
                res.render('index', { title: 'Attendance', date: date, info: null, morning: false, evening: false, empty: true });
            } else {
                res.render('index', { title: 'Attendance', date: date, info: info, morning: false, evening: true, empty: false });
            }
        } else {
            res.render('index', { title: 'Attendance', date: date, info: null, morning: false, evening: false, empty: true });
        }
    });
});

router.get('/secured/users/', function(req, res, next) {
    var map = {}
    var users = db.child("Users");
    users.once("value", function(snapshot) {
        if (snapshot != null) {
            map = snapshot.val();
            res.render('user', { title: "Users", info: map, empty: false, add: false, show: true });
        } else {
            res.render('user', { title: "Users", info: null, empty: true, add: false, show: false });
        }
    });
});

router.get('/secured/adduser/', function(req, res, next) {
    res.render('user', { title: "Users", info: null, empty: false, add: true, show: false });
});

router.post('/secured/adduser/', function(req, res, next) {
    var map = {}
    var users = db.child("Users");
    var name = req.body.username;
    var pwd = req.body.pwd;
    data = {
        Username: name,
        Password: pwd
    }
    users.child(name).set(data);
    res.redirect('/secured/users/')
});

router.get('/secured/delete/:name', function(req, res, next) {
    var name = req.params.name;
    users = db.child('Users');
    users.child(name).remove();
    res.redirect('/secured/users/');
});

router.get('/secured/attendance/', function(req, res, next) {
    res.render('attendance', { title: "Attendance", info: null, choose: true, show: false, fulldays: null, halfdays: null });
});

router.post('/secured/attendance/', function(req, res, next) {
    var month = req.body.month;
    var map = {}
    var temp = {}
    var info = {}
    var mon = "";
    var fulldays = {}
    var halfdays = {}
    switch (month) {
        case "Jan":
            mon = "January";
            break;
        case "Feb":
            mon = "February";
            break;
        case "Mar":
            mon = "March";
            break;
        case "Apr":
            mon = "April";
            break;
        case 5:
            mon = "May";
            break;
        case "Jun":
            mon = "June";
            break;
        case "Jul":
            mon = "July";
            break;
        case "Aug":
            mon = "August";
            break;
        case "Sep":
            mon = "September";
            break;
        case "Oct":
            mon = "October";
            break;
        case "Nov":
            mon = "November";
            break;
        case "Dec":
            mon = "December";
            break;
    }
    db.child("Details").child(month).once("value", function(snap) {
        temp = snap.val();
        db.child('Users').once("value", function(snapshot) {
            map = snapshot.val();
            for (var key in map) {
                var dates = {}
                for (var k in temp) {
                    if (key in temp[k]) {
                        dates[k] = temp[k];
                    }
                }
                info[key] = dates;
                for (var i in info) {
                    var k = 0;
                    var m = 0;
                    for (var j in info[i]) {
                        if (info[i][j][i].Morning && info[i][j][i].Evening) {
                            k += 1;
                        }
                        if ((info[i][j][i].Morning && !info[i][j][i].Evening) || (!info[i][j][i].Morning && info[i][j][i].Evening)) {
                            m += 1;
                        }
                    }
                }
                fulldays[key] = k;
                halfdays[key] = m;
            }
            res.render('attendance', { title: "Attendance", info: info, choose: false, show: true, month: mon, fulldays: fulldays, halfdays: halfdays });
        });
    });
});

router.get('/secured/works/', function(req, res, next) {
    res.render('works', { title: 'Works', show: true, empty: false, details: false, info: null, work: null });
});

router.get('/secured/works/:work/', function(req, res, next) {
    var work = req.params.work;
    map = {}
    info = []
    db.child("Works").child(work).once("value", function(snapshot) {
        if (snapshot.val() != null) {
            map = snapshot.val();
            for (var key in map) {
                info.push(map[key]);
            }
            res.render('works', { title: 'Works', show: false, empty: false, details: true, info: info, work: work });
        } else {
            res.render('works', { title: 'Works', show: false, empty: true, details: false, info: null, work: null });
        }
    });
});

router.post('/secured/works/:work/', function(req, res, next) {
    var work = req.params.work;
    var search = req.body.search;
    map = {}
    info = []
    db.child("Works").child(work).once("value", function(snapshot) {
        if (snapshot.val() != null) {
            map = snapshot.val();
            for (var key in map) {
                if (map[key].Uploaded_by == search) {
                    info.push(map[key]);
                }
            }
            res.render('works', { title: 'Works', show: false, empty: false, details: true, info: info, work: work });
        } else {
            res.render('works', { title: 'Works', show: false, empty: true, details: false, info: null, work: null });
        }
    });
});

module.exports = router;