// src/index.js
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from 'react-router-dom';
import './index.css';

// 페이지 컴포넌트
import MainPage from './components/Main_page';
import LoginPage from './components/Login_page';
import SignupPage from './components/Signup_page';
import My_page from './components/My_page';

const API_URL = 'https://69363c86f8dc350aff3031af.mockapi.io/Login';

// Root Component 
const RootComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);           // 전체 회원 목록
  const [currentUser, setCurrentUser] = useState(null); // 로그인 유저
  const [loading, setLoading] = useState(true);

  //  앱 시작 시 회원 목록 불러오기 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        alert('회원 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 로그인 
  const handleLogin = (email, password) => {
    if (loading) {
      alert('로딩 중입니다.');
      return;
    }

    const found = users.find(
      (u) => u.email_name === email && u.password === password
    );

    if (!found) {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
      return;
    }

    setCurrentUser(found);
    alert(`환영합니다, ${email}님!`);
    navigate('/'); // 메인 페이지로 이동
  };

  //회원가입 성공 처리
  const handleSignupSuccess = (createdUser) => {
    setUsers((prev) => [...prev, createdUser]);
    alert('회원가입이 완료되었습니다.');
    navigate('/login');
  };

  //로그아웃 
  const handleLogout = () => {
    setCurrentUser(null);
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

  //네비게이션 바 표시 여부
  const hideNavbarPaths = ['/login', '/signup'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">

      {/*네비게이션 바 */}
      {showNavbar && (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 mb-4">
          <div className="container-fluid">
            {/* 로고 + 이메일 */}
            <div className="d-flex align-items-center gap-3">
              <span
                className="navbar-brand fw-bold text-warning"
                role="button"
                onClick={() => navigate('/')}
              >
                🎬 MovieApp
              </span>
              {currentUser && (
                <span className="text-white small">
                  {currentUser.email_name} 님
                </span>
              )}
            </div>

            {/* 메뉴 버튼 */}
            <div className="d-flex gap-2 ms-auto">
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => navigate('/')}
              >
                메인
              </button>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => navigate('/mypage')}
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

      {/*라우터*/}
      <Routes>
        {/* 로그인 */}
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} />}
        />

        {/* 회원가입 */}
        <Route
          path="/signup"
          element={
            <SignupPage
              users={users}
              onSignupSuccess={handleSignupSuccess}
            />
          }
        />

        {/* 메인 페이지 */}
        <Route
          path="/"
          element={
            currentUser ? (
              <MainPage
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 마이 페이지 */}
        <Route
          path="/mypage"
          element={
            currentUser ? (
              <My_page currentUser={currentUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 그 외 경로 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <RootComponent />
    </BrowserRouter>
  </React.StrictMode>
);
