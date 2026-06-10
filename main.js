// 1. Node.js 백엔드 서버(8080포트)와 웹소켓 실시간 연결 시작
const socket = new WebSocket('ws://localhost:8080');

// 웹 서버와 성공적으로 연결되었을 때
socket.onopen = () => {
  console.log("✅ Node.js 서버와 실시간 연동 성공!");
};

// 2. 서버로부터 아두이노 주차 신호를 받았을 때 실시간 처리
socket.onmessage = function(event) {
  const status = event.data; // 서버가 보낸 "1" 또는 "0"이 들어옴
  
  // 색상을 바꿀 '주차 칸 엘리먼트' 선택
  const parkingSlot = document.getElementById('parking-slot-7'); 

  if (parkingSlot) {
    if (status === "1") {
      // 7cm 이하로 차량 감지 시 -> 빨간색(Red)으로 변경
      parkingSlot.style.backgroundColor = 'red';
      parkingSlot.style.transition = 'background-color 0.3s ease'; // 부드러운 색상 전환 효과
    } else {
      // 평상시 또는 차량이 빠졌을 때 -> 원래 주황색(Orange)으로 복구
      parkingSlot.style.backgroundColor = 'orange';
    }
  } else {
    console.warn("⚠️ HTML에서 'parking-slot-7' ID를 가진 주차 칸을 찾을 수 없습니다.");
  }
};

// 통신 에러 발생 시
socket.onerror = (error) => {
  console.error("❌ 웹소켓 통신 에러:", error);
};

// 서버와 연결이 끊어졌을 때
socket.onclose = () => {
  console.log("🔌 Node.js 서버와의 연결이 종료되었습니다.");
};
