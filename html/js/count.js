// 증가될 숫자 넣을 태그 생성
const countNum = document.querySelectorAll(".count_number");

// 증가에 필요한 배열 객체 생성
let countList = [
    {   //제주
        // 증가될 숫자
        inc: 30,
        // 목표 숫자
        com: 3250,
        // 어느 태그에 넣을 것인지
        tag: countNum[0],
        // 증가 속도
        speed: 10
    },
    {   //부산
        inc: 50,
        com: 5420,
        tag: countNum[1],
        speed: 12
    },
    {   //서울
        inc: 100,
        com: 15769,
        tag: countNum[2],
        speed: 18
    },
    {   //전주
        inc: 12,
        com: 2457,
        tag: countNum[3],
        speed: 12
    },
    {   //강릉
        inc: 42,
        com: 3874,
        tag: countNum[4],
        speed: 12
    }
];

// 한번만 동작하게 하기 위한 변수
let stop = true;

// 스크롤 이벤트를 사용하여 해당 구간 도달하였을 때 카운트 실행
window.addEventListener("scroll",()=>{
    // 스크롤의 위치값을 변수에 담아줌
    let scTop = window.scrollY;
    // 도달 구간의 위치값을 변수에 담아줌
    let target = document.querySelector(".local_count").offsetTop;

    // 조건문을 사용하여 현재 위치값이 도달 구간의 위치값과 크거나 같을 때 카운트 시작
    if(scTop >= target - 180){
        if(stop == true){
            // 반복문을 사용하여 배열객체 모두를 대상으로 삼음
            countList.forEach((item,index)=>{
                count(item.inc,item.com,item.tag,item.speed);
            });
        }
    }
});

// 자동함수 이용하여 카운팅
let count = (inc,com,tag,speed)=>{
    // stop값을 false로 변경해서 카운트 더 이상 실행 못하게함
    stop = false;

    // 변수를 생성하여 증가되는 숫자를 담음
    let sum = 0;

    let counting = setInterval(()=>{
        // 위 배열객체의 값을 토대로 증가시켜줌
        sum += inc;
        // 조건문을 활용하여 목표숫자와 같다면 자동함수 멈추고
        // 목표 숫자 보여줌
        if(sum >= com){
            clearInterval(count);
            tag.innerHTML = com;
        }
        else{
            // 아닐 시 증가되는 숫자를 보여줌
            tag.innerHTML = sum;
        }

    },speed);
}