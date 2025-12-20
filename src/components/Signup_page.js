//만약 수정할 사항 있으면 주석 달아주십쇼
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { FaListUl, FaFilm, FaSignOutAlt } from 'react-icons/fa';

const API_URL = 'https://69363c86f8dc350aff3031af.mockapi.io/Login';

const SignupPage = ({ users, onSignupSuccess }) => { 
  const navigate = useNavigate();                  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const footerDate = '2025-12';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !passwordCheck) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (password !== passwordCheck) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    const exists = users.some((user) => user.email_name === email);
    if (exists) {
      alert('이미 가입된 이메일입니다.');
      return;
    }

    try {
      setSubmitting(true);

      const newUser = {
        email_name: email,
        password,
        key: Date.now(),
        toWatch_movies: [],
        watched_movies: [],
      };

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) throw new Error('Failed to signup');

      const created = await res.json();

      onSignupSuccess?.(created);

      alert('회원가입이 완료되었습니다. 로그인 해주세요.');
      navigate('/login'); 
    } catch (error) {
      console.error(error);
      alert('회원가입 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* 헤더: 로고 */}
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
            <h2 className="text-center mb-4 fw-bold">Sign Up</h2>

            <form onSubmit={handleSubmit}>
              {/* 이메일 */}
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

              {/* 비밀번호 */}
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

              {/* 비밀번호 확인 */}
              <div className="mb-3">
                <label className="form-label">Password Check</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password Check"
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                />
              </div>

              {/* 회원가입 버튼 */}
              <button type="submit" className="btn btn-success w-100 mb-2" disabled={submitting}>
                {submitting ? '가입 중...' : '회원가입'}
              </button>
            </form>

            {/* 로그인으로 돌아가기 */}
            <div className="text-center">
              <button
                className="btn btn-link text-secondary text-decoration-none"
                onClick={() => navigate('/login')} 
              >
                이미 계정이 있으신가요? 로그인
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

export default SignupPage;
