import React, { useState, useEffect } from 'react';
import { Container, Navbar, Button, Row, Col, Card, Badge, ProgressBar, Spinner } from 'react-bootstrap';
import { FaArrowLeft, FaStar, FaCalendarAlt, FaTrash, FaUserTie, FaBuilding, FaFilm, FaPencilAlt } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Detail_page({ currentUser }) {
    
    // 1. URL의 :id 파라미터 가져오기
    const { id } = useParams(); 
    const navigate = useNavigate();

    // 2. API 설정
    const TMDB_API_KEY = '2053a71530878c5b6173a50b7e28855d';
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
    const MOCK_API_URL = 'https://69363c86f8dc350aff3031af.mockapi.io/movieInfo';

    // 3. State 관리
    const [tmdbData, setTmdbData] = useState(null);       // TMDB 영화 정보
    const [director, setDirector] = useState('');         // 감독 이름
    const [userLog, setUserLog] = useState(null);         // Mock API 개인 기록
    const [loading, setLoading] = useState(true);         // 로딩 상태

    // 4. 데이터 Fetching
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // (A) TMDB API 호출
                const movieRes = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=ko-KR`);
                setTmdbData(movieRes.data);

                // (B) 감독 정보 호출
                const creditsRes = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}&language=ko-KR`);
                const directorData = creditsRes.data.crew.find(person => person.job === 'Director');
                setDirector(directorData ? directorData.name : '정보 없음');

                // (C) Mock API 호출 - [핵심 수정: 데이터 타입 일치시키기]
                if (currentUser && currentUser.key) {
                    try {
                        // 스키마/데이터 확인 결과: userKey와 movieID 모두 'Number' 입니다.
                        const uKey = Number(currentUser.key); 
                        const mID = Number(id); // [중요] URL의 id(문자)를 숫자로 변환

                        console.log(`🔍 MockAPI 요청: userKey=${uKey} (Type: ${typeof uKey}), movieID=${mID} (Type: ${typeof mID}), listCategory: ${currentUser.listCategory}`);

                        const logRes = await axios.get(`${MOCK_API_URL}?userKey=${uKey}&movieID=${mID}`);
                        
                        console.log("🔍 MockAPI 응답:", logRes.data);

                        if (logRes.data && logRes.data.length > 0) {
                            // 최신 데이터 사용 (배열의 마지막 요소)
                            const foundLog = logRes.data[logRes.data.length - 1];
                            setUserLog(foundLog);
                        } else {
                            setUserLog(null);
                        }
                    } catch (mockError) {
                        console.warn("개인 기록 로딩 실패:", mockError);
                        setUserLog(null); 
                    }
                }

            } catch (error) {
                console.error("중요 데이터 로딩 실패:", error);
                alert("영화 정보를 불러올 수 없습니다.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, currentUser, navigate]);

    // 로딩 화면
    if (loading) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center bg-dark text-white">
                <Spinner animation="border" variant="warning" />
                <span className="ms-3">데이터를 불러오는 중입니다...</span>
            </div>
        );
    }

    if (!tmdbData) return null;

    // --- [조건부 렌더링 변수] ---
    // 스크린샷 데이터(`image_806e2d.png`)에 listCategory: "toWatch"라고 되어 있음 (대문자 W 주의)
    const category = userLog?.listCategory || '';
    
    // 'watched' 상태 확인
    const isWatched = category === 'watched';
    
    // 'toWatch' 상태 확인 (데이터에 저장된 정확한 값으로 비교)
    const isToWatch = category === 'toWatch' || category === 'towatch';

    //console.log("listCategory: "+userLog.listCategory);

    // UI 렌더링
    return (
        <>
            <div className="d-flex flex-column min-vh-100 bg-light">
                
                {/* 헤더 */}
                <Navbar bg="dark" variant="dark" className="px-4 shadow-sm mb-4">
                    <Container fluid>
                        <Navbar.Brand href="#" className="fw-bold text-warning fs-3 d-flex align-items-center">
                            <FaFilm size={30} className="me-2" />
                            MovieArchive
                        </Navbar.Brand>
                        <Button variant="outline-light" size="sm" onClick={() => navigate(`/mypage`)}>
                            <FaArrowLeft className="me-1" /> to my page
                        </Button>
                    </Container>
                </Navbar>

                {/* 상세 컨텐츠 */}
                <Container className="flex-grow-1 pb-5">
                    <Row className="g-5">
                        
                        {/* [왼쪽] 포스터 및 TMDB 정보 (항상 표시) */}
                        <Col lg={4}>
                            <Card className="border-0 shadow-lg mb-4">
                                <Card.Img 
                                    variant="top" 
                                    src={tmdbData.poster_path ? `${IMAGE_BASE_URL}${tmdbData.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'} 
                                />
                            </Card>

                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <h5 className="fw-bold mb-3 border-bottom pb-2">📌 영화 정보</h5>
                                    <ul className="list-unstyled mb-0">
                                        <li className="mb-2 d-flex align-items-center">
                                            <FaUserTie className="text-secondary me-2" /> 
                                            <strong>감독:</strong> <span className="ms-2">{director}</span>
                                        </li>
                                        <li className="mb-2 d-flex align-items-center">
                                            <FaBuilding className="text-secondary me-2" /> 
                                            <strong>제작:</strong> 
                                            <span className="ms-2 text-truncate" style={{maxWidth: '150px'}}>
                                                {tmdbData.production_companies?.[0]?.name || '정보 없음'}
                                            </span>
                                        </li>
                                        <li className="mb-2 d-flex align-items-center">
                                            <FaCalendarAlt className="text-secondary me-2" /> 
                                            <strong>개봉일:</strong> <span className="ms-2">{tmdbData.release_date}</span>
                                        </li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* [오른쪽] 제목 및 상세 정보 (조건부 표시) */}
                        <Col lg={8}>
                            {/* 1. 제목 및 배지 영역 */}
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div>
                                    <h1 className="fw-bold display-5 mb-2">{tmdbData.title}</h1>
                                    <div className="d-flex align-items-center flex-wrap gap-2">
                                        <Badge bg="dark" className="me-2">
                                            {tmdbData.release_date ? tmdbData.release_date.substring(0,4) : ''}
                                        </Badge>
                                        {tmdbData.genres?.map(g => (
                                            <span key={g.id} className="text-muted me-2">#{g.name}</span>
                                        ))}
                                        {/* 상태 배지 표시 */}
                                        {isToWatch && <Badge bg="danger">To Watch</Badge>}
                                        {isWatched && <Badge bg="success">Watched</Badge>}
                                    </div>
                                </div>
                                
                                {/* [조건부] 추천 지수: Watched 일 때만 표시 */}
                                {isWatched && (
                                    <div className="text-center">
                                        <div className="position-relative d-inline-flex align-items-center justify-content-center" 
                                             style={{width: '80px', height: '80px', borderRadius: '50%', background: '#ffc107', border: '5px solid #fff', boxShadow: '0 0 10px rgba(0,0,0,0.1)'}}>
                                            <div>
                                                <div className="small fw-bold text-dark">추천</div>
                                                <div className="fs-4 fw-bold text-dark">
                                                    {userLog ? userLog.rcmRate : 0}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 2. [조건부] 사용자 평점 분석: Watched 일 때만 표시 */}
                            {isWatched && (
                                <Card className="border-0 shadow-sm mb-4">
                                    <Card.Body className="p-4">
                                        <h4 className="fw-bold mb-4 d-flex align-items-center">
                                            <FaStar className="text-warning me-2" /> 
                                            나의 평점
                                        </h4>
                                        
                                        <Row className="align-items-center mb-4">
                                            {/* 종합 평점 */}
                                            <Col md={3} className="text-center border-end">
                                                <div className="text-muted small">종합 평점</div>
                                                <div className="display-4 fw-bold text-dark">{userLog.totalRate}</div>
                                                <div className="text-warning">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} className={i < Math.round(userLog.totalRate / 2) ? "" : "text-black-50"} />
                                                    ))}
                                                </div>
                                            </Col>
                                            
                                            {/* 상세 평점 그래프 */}
                                            <Col md={9} className="ps-md-4">
                                                <div className="mb-3">
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <span className="fw-bold">📖 시나리오</span>
                                                        <span className="fw-bold text-primary">{userLog.scenarioRate} / 10</span>
                                                    </div>
                                                    <ProgressBar now={userLog.scenarioRate * 10} variant="primary" style={{height: '10px'}} />
                                                </div>
                                                <div className="mb-3">
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <span className="fw-bold">🎬 연출</span>
                                                        <span className="fw-bold text-success">{userLog.directionRate} / 10</span>
                                                    </div>
                                                    <ProgressBar now={userLog.directionRate * 10} variant="success" style={{height: '10px'}} />
                                                </div>
                                                <div>
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <span className="fw-bold">🎵 음악</span>
                                                        <span className="fw-bold text-info">{userLog.musicRate} / 10</span>
                                                    </div>
                                                    <ProgressBar now={userLog.musicRate * 10} variant="info" style={{height: '10px'}} />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            )}

                            {/* 3. 줄거리 및 리뷰 섹션 */}
                            <Card className="border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    {/* 줄거리는 항상 표시 */}
                                    <h5 className="fw-bold mb-3">📝 영화 정보</h5>
                                    
                                    <p className="text-muted mb-2 small fw-bold">줄거리 (Plot)</p>
                                    <div className="bg-white p-3 rounded border mb-4 text-secondary small">
                                        {tmdbData.overview || "줄거리 정보가 없습니다."}
                                    </div>

                                    {/* [조건부] Watched: 리뷰 및 버튼 표시 */}
                                    {isWatched ? (
                                        <>
                                            <h5 className="fw-bold mb-3 mt-4">💬 나의 리뷰</h5>
                                            <div className="bg-light p-3 rounded" style={{borderLeft: '5px solid #ffc107'}}>
                                                {userLog && userLog.review ? (
                                                    <p className="mb-0 fs-5 fst-italic text-dark" style={{lineHeight: '1.6'}}>
                                                        "{userLog.review}"
                                                    </p>
                                                ) : (
                                                    <p className="text-muted fst-italic mb-0">작성된 리뷰가 없습니다.</p>
                                                )}
                                            </div>
                                            
                                            <div className="d-flex justify-content-end mt-3">
                                                <Button variant="outline-secondary" onClick={() => {
                                                            console.log("클릭한 영화 ID:", userLog.movieID); // 1. ID가 찍히는지 확인!
                                                            
                                                            if (userLog.movieID) {
                                                                navigate(`/edit/${userLog.movieID}`); // 2. ID가 있을 때만 이동
                                                            } else {
                                                                alert("영화 ID가 없습니다! 데이터를 확인해주세요.");
                                                            }
                                                        }} size="sm" className="me-2"><FaPencilAlt />edit</Button>
                                                <Button variant="outline-danger" size="sm"><FaTrash />delete</Button>
                                            </div>
                                        </>
                                    ) : (
                                        // [조건부] To Watch 또는 기록 없음: 안내 문구 표시
                                        <div className="alert alert-secondary mt-4 text-center">
                                            {isToWatch 
                                                ? "현재 '보고 싶은 영화(To Watch)' 리스트에 담겨 있습니다. 감상 후 [Watched] 버튼을 눌러 평점을 남겨주세요!" 
                                                : "아직 평가 기록이 없는 영화입니다."}
                                        </div>
                                    )}

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