// 1. Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyAINQHg_6Y8o6jVefP1tyFImvJi11vvAgw",
  authDomain: "parking-system-e7647.firebaseapp.com",
  projectId: "parking-system-e7647",
  storageBucket: "parking-system-e7647.firebasestorage.app",
  messagingSenderId: "833609510724",
  appId: "1:833609510724:web:43ab01f7ed53382fe03111",
  measurementId: "G-B6K8MXD2GK"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2. 상태 관리 (총 14개 칸 예시)
let parkingSpots = Array(14).fill("available"); 

// 층 전환 함수
function showFloor(floorId, btn) {
  document.querySelectorAll('.floor').forEach(f => f.classList.remove('active'));
  document.getElementById(floorId).classList.add('active');
  document.querySelectorAll('.floor-btn').forEach(b => b.classList.remove('active-btn'));
  btn.classList.add('active-btn');
}

// 주차 칸 클릭 시 예약 로직
function clickSpot(index) {
  if (parkingSpots[index] === "available") {
    parkingSpots[index] = "reserved";
    updateUI(index);
  } else if (parkingSpots[index] === "reserved") {
    parkingSpots[index] = "available"; // 예약 취소
    updateUI(index);
  } else {
    alert("이미 주차된 자리입니다!");
  }
}

// UI 업데이트 함수 (클래스 교체 방식)
function updateUI(index) {
  const spot = document.getElementById("spot" + index);
  if (!spot) return;

  // 모든 클래스 제거 후 해당 상태 클래스 추가
  spot.classList.remove('available', 'reserved', 'occupied');
  spot.classList.add(parkingSpots[index]);
}

// 3. 센서 시뮬레이션 및 데이터 연동
db.ref('arduino/sensorValue').on('value', (snapshot) => {
  const val = snapshot.val();
  if (val) document.getElementById('data-box').innerText = "현재 센서 값: " + val;
  
  // 예시: 센서 값이 10 미만이면 0번 자리에 차가 들어온 것으로 간주
  if (val < 10 && parkingSpots[0] === "reserved") {
    parkingSpots[0] = "occupied";
    updateUI(0);
  } else if (val > 20 && parkingSpots[0] === "occupied") {
    parkingSpots[0] = "available";
    updateUI(0);
  }
});