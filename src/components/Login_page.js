//만약 수정할 사항 있으면 주석 달아주십쇼
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { FaListUl, FaFilm, FaSignOutAlt } from 'react-icons/fa';
const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();    
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const footerDate = '2025-12';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }
    onLogin(email, password);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/*헤더: 로고 중앙 정렬 + 우측 "로그인/회원가입" 문구 삭제*/}
      <header className="bg-dark text-white py-4">
        <div className="container d-flex justify-content-center">
          <div className="d-flex align-items-center gap-2">
            <Navbar.Brand href="#" className="fw-bold text-warning fs-3 position-absolute start-50 translate-middle-x">
                <FaFilm size={30} className="me-2" />
                MovieArchive
              </Navbar.Brand>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-grow-1 d-flex justify-content-center align-items-center bg-light">
        <div className="container d-flex justify-content-center">
          <div className="card shadow p-4" style={{ width: '400px' }}>
            <h2 className="text-center mb-4 fw-bold">Login</h2>

            <form onSubmit={handleSubmit}>
              {/* ID 입력 */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* 비밀번호 입력 */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* 로그인 버튼 */}
              <button type="submit" className="btn btn-primary w-100 mb-2">
                로그인
              </button>
            </form>

            {/* 비회원 / 회원가입 링크 */}
            <div className="text-center mt-2">
              <button
                className="btn btn-link text-secondary text-decoration-none"
                onClick={() => navigate('/')} 
              >
                비회원으로 둘러보기
              </button>
            </div>
            <div className="text-center">
              <button
                className="btn btn-link text-primary text-decoration-none"
                onClick={() => navigate('/signup')} 
              >
                아직 회원이 아니신가요? 회원가입
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* footer */}
      <div id="footer" className="bg-dark text-white py-3 mt-5">
          <Container fluid className="d-flex justify-content-between align-items-center">
              <Navbar.Brand href="#" className="fw-bold text-warning fs-3 d-flex align-items-center">
                  <FaFilm size={24} className="me-2" />
                      MovieArchive
              </Navbar.Brand>
              <p className="small text-white-50 mb-0">
                  2025-12 MovieArchive Project.
              </p>
            </Container>
      </div>
    </div>
  );
};

export default LoginPage;
