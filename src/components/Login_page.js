//만약 수정할 사항 있으면 주석 달아주세요
import React, { useState } from 'react';

const LoginPage = ({ setView, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 오늘 날짜 (YYYY-MM-DD)
  const today = new Date().toISOString().slice(0, 10);

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
      {/* 헤더: 로고 */}
      <header className="bg-dark text-white py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span role="img" aria-label="logo">
              🎬
            </span>
            <span className="fw-bold fs-4">MovieApp</span>
          </div>
          <span className="text-secondary small">로그인 / 회원가입</span>
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
                onClick={() => setView('main')}
              >
                비회원으로 둘러보기
              </button>
            </div>
            <div className="text-center">
              <button
                className="btn btn-link text-primary text-decoration-none"
                onClick={() => setView('signup')}
              >
                아직 회원이 아니신가요? 회원가입
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 푸터: 로고 + TMDB 저작권 + 오늘 날짜 */}
      <footer className="bg-dark text-white py-3 mt-auto">
        <div className="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-2">
            <span role="img" aria-label="logo">
              🎬
            </span>
            <span className="fw-bold">MovieApp</span>
          </div>
          <div className="text-center small">
            <div>
              This product uses the TMDB API but is not endorsed or certified by
              TMDB.
            </div>
            <div className="text-secondary">오늘 날짜: {today}</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
