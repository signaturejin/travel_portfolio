// 필요한 태그 생성
const goTopBtn = document.querySelector(".go_top_box");

goTopBtn.addEventListener("click",()=>{
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
});