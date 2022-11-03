const gnbMenu = document.querySelectorAll(".gnb > li");
const subMenu = document.querySelectorAll(".sub_menu");

gnbMenu.forEach(function(item,index){
    //gnb에 마우스를 올렸을 때
    item.addEventListener("mouseenter",function(){
        subMenu[index].style.display = "block";
    });
    //gnb에서 마우스가 영역을 빠져나왔을 때
    item.addEventListener("mouseleave",function(){
        subMenu[index].style.display = "none";
    });
});