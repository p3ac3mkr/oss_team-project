import React from 'react';

// 메인 페이지 컴포넌트
const MainPage = () => {
  return (
    <div className="container py-4">
      {/* 배너 (Hero Section) */}
      <div
        className="p-5 mb-4 bg-dark text-white rounded-3 shadow"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://via.placeholder.com/1200x400)',
          backgroundSize: 'cover',
        }}
      >
        <div className="container-fluid py-3">
          <h1 className="display-5 fw-bold">이번 주 인기 영화</h1>
          <p className="col-md-8 fs-4">지금 가장 핫한 영화들을 확인해보세요.</p>
          <button className="btn btn-warning btn-lg" type="button">
            자세히 보기
          </button>
        </div>
      </div>

      {/* 검색창 */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-6 d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="영화 제목을 검색해보세요..."
          />
          <button className="btn btn-outline-dark">검색</button>
        </div>
      </div>

      {/* 영화 리스트 (Grid) */}
      <h3 className="fw-bold mb-3">🔥 현재 상영작</h3>
      <div className="row row-cols-1 row-cols-md-4 g-4 mb-5">
        {[1, 2, 3, 4].map((item) => (
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
                  <button className="btn btn-sm btn-outline-danger">♥ 찜</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;