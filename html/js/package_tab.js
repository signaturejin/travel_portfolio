// 필요한 태그 생성
const package_menu = document.querySelectorAll(".package_menu li");
const local = document.querySelectorAll(".package .right .local");

//반복문을 이용하여 메뉴에 클릭기능 부여함
package_menu.forEach((item,index)=>{
    item.addEventListener("click",(e)=>{
        // 이동방지
        e.preventDefault();
        // 해당되지 않은 박스들은 안보이게
        local.forEach((item,index)=>{
            // item.style.display = "none";
            item.style.opacity = 0;
            item.style.zIndex = 2;
        });
        // local[index].style.display = "flex";
        local[index].style.opacity = 1;
        local[index].style.zIndex = 3;

    });
});