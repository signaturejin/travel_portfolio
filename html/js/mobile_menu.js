// 필요한 태그 생성
const mobile_menu = document.querySelector(".mobile_menu");
const mobile_board = document.querySelector(".mobile_board");
const board_btn = document.querySelector(".board_btn");

mobile_menu.addEventListener("click",()=>{
    mobile_menu.classList.add("on");
    mobile_board.style.right = "0";
});

board_btn.addEventListener("click",()=>{
    mobile_menu.classList.remove("on");
    mobile_board.style.right = "-100%";
});

//// test ////

// 필요한 태그 생성
const m_gnb_menu = document.querySelectorAll(".m_gnb_menu > li > a");
const allow_icon = document.querySelectorAll(".m_gnb_menu > li > i");
const m_sub_menu = document.querySelectorAll(".m_sub_menu");

console.log(m_gnb_menu);
console.log(allow_icon);
console.log(m_sub_menu);

let sub_height = [];
// 모바일 서브 메뉴의 높이값 반복문 이용해서 대입
m_sub_menu.forEach((item,index)=>{
    sub_height[index] = item.offsetHeight;
});

m_gnb_menu.forEach((item,index)=>{
    // 모바일 gnb메뉴 클릭시
    item.addEventListener("click",()=>{
        // 전부 초기화
        m_sub_menu.forEach((item,index)=>{
            // 모두 높이값 0으로 만들어줌
            m_sub_menu[index].style.height = 0;
            // 아이콘 변경해줌
            allow_icon[index].setAttribute("class","fa-solid fa-angle-right");
        });

        // 모바일 서브 메뉴에 높이값 넣어줌
        m_sub_menu[index].style.height = sub_height[index];
        m_sub_menu[index].style.color = red;

        allow_icon[index].setAttribute("class","fa-solid fa-angle-down");
    });
});