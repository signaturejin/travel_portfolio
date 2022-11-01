// 필요한 태그 생성
const slide_wrap = document.querySelector(".slide");
const view = document.querySelector(".view");
const prev_btn = document.querySelector(".prev");
const next_btn = document.querySelector(".next");
const circle_btn = document.querySelectorAll(".circle");


// 슬라이드 넘겨줄 숫자변수
let num = 0;

// 이전버튼 클릭 시 슬라이드화면 이전으로 이동
prev_btn.addEventListener("click",()=>{
    // 조건 체크
    prev_slide();
    //버튼 비활성화 후 활성화
    circle_on();
});

// 이후버튼 클릭 시 슬라이드화면 이후로 이동
next_btn.addEventListener("click",()=>{
    // 조건 체크
    next_slide();
    //버튼 비활성화 후 활성화
    circle_on();
});

// 반복문 사용하여 동그라미 버튼에 클릭기능 부여
circle_btn.forEach((item,index)=>{
    item.addEventListener("click",()=>{
        // ????????
        // 화면 바뀔때마다 동그라미 버튼도 바꿔줌
        circle_btn.forEach((item,index)=>{
            item.classList.remove("on");
        });
        item.classList.add("on");

        view.style.marginLeft = -100 * index + "%";
    });

});

// 슬라이드 자동실행
let auto_slide = setInterval(()=>{
    // 다음화면으로 자동실행
    next_slide();
    // 화면 바뀔때마다 동그라미 버튼도 바꿔줌
    circle_on();
    // 2초마다 넘김
},2000);

// 마우스 올리면 자동실행 멈춤
slide_wrap.addEventListener("mouseenter",()=>{
    clearInterval(auto_slide);
});

// 마우스 내리면 다시 자동실행
slide_wrap.addEventListener("mouseleave",()=>{
    // auto_slide 변수에 다시 자동실행함수 대입
    auto_slide = setInterval(()=>{
        next_slide();
        circle_on();
    },2000);
});



// 이전화면 넘김 함수
let prev_slide = ()=>{
    if(num == 0){
        num = circle_btn.length - 1;
    }
    else{
        num--;
    }
    view.style.marginLeft = -100 * num + "%";
};

// 다음화면 넘김 함수
let next_slide = ()=>{
    if(num == circle_btn.length - 1){
        num = 0;
    }
    else{
        num++;
    }
    view.style.marginLeft = -100 * num + "%";
};

// 버튼 비활성 후 활성화 함수
let circle_on = ()=>{
    circle_btn.forEach((item,index)=>{
        item.classList.remove("on");
    });
    circle_btn[num].classList.add("on");
};