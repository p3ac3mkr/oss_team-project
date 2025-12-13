import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom"; // 라우터 관련 훅 임포트
import './index.css';

// 컴포넌트 임포트
import MainPage from './components/Main_page';
import LoginPage from './components/Login_page';
import SignupPage from './components/Signup_page';
import My_page from './components/My_page';
import Detail_Page from './components/Detail_page';


const API_URL = 'https://69363c86f8dc350aff3031af.mockapi.io/Login';

// --- [임시 컴포넌트] 마이 페이지 (나중에 My_page.js로 분리 가능) ---
const MyPage = ({currentUser}) => (
  <My_page currentUser={currentUser} /> //props 비어있어서 바꿔뒀슴다
);

// --- [메인 로직] 전체 화면 관리 ---
const RootComponent = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const location = useLocation(); // 현재 경로 확인을 위한 훅

  const [users, setUsers] = useState([]);         
  const [currentUser, setCurrentUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  // 1. 앱 초기화: 회원 목록 가져오기
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

  // 2. 로그인 처리
  const handleLogin = (email, password) => {
    if (loading) return alert('로딩 중입니다.');

    const found = users.find(
      (user) => user.email_name === email && user.password === password
    );

    if (found) {
      setCurrentUser(found);
      alert(`환영합니다, ${email}님!`);
      navigate('/'); // [중요] 로그인 성공 시 메인으로 이동
    } else {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  // 3. 회원가입 성공 처리
  const handleSignupSuccess = (createdUser) => {
    setUsers((prev) => [...prev, createdUser]);
    navigate('/login'); // [중요] 가입 성공 시 로그인 페이지로 이동
  };

  // 4. 로그아웃 처리
  const handleLogout = () => {
    setCurrentUser(null);
    alert('로그아웃 되었습니다.');
    navigate('/login'); // [중요] 로그아웃 시 로그인 페이지로 이동
  };

  const hideNavbarPaths = ['/login', '/signup'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      
      {/* --- 네비게이션 바 (조건부 렌더링) --- */}
      {showNavbar && (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 mb-4">
          <div className="container-fluid">
            {/* 🔽 로고 + 이메일 묶어서 왼쪽 정렬 */}
            <div className="d-flex align-items-center gap-3">
              <span className="navbar-brand fw-bold text-warning" role="button" onClick={() => navigate('/')}>
                🎬 MovieApp
              </span>
              {currentUser && (
                <span className="text-white small">{currentUser.email_name} 님</span>
              )}
            </div>

            <div className="d-flex gap-2 ms-auto">
              <button className="btn btn-sm btn-outline-light" onClick={() => navigate('/')}>메인</button>
              <button className="btn btn-sm btn-outline-light" onClick={() => navigate('/mypage')}>마이페이지</button>
              <button className="btn btn-sm btn-danger" onClick={handleLogout}>로그아웃</button>
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
      {view === 'main' && <MainPage currentUser={currentUser} />}
      {view === 'mypage' && <MyPage currentUser={currentUser} />}
    </div>
  );
};

// --- 렌더링 (BrowserRouter는 여기서 감쌉니다) ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //  - BrowserRouter가 최상위에 있어야 내부에서 useNavigate 등을 쓸 수 있음
  <BrowserRouter>
    <RootComponent />
  </BrowserRouter>
);






