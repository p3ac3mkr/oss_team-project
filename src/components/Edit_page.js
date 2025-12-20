import React, { useState, useEffect } from 'react';
import { Container, Navbar, Button, Row, Col, Card, Form, Spinner, InputGroup } from 'react-bootstrap';
import { FaArrowLeft, FaSave, FaStar, FaFilm, FaUndo } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Edit_page({ currentUser }) {
    
    const { id } = useParams(); // URL의 movieID
    const navigate = useNavigate();

    // API 설정
    const TMDB_API_KEY = '2053a71530878c5b6173a50b7e28855d';
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
    const MOCK_API_URL = 'https://69363c86f8dc350aff3031af.mockapi.io/movieInfo';

    // State 관리
    const [loading, setLoading] = useState(true);
    const [tmdbData, setTmdbData] = useState(null); // 영화 포스터/제목용
    
    // MockAPI 데이터 식별용 ID (PUT 요청에 필수)
    const [recordId, setRecordId] = useState(null); 

    // 입력 폼 State (스키마 필드와 일치)
    const [formData, setFormData] = useState({
        totalRate: 0,
        scenarioRate: 0,
        directionRate: 0,
        musicRate: 0,
        rcmRate: 0,
        review: '',
        listCategory: '' // 기존 상태 유지용
    });

    // 1. 데이터 불러오기 (GET)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // (A) TMDB 영화 정보 (배경용)
                const movieRes = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=ko-KR`);
                setTmdbData(movieRes.data);

                // (B) MockAPI 기록 조회
                if (currentUser && currentUser.key) {
                    const uKey = Number(currentUser.key);
                    const mID = Number(id);

                    const logRes = await axios.get(`${MOCK_API_URL}?userKey=${uKey}&movieID=${mID}`);

                    if (logRes.data && logRes.data.length > 0) {
                        // 최신 데이터 가져오기
                        const targetData = logRes.data[logRes.data.length - 1];
                        
                        // PUT 요청을 위해 MockAPI의 고유 ID 저장
                        setRecordId(targetData.id); 

                        // 폼 데이터 초기화
                        setFormData({
                            totalRate: targetData.totalRate || 0,
                            scenarioRate: targetData.scenarioRate || 0,
                            directionRate: targetData.directionRate || 0,
                            musicRate: targetData.musicRate || 0,
                            rcmRate: targetData.rcmRate || 0,
                            review: targetData.review || '',
                            listCategory: targetData.listCategory || 'watched' // 없으면 기본값
                        });
                    } else {
                        alert("수정할 기록을 찾을 수 없습니다.");
                        navigate(-1);
                    }
                }
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
                alert("데이터를 불러오는 중 오류가 발생했습니다.");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, currentUser, navigate]);

    // 2. 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        // 숫자인지 텍스트인지 구분하여 저장
        setFormData(prev => ({
            ...prev,
            [name]: name === 'review' || name === 'listCategory' ? value : Number(value)
        }));
    };

    // 3. 저장 핸들러 (PUT)
    const handleSave = async () => {
        if (!recordId) return;

        try {
            const updatePayload = {
                ...formData,
            };

            await axios.put(`${MOCK_API_URL}/${recordId}`, updatePayload);
            
            alert("수정이 완료되었습니다!");
            navigate(`/detail/${id}`); // 상세 페이지로 복귀

        } catch (error) {
            console.error("저장 실패:", error);
            alert("저장에 실패했습니다.");
        }
    };

    if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><Spinner animation="border" /></div>;
    if (!tmdbData) return null;

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            {/* 헤더 */}
            <Navbar bg="dark" variant="dark" className="px-4 shadow-sm mb-4">
                <Container fluid>
                    <Navbar.Brand className="fw-bold text-warning fs-3">
                        <FaFilm className="me-2" /> MovieArchive
                    </Navbar.Brand>
                    <Button variant="outline-light" size="sm" onClick={() => navigate(`/detail/${id}`)}>
                        <FaArrowLeft className="me-1" /> cancel
                    </Button>
                </Container>
            </Navbar>

            <Container className="flex-grow-1 pb-5">
                <Row className="justify-content-center">
                    <Col lg={10}>
                        <Card className="shadow-sm border-0">
                            <Card.Header className="bg-white py-3 border-bottom-0">
                                <h3 className="fw-bold mb-0"> &lt; {tmdbData.title} &gt; 수정하기</h3>
                            </Card.Header>
                            
                            <Card.Body className="p-4">
                                <Row>
                                    {/* 왼쪽: 영화 포스터 */}
                                    <Col md={4} className="mb-4 mb-md-0 text-center">
                                        <img 
                                            src={tmdbData.poster_path ? `${IMAGE_BASE_URL}${tmdbData.poster_path}` : 'https://via.placeholder.com/300x450'} 
                                            alt={tmdbData.title} 
                                            className="img-fluid rounded shadow"
                                            style={{ maxHeight: '400px' }}
                                        />
                                    </Col>

                                    {/* 오른쪽: 입력 폼 */}
                                    <Col md={8}>
                                        <Form>
                                            {/* 1. 종합 평점 & 추천 지수 */}
                                            <Row className="mb-4">
                                                <Col sm={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="fw-bold">⭐ 종합 평점 (0~10)</Form.Label>
                                                        <InputGroup>
                                                            <Form.Control 
                                                                type="number" 
                                                                name="totalRate" 
                                                                min="0" max="10" step="0.5"
                                                                value={formData.totalRate} 
                                                                onChange={handleChange} 
                                                            />
                                                            <InputGroup.Text>/ 10</InputGroup.Text>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="fw-bold">👍 추천 지수 (0~100%)</Form.Label>
                                                        <InputGroup>
                                                            <Form.Control 
                                                                type="number" 
                                                                name="rcmRate" 
                                                                min="0" max="100" step="1"
                                                                value={formData.rcmRate} 
                                                                onChange={handleChange} 
                                                            />
                                                            <InputGroup.Text>%</InputGroup.Text>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <hr className="my-4" />

                                            {/* 2. 상세 평점 (시나리오, 연출, 음악) */}
                                            <h5 className="fw-bold mb-3">📊 상세 평점</h5>
                                            <Row className="mb-3">
                                                <Col sm={4}>
                                                    <Form.Group>
                                                        <Form.Label className="small text-muted">📖 시나리오</Form.Label>
                                                        <Form.Control 
                                                            type="number" name="scenarioRate" 
                                                            min="0" max="10" value={formData.scenarioRate} onChange={handleChange} 
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={4}>
                                                    <Form.Group>
                                                        <Form.Label className="small text-muted">🎬 연출</Form.Label>
                                                        <Form.Control 
                                                            type="number" name="directionRate" 
                                                            min="0" max="10" value={formData.directionRate} onChange={handleChange} 
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={4}>
                                                    <Form.Group>
                                                        <Form.Label className="small text-muted">🎵 음악</Form.Label>
                                                        <Form.Control 
                                                            type="number" name="musicRate" 
                                                            min="0" max="10" value={formData.musicRate} onChange={handleChange} 
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <hr className="my-4" />

                                            {/* 3. 리뷰 작성 */}
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-bold">💬 리뷰</Form.Label>
                                                <Form.Control 
                                                    as="textarea" 
                                                    rows={5} 
                                                    name="review"
                                                    placeholder="영화에 대한 솔직한 감상평을 남겨주세요."
                                                    value={formData.review} 
                                                    onChange={handleChange} 
                                                />
                                            </Form.Group>

                                            {/* 버튼 영역 */}
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button variant="secondary" onClick={() => navigate(-1)}>
                                                    <FaUndo className="me-1" /> cancel
                                                </Button>
                                                <Button variant="primary" onClick={handleSave}>
                                                    <FaSave className="me-1" /> save
                                                </Button>
                                            </div>
                                        </Form>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}