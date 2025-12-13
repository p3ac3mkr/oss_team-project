import React from 'react';
import { Container, Navbar, Button, Row, Col, Card, Badge, ProgressBar } from 'react-bootstrap';
import { FaArrowLeft, FaStar, FaCalendarAlt, FaTv, FaUserTie, FaBuilding, FaFilm } from 'react-icons/fa';

export default function Detail_page() {
    
    // UI 확인용 더미 데이터
    const movieData = {
        title: "인셉션 (Inception)",
        poster_path: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
        director: "크리스토퍼 놀란",
        distributor: "워너 브라더스",
        release_date: "2010-07-21",
        
        // 사용자 기록
        watched_date: "2024-05-20",
        platform: "Netflix",
        
        // 평점 (10점 만점)
        rating_overall: 9.5, 
        rating_scenario: 10, 
        rating_direction: 9, 
        rating_music: 10,    
        
        recommend_index: 98, // 추천 지수 (%)
        
        review: "꿈 속의 꿈이라는 소재를 이렇게 완벽하게 풀어낼 수 있을까? 마지막 팽이가 쓰러질 듯 말 듯 한 장면은 여전히 잊을 수 없다. 한스 짐머의 음악 또한 압도적이다."
    };

    return (
        <>
            <div className="d-flex flex-column min-vh-100 bg-light">
                
                {/* 1. 헤더 */}
                <Navbar bg="dark" variant="dark" className="px-4 shadow-sm mb-4">
                    <Container fluid>
                        <Navbar.Brand href="#" className="fw-bold text-warning fs-3 d-flex align-items-center">
                            <FaFilm size={30} className="me-2" />
                            MovieArchive
                        </Navbar.Brand>
                        <Button variant="outline-light" size="sm" href="/">
                            <FaArrowLeft className="me-1" /> 목록으로
                        </Button>
                    </Container>
                </Navbar>

                {/* 2. 상세 컨텐츠 영역 */}
                <Container className="flex-grow-1 pb-5">
                    <Row className="g-5">
                        
                        {/* [왼쪽 컬럼] 포스터 및 메타 정보 */}
                        <Col lg={4}>
                            <Card className="border-0 shadow-lg mb-4">
                                <Card.Img variant="top" src={movieData.poster_path} />
                            </Card>

                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <h5 className="fw-bold mb-3 border-bottom pb-2">📌 영화 정보</h5>
                                    <ul className="list-unstyled mb-0">
                                        <li className="mb-2 d-flex align-items-center">
                                            <FaUserTie className="text-secondary me-2" /> 
                                            <strong>감독:</strong> <span className="ms-2">{movieData.director}</span>
                                        </li>
                                        <li className="mb-2 d-flex align-items-center">
                                            <FaBuilding className="text-secondary me-2" /> 
                                            <strong>배급:</strong> <span className="ms-2">{movieData.distributor}</span>
                                        </li>
                                        <li className="mb-2 d-flex align-items-center">
                                            <FaCalendarAlt className="text-secondary me-2" /> 
                                            <strong>본 날짜:</strong> <span className="ms-2">{movieData.watched_date}</span>
                                        </li>
                                        <li className="d-flex align-items-center">
                                            <FaTv className="text-secondary me-2" /> 
                                            <strong>플랫폼:</strong> <span className="badge bg-primary ms-2">{movieData.platform}</span>
                                        </li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* [오른쪽 컬럼] 제목, 평점, 리뷰 */}
                        <Col lg={8}>
                            {/* 헤더 섹션 (제목 + 추천지수) */}
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div>
                                    <h1 className="fw-bold display-5 mb-2">{movieData.title}</h1>
                                    <div className="d-flex align-items-center">
                                        <Badge bg="dark" className="me-2">{movieData.release_date.substring(0,4)}</Badge>
                                        <span className="text-muted">SF / 액션</span>
                                    </div>
                                </div>
                                
                                {/* 추천 지수 배지 */}
                                <div className="text-center">
                                    <div className="position-relative d-inline-flex align-items-center justify-content-center" 
                                         style={{width: '80px', height: '80px', borderRadius: '50%', background: '#ffc107', border: '5px solid #fff', boxShadow: '0 0 10px rgba(0,0,0,0.1)'}}>
                                        <div>
                                            <div className="small fw-bold text-dark">추천</div>
                                            <div className="fs-4 fw-bold text-dark">{movieData.recommend_index}%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 평점 분석 섹션 */}
                            <Card className="border-0 shadow-sm mb-4">
                                <Card.Body className="p-4">
                                    <h4 className="fw-bold mb-4 d-flex align-items-center">
                                        <FaStar className="text-warning me-2" /> 
                                        사용자 평점 분석
                                    </h4>
                                    
                                    <Row className="align-items-center mb-4">
                                        {/* 종합 평점 */}
                                        <Col md={3} className="text-center border-end">
                                            <div className="text-muted small">종합 평점</div>
                                            <div className="display-4 fw-bold text-dark">{movieData.rating_overall}</div>
                                            <div className="text-warning">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={i < Math.round(movieData.rating_overall/2) ? "" : "text-black-50"} />
                                                ))}
                                            </div>
                                        </Col>
                                        
                                        {/* 상세 평점 그래프 */}
                                        <Col md={9} className="ps-md-4">
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span className="fw-bold">📖 시나리오</span>
                                                    <span className="fw-bold text-primary">{movieData.rating_scenario} / 10</span>
                                                </div>
                                                <ProgressBar now={movieData.rating_scenario * 10} variant="primary" style={{height: '10px'}} />
                                            </div>
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span className="fw-bold">🎬 연출</span>
                                                    <span className="fw-bold text-success">{movieData.rating_direction} / 10</span>
                                                </div>
                                                <ProgressBar now={movieData.rating_direction * 10} variant="success" style={{height: '10px'}} />
                                            </div>
                                            <div>
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span className="fw-bold">🎵 음악</span>
                                                    <span className="fw-bold text-info">{movieData.rating_music} / 10</span>
                                                </div>
                                                <ProgressBar now={movieData.rating_music * 10} variant="info" style={{height: '10px'}} />
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* 리뷰 섹션 */}
                            <Card className="border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    <h5 className="fw-bold mb-3">📝 나의 감상평</h5>
                                    <div className="bg-light p-3 rounded" style={{borderLeft: '5px solid #ffc107'}}>
                                        <p className="mb-0 fs-5 fst-italic text-dark" style={{lineHeight: '1.6'}}>
                                            "{movieData.review}"
                                        </p>
                                    </div>
                                    <div className="d-flex justify-content-end mt-3">
                                        <Button variant="outline-secondary" size="sm" className="me-2">수정</Button>
                                        <Button variant="outline-danger" size="sm">삭제</Button>
                                    </div>
                                </Card.Body>
                            </Card>

                        </Col>
                    </Row>
                </Container>

                {/* 푸터 */}
                <div id="footer" className="bg-dark text-white py-3 mt-auto">
                    <Container fluid className="d-flex justify-content-between align-items-center px-4">
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
        </>
    );
}