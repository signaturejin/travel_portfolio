//시작 전 세팅
const express = require("express");
//데이터베이스의 데이터 입력, 출력을 위한 함수명령어 불러들이는 작업
const MongoClient = require("mongodb").MongoClient;
const moment = require("moment");
//원하는 나라의 시간대로 변경하는 라이브러리 사용
const momentTimezone = require("moment-timezone");

//로그인 검증을 위한 passport 라이브러리 불러들임
const passport = require('passport');
//Strategy(전략) -> 로그인 검증을 하기위한 방법을 쓰기위해 함수를 불러들이는 작업
const LocalStrategy = require('passport-local').Strategy;
//사용자의 로그인 데이터 관리를 위한 세션 생성에 관련된 함수 명령어 사용
const session = require('express-session');
//파일업로드 라이브러리 multer
const multer  = require('multer');

const app = express();
// const port = process.env.PORT || 5000;
const port = 8080;

app.set("view engine","ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static('html'));

//로그인 기능에 필요한 것
app.use(session({secret : 'secret', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());


MongoClient.connect("mongodb+srv://admin:qwer1234@testdb.qmmqvc3.mongodb.net/?retryWrites=true&w=majority",function(err,result){
    //에러가 발생했을경우 메세지 출력(선택사항)
    if(err) { return console.log(err); }

    //위에서 만든 db변수에 최종연결 ()안에는 mongodb atlas 사이트에서 생성한 데이터베이스 이름
    db = result.db("travel_db");

    //db연결이 제대로 됬다면 서버실행
    app.listen(port,function(){
        console.log("서버연결 성공");
    });
});

//메인페이지 경로 요청
app.get("/",function(req,res){
    db.collection("popular_local").find({}).toArray(function(err,result){
        res.render("index", {userData:req.user,popular_list:result});
    });
});

//호텔(서브페이지) 경로 요청
app.get("/hotel",function(req,res){
    res.render("travel_hotel", {userData:req.user});
});

//나머지 서브페이지 경로 요청
app.get("/nothing",function(req,res){
    res.render("nothing", {userData:req.user});
});

//파일첨부 어디에 저장할 것인지에 대한 기능
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //저장 경로
      cb(null, 'html/upload')
    },
    filename: function (req, file, cb) {
        //한글 안깨지기 위한 명령어
      cb(null, file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8') )
    }
  })
  
const upload = multer({ storage: storage })

//게시판 작성페이지 경로 요청
app.get("/insert",function(req,res){
    res.render("travel_insert", {userData:req.user});
});

//게시판 작성데이터 데이터베이스에 저장
app.post("/insertAdd",upload.single('file'),function(req,res){
    db.collection("travel_count").findOne({name:"게시판"},function(err,cResult){
        db.collection("travel_board").insertOne({
            brd_no: cResult.boardCount + 1,                                     //게시글 번호
            user_id: req.body.user_brd_id,                                      //사용자 아이디
            user_name: req.user.member_name,                                           //사용자 이름
            user_title: req.body.title,                                         //게시글 제목
            user_file: req.file.originalname,                                   //올린 파일
            user_context: req.body.context,                                     //작성내용
            user_review: 0,                                                     //조회수
            insert_date:moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm") //작성날짜
        },function(err,bResult){
            db.collection("travel_count").updateOne({name:"게시판"},{$inc:{boardCount:1}},function(err,cResult){
                res.redirect("/list");
            });
        });
    });
});

//게시판 목록페이지 경로 요청
app.get("/list",function(req,res){
    db.collection("travel_board").find().toArray(function(err,result){
        res.render("travel_list",{brdData:result, userData:req.user});
    });
});

//게시판 상세페이지 경로 요청
app.get("/detail/:no",function(req,res){
    //해당경로를 들어갈때마다 db에 저장된 user_review의 숫자를 1씩 증가시킨다.
    db.collection("travel_board").updateOne({brd_no:Number(req.params.no)},{$inc:{user_review:1}},function(err,result){
        //목록페이지의 h3태그에서 게시판번호를 받아온다(req.params.위 경로에 적은 no를 똑같이 써줌)
        db.collection("travel_board").findOne({brd_no:Number(req.params.no)},function(err,bResult){
            //데이터베이스에 저장된 댓글 가져오기
            db.collection("travel_comment").find({prd_no: bResult.brd_no}).toArray(function(err,cResult){
                res.render("travel_detail",{brdData:bResult, userData:req.user, comData: cResult});
            });
        });
    });
});

//게시판 댓글 데이터베이스에 저장
app.post("/comment",function(req,res){
    //몇번 댓글인지 알기위해 번호 부여
    db.collection("travel_count").findOne({name:"댓글"},function(err,cResult){
        //게시글 번호도 같이 부여
        db.collection("travel_board").findOne({brd_no: Number(req.body.prd_no)},function(err,bResult){
            //데이터베이스에 댓글 저장
            db.collection("travel_comment").insertOne({
                //댓글번호
                com_no: cResult.commentCount + 1,
                prd_no: bResult.brd_no,
                com_context: req.body.comment,
                com_id: req.user.member_id,
                com_name: req.user.member_name,
                com_date: moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm")
                //해당 게시판 번호
            },function(err,result){
                db.collection("travel_count").updateOne({name:"댓글"},{$inc:{commentCount:1}},function(err,result){
                    res.redirect("/detail/" + req.body.prd_no);
                });
            });
        });
    });
});

//게시판 삭제 기능
app.get("/delete/:no",function(req,res){
    db.collection("travel_board").deleteOne({brd_no: Number(req.params.no)},function(err,result){
        res.redirect("/list");
    });
});

//게시판 수정페이지 경로 요청
app.get("/update/:no",function(req,res){
    db.collection("travel_board").findOne({brd_no: Number(req.params.no)},function(err,result){
        res.render("travel_update",{brdData:result, userData:req.user});
    });
});

//게시판 수정 기능
app.post("/updateAdd",upload.single('file'),function(req,res){
    db.collection("travel_board").updateOne({brd_no: Number(req.body.brd_no)},{$set:{
        user_title: req.body.title,                                         //게시글 제목
        user_file: req.file.originalname,                                   //올린 파일
        user_context: req.body.context                                      //작성내용
    }},function(err,result){
        res.redirect("/detail/" + req.body.brd_no);
    });
});

//회원가입 페이지 경로 요청
app.get("/join",function(req,res){
    res.render("join");
});

//회원의 데이터를 데이터베이스에 저장
app.post("/joinAdd",function(req,res){
    db.collection("travel_join").findOne({member_id: req.body.id},function(err,result){
        if(result){
            res.send("<script>alert('이미 가입된 회원입니다.'); location.href='/join'</script>")
        }
        else{
            db.collection("travel_count").findOne({name:"회원수"},function(err,result){
                db.collection("travel_join").insertOne({
                    member_no: result.joinCount + 1,
                    member_id: req.body.id,
                    member_pass: req.body.pass,
                    member_name: req.body.name,
                    member_email: req.body.email,
                    member_phone: req.body.phone,
                    join_date: moment().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm")
                },function(err,result){
                    db.collection("travel_count").updateOne({name:"회원수"},{$inc:{joinCount:1}},function(err,result){
                        // res.redirect("/login");
                        res.send("<script>alert('회원가입이 완료되었습니다!'); location.href='/login';</script>");
                    });
                });
            });
        }
    });

}); 

//로그인 페이지 경로 요청
app.get("/login",function(req,res){
    res.render("login");
});

//로그인 기능
//실제 로그인 검증하는 경로로 요청 -> function 전에 검증을 위한 passport 실행
//failureRedirect -> 잘못입력했을경우 이동될 경로
//function(req,res){} <-- 여기다가 적는거는 아이디 비번 제대로 입력시 어떤페이지로 이동될 것인지 경로
app.post("/loginCheck",passport.authenticate('local', {failureRedirect : '/fail'}),
function(req,res){
    res.redirect("/"); //로그인 성공시 메인페이지로 이동
});

passport.use(new LocalStrategy({
    usernameField: 'login_id', //login.ejs에서 입력한 아이디의 name값
    passwordField: 'login_pass', //login.ejs에서 입력한 비밀번호의 name값
    session: true, //세션을 사용하겠습니까?
    passReqToCallback: false, //아이디와 비번말고도 다른항목들을 더 검사할 것인지 여부
  }, function (user_id, user_pw, done) { //id password 작명한거임(입력한 input값 담는 변수)
    // 로그인 제대로 되는지 확인
    // console.log(user_id, user_pw);
    db.collection('travel_join').findOne({ member_id: user_id }, function (err, result) {
      if (err) return done(err)
      //잘못 입력했을 때

      if (!result) return done(null, false, { message: '존재하지않는 아이디입니다.' })
      if (user_pw == result.member_pass) {
        return done(null, result)
      } else {
        return done(null, false, { message: '비밀번호가 맞지 않습니다.' })
      }
    })
}));

//데이터베이스에 있는 아이디와 비번이 일치하면
//세션을 생성하고 해당 아이디와 비번을 기록하여 저장하는 작업
passport.serializeUser(function (user, done) {
    done(null, user.member_id) //데이터베이스에 있는 아이디가 저장되어있는 프로퍼티 명 기술(user.뒤에)
});
 
//만들어진 세션을 전달해서 다른페이지에서도 해당 세션을 사용할 수 있도록 처리(페이지 접근제한)
passport.deserializeUser(function (member_id, done) {
    //데이터베이스에 있는 로그인했을때 아이디만 불러와서
    //다른페이지에서도 세션을 사용할 수 있도록 처리
    db.collection("travel_join").findOne({member_id: member_id},function(err,result){
        done(null,result); //데이터베이스에서 가지고 온 아이디 -> 세션에 넣어서 다른페이지들에 전달
    });
});

//로그아웃 기능
app.get("/logout",function(req,res){
    req.session.destroy(function(err){
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});

//로그인 실패 경로 요청
app.get("/fail",function(req,res){
    res.render("fail");
});