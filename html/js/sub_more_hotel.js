// 필요한 태그 생성
const hotel_box = document.querySelectorAll(".hotel_box_wrap > .hotel_box");
const more_btn = document.querySelector(".more_btn");

// 시작 변수
let list_start = 3;

more_btn.addEventListener("click",(e)=>{
    // 페이지 이동 방지
    e.preventDefault();

    for(let i=list_start; i < list_start + 3; i++){
        hotel_box[i].style.display = "block";
    }
    
    list_start += 3;

    if(list_start >= hotel_box.length){
        more_btn.style.display = "none";
    }
});
