import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainPage from './components/Main_page';
import LoginPage from './components/Login_page';
import SignupPage from './components/Signup_page';

// --- [임시 컴포넌트] 마이 페이지 (나중에 My_page.js 만들어서 옮기세요) ---
const MyPage = () => (
  <div className="container py-5">
    <h4 className="fw-bold mb-3">🍿 내가 찜한 영화</h4>
    <div className="alert alert-info">아직 찜한 영화가 없어요!</div>
  </div>
);

// --- [메인 로직] 전체 화면 관리 ---
const RootComponent = () => {
  const [view, setView] = useState('login'); // login, signup, main, mypage
  const [users, setUsers] = useState([]);    // { email, password } 들을 저장

  // 회원가입 처리
  const handleSignup = (email, password) => {
    // 이미 가입된 이메일 체크
    const exists = users.some((user) => user.email === email);
    if (exists) {
      alert('이미 가입된 이메일입니다.');
      return false;
    }

    setUsers((prev) => [...prev, { email, password }]);
    alert('회원가입이 완료되었습니다. 로그인 해주세요.');
    return true;
  };

  // 로그인 처리
  const handleLogin = (email, password) => {
    const found = users.find(
      (user) => user.email === email && user.password === password
    );

    if (found) {
      alert(`환영합니다, ${email}님!`);
      setView('main');
    } else {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* 네비게이션 바 (로그인/회원가입 페이지가 아닐 때만 보임) */}
      {view !== 'login' && view !== 'signup' && (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 mb-4">
          <div className="container-fluid">
            <span
              className="navbar-brand fw-bold text-warning"
              role="button"
              onClick={() => setView('main')}
            >
              🎬 MovieApp
            </span>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => setView('main')}
              >
                메인
              </button>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => setView('mypage')}
              >
                마이페이지
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => setView('login')}
              >
                로그아웃
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* 화면 전환 로직 */}
      {view === 'login' && (
        <LoginPage setView={setView} onLogin={handleLogin} />
      )}
      {view === 'signup' && (
        <SignupPage setView={setView} onSignup={handleSignup} />
      )}
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