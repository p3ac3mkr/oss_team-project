// src/index.js
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainPage from './components/Main_page';
import LoginPage from './components/Login_page';
import SignupPage from './components/Signup_page';

const API_URL = 'https://69363c86f8dc350aff3031af.mockapi.io/Login';

// --- [임시 컴포넌트] 마이 페이지 (나중에 My_page.js로 분리 가능) ---
const MyPage = ({ currentUser }) => (
  <div className="container py-5">
    <h4 className="fw-bold mb-3">🍿 내가 찜한 영화</h4>
    {currentUser ? (
      <div className="alert alert-info">
        <b>{currentUser.email_name}</b> 님의 찜한 영화 목록 (추후 구현 예정)
      </div>
    ) : (
      <div className="alert alert-warning">로그인 정보가 없습니다.</div>
    )}
  </div>
);

// --- [메인 로직] 전체 화면 관리 ---
const RootComponent = () => {
  const [view, setView] = useState('login');      // login, signup, main, mypage
  const [users, setUsers] = useState([]);         // MockAPI에서 가져온 회원 목록
  const [currentUser, setCurrentUser] = useState(null); // 현재 로그인한 사용자
  const [loading, setLoading] = useState(true);   // 사용자 목록 로딩 상태

  // ✅ 앱 처음 실행 시 MockAPI에서 회원 목록 가져오기
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
        alert('사용자 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ✅ 로그인 처리: 불러온 users 배열에서 찾기
  const handleLogin = (email, password) => {
    if (loading) {
      alert('아직 사용자 정보를 불러오는 중입니다. 잠시만 기다려주세요.');
      return;
    }

    const found = users.find(
      (user) => user.email_name === email && user.password === password
    );

    if (found) {
      setCurrentUser(found);
      alert(`환영합니다, ${email}님!`);
      setView('main');
    } else {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  // ✅ 회원가입 성공 후 부모에서 users 업데이트
  const handleSignupSuccess = (createdUser) => {
    setUsers((prev) => [...prev, createdUser]);
  };

  // ✅ 로그아웃 처리
  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
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
                onClick={handleLogout}
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
        <SignupPage
          setView={setView}
          users={users}
          onSignupSuccess={handleSignupSuccess}
        />
      )}
      {view === 'main' && <MainPage />}
      {view === 'mypage' && <MyPage currentUser={currentUser} />}
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
