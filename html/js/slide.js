// 필요한 태그 생성
const view = document.querySelector(".view");
const prev_btn = document.querySelector(".prev");
const next_btn = document.querySelector(".next");
const circle_btn = document.querySelectorAll(".circle");


//슬라이드 넘겨줄 숫자변수
let num = 0;

prev_btn.addEventListener("click",()=>{
    if(num == 0){
        num = circle_btn.length - 1;
    }
    else{
        num--;
    }
    //버튼 비활성화 후 활성화
    circle_btn.forEach((item,index)=>{
        item.classList.remove("on");
    });
    circle_btn[num].classList.add("on");
    view.style.marginLeft = -100 * num + "%";
});

next_btn.addEventListener("click",()=>{
    if(num == circle_btn.length - 1){
        num = 0;
    }
    else{
        num++;
    }
    //버튼 비활성화 후 활성화
    circle_btn.forEach((item,index)=>{
        item.classList.remove("on");
    });
    circle_btn[num].classList.add("on");
    view.style.marginLeft = -100 * num + "%";
    view.style.marginLeft = -100 * num + "%";
});
