// 필요한 태그 생성
const section = document.querySelectorAll(".section");

// 스크롤 이벤트
window.addEventListener("scroll",()=>{
    
    //스크롤바의 위치값 변수에 대입
    let scTop = window.scrollY;

    //각 구역의 시작위치값 반복문을 사용하여 배열에 담기
    let secTop = [];
    section.forEach((item,index)=>{
        secTop[index] = item.offsetTop;

        //조건문을 사용하여 해당 구간에서 요소들이 나타남
        if(scTop >= section[index] && scTop < section[index + 1]){
            section[index].classList.add("on");
        }
        // else if(scTop >= section[6]){

        // }
    });
    

});