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
import Detail_page from './components/Detail_page';
import Edit_page from './components/Edit_page';

const API_URL = 'https://69363c86f8dc350aff3031af.mockapi.io/Login';

// Root Component 
const RootComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);           // 전체 회원 목록
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    // 저장된 값이 있으면 JSON으로 변환해서 넣고, 없으면 null
    return savedUser ? JSON.parse(savedUser) : null;
  });

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
    localStorage.setItem('currentUser', JSON.stringify(found));

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
    alert('로그아웃 되었습니다.');
    
    setCurrentUser(null);

    localStorage.removeItem('currentUser');

    navigate('/login');
  };

  //네비게이션 바 표시 여부
  const hideNavbarPaths = ['/login', '/signup'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
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
              <My_page 
                currentUser={currentUser} 
                setCurrentUser={setCurrentUser}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 5. 상세 페이지 (:id는 변수) */}
        // src/index.js 수정 (부분)
        <Route path="/detail/:id" element={<Detail_page currentUser={currentUser} />} />

        {/* 6. 수정 페이지 (:id는 변수) */}
        <Route path="/edit/:id" element={<Edit_page currentUser={currentUser} />} />

        {/* 그 외 경로 */}
        <Route path="*" element={<Navigate to="/login" replace />} />

        {/* 로그아웃 */}
        <Route
          path="/logout"
          element={<LoginPage onLogin={handleLogout} />}
        />

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
