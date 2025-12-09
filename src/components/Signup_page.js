//만약 수정할 사항 있으면 주석 달아주세요
import React, { useState } from 'react';

const SignupPage = ({ setView, onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const today = new Date().toISOString().slice(0, 10);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password || !passwordCheck) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (password !== passwordCheck) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    const success = onSignup(email, password);
    if (success) {
      // 회원가입 성공 시 로그인 화면으로 이동
      setView('login');
    }
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
          <span className="text-secondary small">회원가입</span>
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
              <button type="submit" className="btn btn-success w-100 mb-2">
                회원가입
              </button>
            </form>

            {/* 로그인으로 돌아가기 */}
            <div className="text-center">
              <button
                className="btn btn-link text-secondary text-decoration-none"
                onClick={() => setView('login')}
              >
                이미 계정이 있으신가요? 로그인
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

export default SignupPage;
