import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar } from 'react-bootstrap';
import { FaFilm, FaCheckCircle } from 'react-icons/fa';

const LogoutPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // 1. 현재 페이지를 히스토리에 한 번 더 강제로 넣음
    window.history.pushState(null, '', window.location.href);

    // 2. 뒤로 가기 버튼 클릭(popstate) 감지 시 다시 현재 페이지로 돌려보냄
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* 헤더 */}
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

      {/* contents */}
      <main className="flex-grow-1 d-flex justify-content-center align-items-center bg-light">
        <div className="container d-flex justify-content-center">
          <div className="card shadow p-5 text-center" style={{ width: '400px' }}>
            
            {/* 아이콘 및 메시지 */}
            <div className="mb-4 text-success">
              <FaCheckCircle size={60} />
            </div>
            <h2 className="mb-3 fw-bold">Logged Out</h2>
            <p className="text-secondary mb-4">
              성공적으로 로그아웃 되었습니다.<br />
              다시 서비스를 이용하시려면 로그인해주세요.
            </p>

            {/* 로그인 페이지 이동 버튼 */}
            <button 
              className="btn btn-primary w-100"
              onClick={() => navigate('/login')}
            >
              로그인 페이지로 이동
            </button>

          </div>
        </div>
      </main>

      {/* 푸터 */}
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

export default LogoutPage;