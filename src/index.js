import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainPage from './components/Main_page'; // 분리한 파일 불러오기

// --- [임시 컴포넌트] 로그인 페이지 (나중에 Login_page.js 만들어서 옮기세요) ---
const LoginPage = ({ setView }) => (
  <div className="container d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
    <div className="card shadow p-4" style={{ width: '400px' }}>
      <h2 className="text-center mb-4 fw-bold">Login</h2>
      <div className="mb-3">
        <input type="email" className="form-control" placeholder="name@example.com" />
      </div>
      <div className="mb-3">
        <input type="password" className="form-control" placeholder="Password" />
      </div>
      <button className="btn btn-primary w-100 mb-2" onClick={() => setView('main')}>로그인</button>
      <div className="text-center">
        <button className="btn btn-link text-secondary text-decoration-none" onClick={() => setView('main')}>비회원으로 둘러보기</button>
      </div>
    </div>
  </div>
);

// --- [임시 컴포넌트] 마이 페이지 (나중에 My_page.js 만들어서 옮기세요) ---
const MyPage = () => (
  <div className="container py-5">
    <h4 className="fw-bold mb-3">🍿 내가 찜한 영화</h4>
    <div className="alert alert-info">아직 찜한 영화가 없어요!</div>
  </div>
);

// --- [메인 로직] 전체 화면 관리 ---
const RootComponent = () => {
  const [view, setView] = useState('login'); // 초기 상태: login, main, mypage

  return (
    <div className="bg-light min-vh-100">
      {/* 네비게이션 바 (로그인 페이지가 아닐 때만 보임) */}
      {view !== 'login' && (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 mb-4">
          <div className="container-fluid">
            <span className="navbar-brand fw-bold text-warning" role="button" onClick={() => setView('main')}>🎬 MovieApp</span>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-light" onClick={() => setView('main')}>메인</button>
              <button className="btn btn-sm btn-outline-light" onClick={() => setView('mypage')}>마이페이지</button>
              <button className="btn btn-sm btn-danger" onClick={() => setView('login')}>로그아웃</button>
            </div>
          </div>
        </nav>
      )}

      {/* 화면 전환 로직 (Switch Case 역할) */}
      {view === 'login' && <LoginPage setView={setView} />}
      {view === 'main' && <MainPage />}
      {view === 'mypage' && <MyPage />}
    </div>
  );
};

// --- 렌더링 ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);