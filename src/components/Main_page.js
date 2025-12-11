//만약 수정할 사항 있으면 주석 달아주십쇼 아마 이제 메인페이지 건들듯?
import React from 'react';

// 메인 페이지 component
const MainPage = ({ currentUser }) => {
  const movies = Array.from({ length: 24 }, (_, i) => i + 1);
  const userEmail = currentUser?.email_name;

  const footerDate = "2025-12";

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container py-4 flex-grow-1">
        {/* 🔽 상단 헤더 + 검색바 */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center mb-3 mb-md-0">
            <h2 className="fw-bold mb-0">🎬 MovieApp</h2>
            {userEmail && (
              <span className="ms-3 text-muted small">{userEmail} 님</span>
            )}
          </div>

          {/* 검색바 */}
          <div className="d-flex w-100 w-md-50" style={{ maxWidth: '480px' }}>
            <input
              type="text"
              className="form-control me-2"
              placeholder="영화 제목을 검색해보세요..."
            />
            <button className="btn btn-outline-dark">검색</button>
          </div>
        </div>

        {/* 영화 리스트(작은 화면 2줄로 바꿔두긴 했는데 불편하면 말해주십쇼) */}
        <h3 className="fw-bold mb-3">🔥 현재 상영작</h3>
        <div className="row row-cols-2 row-cols-md-4 g-4 mb-5">
          {movies.map((item) => (
            <div className="col" key={item}>
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={`https://via.placeholder.com/300x450?text=Movie+${item}`}
                  className="card-img-top"
                  alt={`Movie ${item}`}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">영화 제목 {item}</h5>
                  <p className="card-text text-muted small">2024.05.01 개봉</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-warning fw-bold">★ 8.{item}</span>
                    <button className="btn btn-sm btn-outline-danger">
                      ♥ 찜
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
        
      {/* footer: 로고 + TMDB 저작권 + 링크 + 제작날짜 2025.12 고정해둠 */}
      <footer className="bg-dark text-white py-3 mt-auto">
        <div className="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center gap-2">
            <span role="img" aria-label="logo">
              🎬
            </span>
            <span className="fw-bold">MovieApp</span>
          </div>
          <div className="text-center small">
            <div>© 2025 MovieApp. All rights reserved.</div>
            <div>본 서비스는 TMDB API를 사용하지만 TMDB의 공식 서비스는 아닙니다.</div>
            <div className="text-secondary">본 서비스 제작 날짜: {footerDate}</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
