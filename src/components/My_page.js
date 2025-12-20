import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Card, Badge, Modal, Form, ListGroup, InputGroup } from 'react-bootstrap';
import { FaTrash, FaSignOutAlt, FaListUl, FaFilm, FaPencilAlt, FaSearch, FaPlus } from 'react-icons/fa';
import axios from 'axios';

export default function My_page({ currentUser, setCurrentUser }) { 
    
    // --- API key ---
    const API_KEY = '2053a71530878c5b6173a50b7e28855d';
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
    const MOCK_API_URL = 'https://69363c86f8dc350aff3031af.mockapi.io/Login';
    const MOVIE_INFO_URL = 'https://69363c86f8dc350aff3031af.mockapi.io/movieInfo';
    
    // --- list 관련 State ---
    const [toWatchMovies, setToWatchMovies] = useState([]);
    const [watchedMovies, setWatchedMovies] = useState([]);

    // 렌더링용 ID 목록 추출 (useEffect 의존성용)
    const myToWatchIds = Array.isArray(currentUser?.toWatch_movies)
        ? currentUser.toWatch_movies.map((id) => Number(id)) 
        : [];

    const myWatchedIds = Array.isArray(currentUser?.watched_movies)
        ? currentUser.watched_movies.map((id) => Number(id))
        : [];
    
    // --- modal 관련 State ---
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'towatch' or 'watched'
    const [searchQuery, setSearchQuery] = useState(''); // 검색어
    const [searchResults, setSearchResults] = useState([]); // 검색 결과

    const navigate = useNavigate();

    // --- modal 열기/닫기 함수 ---
    const handleOpenModal = (type) => {
        setModalType(type);
        setShowModal(true);
        setSearchQuery(''); 
        setSearchResults([]); 
    };

    const handleCloseModal = () => setShowModal(false);

    // --- 영화 검색 함수 (TMDB API) ---
    const handleSearch = async () => {
        if (!searchQuery) return;
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ko-KR&query=${searchQuery}`);
            setSearchResults(res.data.results);
        } catch (error) {
            console.error("검색 실패:", error);
        }
    };

    // --- 영화 추가 함수 (기능 예시) ---
    const handleAddMovie = async (movie) => {
        // 1. [중복 체크] 이미 리스트에 있는지 확인
        // modalType에 따라 어느 배열을 볼지 결정 ('towatch' 또는 'watched')
        const targetField = modalType === 'toWatch' ? 'toWatch_movies' : 'watched_movies';
        const currentIds_toWatch = Array.isArray(currentUser['toWatch_movies']) ? currentUser['toWatch_movies'] : [];
        const currentIds_watched = Array.isArray(currentUser['watched_movies']) ? currentUser['watched_movies'] : [];
        const currentIds_compare = [...currentIds_toWatch, ...currentIds_watched];
        const currentIds = Array.isArray(currentUser[targetField]) ? currentUser[targetField] : [];

        // ID 타입 통일(Number)하여 비교
        if (currentIds_toWatch.includes(movie.id)) {
            alert(`이미 To watch 목록에 추가된 영화입니다.`);
            return;
        } else if (currentIds_watched.includes(movie.id)){
            alert(`이미 watched 목록에 추가된 영화입니다.`);
            return;
        }

        console.log(`currentids: ${currentIds_compare}`);
        const newIds = [...currentIds, Number(movie.id)];
        const updatedUser = {
            ...currentUser,
            [targetField]: newIds
        };

        await axios.put(`${MOCK_API_URL}/${currentUser.id}`, updatedUser);

        const uKey = Number(currentUser.key);
        const mID = Number(movie.id);
        await axios.post(MOVIE_INFO_URL, {
                userKey: uKey,
                movieID: mID,
                totalRate: 0,
                scenarioRate: 0,
                directionRate: 0,
                musicRate: 0,
                review: '',
                rcmRate: 0,
                listCategory: modalType 
        });
        console.log(`새로운 MovieInfo 생성 (POST) -> ${modalType}`);

        // 4. [UI 업데이트] 화면 즉시 갱신
        setCurrentUser(updatedUser); // 부모 state(currentUser) 갱신

        // 현재 보고 있는 모달 리스트 state에도 추가 (새로고침 없이 바로 보이게)
        if (modalType === 'toWatch') {
            setToWatchMovies(prev => [...prev, movie]);
        } else {
            setWatchedMovies(prev => [...prev, movie]);
        }

        alert(`[${movie.title}] 영화가 추가되었습니다!`);
    };

    // --- 삭제 핸들러 함수 ---
    const handleDelete = async (e, movieId, listType) => {
        // 이벤트 버블링 방지 (카드 클릭 방지)
        if (e) e.stopPropagation(); 

        if (!window.confirm("정말로 이 영화를 목록에서 삭제하시겠습니까?")) return;

        try {
            // 1. [Login 리소스] currentUser의 배열에서 ID 제거
            // listType: 'towatch' -> DB필드: 'toWatch_movies'
            // listType: 'watched' -> DB필드: 'watched_movies'
            const targetField = listType === 'toWatch' ? 'toWatch_movies' : 'watched_movies';
            
            // 현재 배열 가져오기
            const currentIds = Array.isArray(currentUser[targetField]) ? currentUser[targetField] : [];

            // 삭제할 ID 필터링 (숫자 변환 비교)
            const newIds = currentIds.filter(id => Number(id) !== Number(movieId));

            // 업데이트할 유저 객체 생성
            const updatedUser = {
                ...currentUser,
                [targetField]: newIds
            };

            // Login 리소스에 PUT 요청
            await axios.put(`${MOCK_API_URL}/${currentUser.id}`, updatedUser);


            // 2. [MovieInfo 리소스] 평점/리뷰 데이터 삭제
            if (currentUser.key) {
                const uKey = Number(currentUser.key);
                const mID = Number(movieId);

                // 해당 영화의 기록이 있는지 조회
                const infoRes = await axios.get(`${MOVIE_INFO_URL}?userKey=${uKey}&movieID=${mID}`);

                // 기록이 존재하면 삭제 (DELETE)
                if (infoRes.data && infoRes.data.length > 0) {
                    const recordId = infoRes.data[0].id;
                    await axios.delete(`${MOVIE_INFO_URL}/${recordId}`);
                    console.log(`MovieInfo 데이터 삭제 완료 (ID: ${recordId})`);
                }
            }

            // 3. [UI 업데이트] State 변경으로 화면 즉시 갱신
            if (setCurrentUser) {
                setCurrentUser(updatedUser); // 부모 State 갱신
            }

            // 로컬 State 갱신 (즉각 반응용)
            if (listType === 'toWatch') {
                setToWatchMovies(prev => prev.filter(m => m.id !== movieId));
            } else {
                setWatchedMovies(prev => prev.filter(m => m.id !== movieId));
            }

            alert("삭제되었습니다.");

        } catch (error) {
            console.error("삭제 실패:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // --To watch -> watched 핸들러
    const handleMoveToWatched = async (e, movie) => {
        if (e) e.stopPropagation(); // 카드 클릭 방지

        if (!window.confirm(`'${movie.title}' (을)를 Watched list로 이동하시겠습니까?`)) return;

        try {
            // 1. [Login 리소스 업데이트] 배열 이동
            const currentToWatch = Array.isArray(currentUser.toWatch_movies) ? currentUser.toWatch_movies : [];
            const currentWatched = Array.isArray(currentUser.watched_movies) ? currentUser.watched_movies : [];

            // To Watch에서 제거
            const newToWatch = currentToWatch.filter(id => Number(id) !== Number(movie.id));
            // Watched에 추가 (중복 방지)
            const newWatched = currentWatched.map(id => Number(id)).includes(Number(movie.id)) 
                ? currentWatched 
                : [...currentWatched, Number(movie.id)];

            const updatedUser = {
                ...currentUser,
                toWatch_movies: newToWatch,
                watched_movies: newWatched
            };

            await axios.put(`${MOCK_API_URL}/${currentUser.id}`, updatedUser);


            // 2. [MovieInfo 리소스 업데이트] 카테고리 변경 (toWatch -> watched)
            const uKey = Number(currentUser.key);
            const mID = Number(movie.id);

            // 데이터 조회
            let recordId = null;
            try {
                const checkRes = await axios.get(`${MOVIE_INFO_URL}?userKey=${uKey}&movieID=${mID}`);
                if (checkRes.data && checkRes.data.length > 0) {
                    recordId = checkRes.data[0].id;
                }
            } catch (err) {
                // 404 등 에러 시 무시 (데이터 없으면 새로 생성)
            }

            if (recordId) {
                // (A) 기존 데이터가 있으면 -> 수정 (PUT)
                await axios.put(`${MOVIE_INFO_URL}/${recordId}`, {
                    listCategory: 'watched'
                });
                console.log(`MovieInfo 이동 (ID: ${recordId}): toWatch -> watched`);
            } else {
                // (B) 데이터가 없으면 -> 새로 생성 (POST)
                await axios.post(MOVIE_INFO_URL, {
                    userKey: uKey,
                    movieID: mID,
                    totalRate: 0,
                    scenarioRate: 0,
                    directionRate: 0,
                    musicRate: 0,
                    review: '',
                    rcmRate: 0,
                    listCategory: 'watched'
                });
                console.log(`새로운 MovieInfo 생성 -> watched`);
            }


            // 3. [UI 업데이트]
            if (setCurrentUser) setCurrentUser(updatedUser);

            // 로컬 State 이동 처리
            setToWatchMovies(prev => prev.filter(m => m.id !== movie.id)); // To Watch에서 제거
            setWatchedMovies(prev => [...prev, movie]); // Watched에 추가

            alert(`[${movie.title}] Watched list로 이동되었습니다!`);

        } catch (error) {
            console.error("이동 중 오류 발생:", error);
            alert("처리 중 오류가 발생했습니다.");
        }
    };

    // --- 영화 정보 Fetching (useEffect) ---
    useEffect(() => {
        const fetchMovies = async (ids, setState) => {
            try {
                if (!ids || ids.length === 0) {
                    setState([]);
                    return;
                }
                const requests = ids.map(id =>
                    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=ko-KR`)
                );
                const responses = await Promise.all(requests);
                const moviesData = responses.map(res => res.data);
                setState(moviesData);
            } catch (error) {
                console.error("영화 정보를 가져오는데 실패했습니다:", error);
                setState([]);
            }
        };

        if (!currentUser?.id) {
            setToWatchMovies([]);
            setWatchedMovies([]);
            return;
        }

        fetchMovies(myToWatchIds, setToWatchMovies);
        fetchMovies(myWatchedIds, setWatchedMovies);

    }, [currentUser]); // currentUser가 변경될 때(삭제/추가 등) 실행
    
    return(
        <>
            <div className="d-flex flex-column min-vh-100 bg-light">
                <div id="div_my-page_header">
                    <Navbar bg="dark" variant="dark" className="px-4 position-relative">
                        <Container fluid>
                            <Navbar.Brand 
                                href="#" 
                                className="fw-bold text-warning fs-3 position-absolute start-50 translate-middle-x"
                            >
                                <FaFilm size={30} className="me-2" />
                                MovieArchive
                            </Navbar.Brand>
                            
                            <Nav className="ms-auto d-flex flex-row gap-2">
                                {currentUser?.email_name && (
                                    <span className="btn btn-outline-light btn-sm disabled" style={{ cursor: 'default' }}>
                                    Login : <strong>{currentUser.email_name}</strong> 님
                                    </span>
                                )}
                                <Button variant="outline-light" size="sm" onClick={() => navigate('/')}>
                                    <FaListUl /> main page
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => navigate('/logout')}>
                                    <FaSignOutAlt /> sign out
                                </Button>
                            </Nav>
                        </Container>
                    </Navbar>
                </div>

                <Container fluid id="div_my-page_contents" className="flex-grow-1 pt-4 pb-5" style={{paddingLeft: "0px", paddingRight: "0px"}}>
                    
                    {/* --- To Watch Section --- */}
                    <div id="div_my-page_towatch" className="mb-5">
                        <div className="d-flex justify-content-between align-items-center mt-3 mb-3" style={{marginLeft: "2%"}}>
                            <div className="d-flex align-items-center">
                                <h3 className="fw-bold me-2">To watch</h3>
                                <Badge bg="danger" pill>{toWatchMovies.length}</Badge>
                            </div>
                            <Button variant="outline-dark" size="sm" className="d-flex align-items-center" onClick={() => handleOpenModal('toWatch')} style={{marginRight: "2%"}}>
                                <FaPencilAlt className="me-1" /> edit
                            </Button>
                        </div>

                        <div className="film-strip-container bg-dark px-2 shadow-lg overflow-auto w-100">
                            <div className="d-flex flex-nowrap gap-4" style={{ minWidth: 'min-content' }}>
                                {toWatchMovies.length > 0 ? (
                                    toWatchMovies.map((movie) => (
                                        <div key={movie.id} className="film-frame bg-black p-2" style={{ minWidth: '220px', border: '2px solid #333' }}>
                                            <div className="film-holes-top d-flex justify-content-between mb-2">
                                                {[...Array(5)].map((_, i) => <div key={i} style={{width: '10px', height: '10px', background: 'white', borderRadius: '50%'}}></div>)}
                                            </div>

                                            <Card className="border-0 bg-transparent text-white">
                                                <div style={{ height: '280px', overflow: 'hidden', borderRadius: '4px' }}>
                                                    <Card.Img variant="top" src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'} style={{objectFit: 'cover', height: '100%'}}/>
                                                </div>
                                                <Card.Body className="p-2 text-center">
                                                    <Card.Title className="fs-6 fw-bold text-truncate mb-2">{movie.title}</Card.Title>
                                                    <div className="d-flex justify-content-between">
                                                        <Button variant="outline-light" size="sm" onClick={() => navigate(`/detail/${movie.id}`)} style={{fontSize: '0.7rem'}}>
                                                            detail
                                                        </Button>
                                                        <Button 
                                                            variant="outline-success" 
                                                            size="sm" 
                                                            onClick={(e) => handleMoveToWatched(e, movie)}
                                                            style={{fontSize: '0.7rem', padding: '0.25rem 0.4rem'}}
                                                        >
                                                            watched
                                                        </Button>
                                                        <Button 
                                                            variant="outline-danger" 
                                                            size="sm" 
                                                            onClick={(e) => handleDelete(e, movie.id, 'toWatch')} 
                                                            style={{fontSize: '0.7rem'}}
                                                        >
                                                            delete
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>

                                            <div className="film-holes-bottom d-flex justify-content-between mt-2">
                                                {[...Array(5)].map((_, i) => <div key={i} style={{width: '10px', height: '10px', background: 'white', borderRadius: '50%'}}></div>)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-white p-4">아직 찜한 영화가 없습니다.</div>
                                )}
                            </div>
                        </div>
                    </div>
                                
                    {/* --- Watched Section --- */}
                    <div id="div_my-page_watched">
                        <div className="d-flex justify-content-between align-items-center mt-5 mb-3" style={{marginLeft: "2%"}}>
                            <div className="d-flex align-items-center">
                                <h3 className="fw-bold me-2">Watched</h3>
                                <Badge bg="secondary" pill>{watchedMovies.length}</Badge>
                            </div>
                            <Button variant="outline-dark" size="sm" className="d-flex align-items-center" onClick={() => handleOpenModal('watched')} style={{marginRight: "2%"}}>
                                <FaPencilAlt className="me-1" /> edit
                            </Button>
                        </div>

                        <div className="film-strip-container bg-dark px-2 shadow-lg overflow-auto w-100">
                            <div className="d-flex flex-nowrap gap-4" style={{ minWidth: 'min-content' }}>
                                {watchedMovies.length > 0 ? (
                                    watchedMovies.map((movie) => (
                                        <div key={movie.id} className="film-frame bg-black p-2" style={{ minWidth: '220px', border: '2px solid #333' }}>
                                            <div className="film-holes-top d-flex justify-content-between mb-2">
                                                {[...Array(5)].map((_, i) => <div key={i} style={{width: '10px', height: '10px', background: 'white', borderRadius: '50%'}}></div>)}
                                            </div>

                                            <Card className="border-0 bg-transparent text-white">
                                                <div style={{ height: '280px', overflow: 'hidden', borderRadius: '4px' }}>
                                                    <Card.Img variant="top" src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'} style={{objectFit: 'cover', height: '100%'}} />
                                                </div>
                                                <Card.Body className="p-2 text-center">
                                                    <Card.Title className="fs-6 fw-bold text-truncate mb-2">{movie.title}</Card.Title>
                                                    <div className="d-flex justify-content-between">
                                                        <Button variant="outline-light" size="sm" onClick={() => navigate(`/detail/${movie.id}`)} style={{fontSize: '0.7rem'}}>
                                                            detail
                                                        </Button>
                                                        {/* Delete Button */}
                                                        <Button 
                                                            variant="outline-danger" 
                                                            size="sm" 
                                                            onClick={(e) => handleDelete(e, movie.id, 'watched')} 
                                                            style={{fontSize: '0.7rem'}}
                                                        >
                                                            delete
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>

                                            <div className="film-holes-bottom d-flex justify-content-between mt-2">
                                                {[...Array(5)].map((_, i) => <div key={i} style={{width: '10px', height: '10px', background: 'white', borderRadius: '50%'}}></div>)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-white p-4">아직 본 영화가 없습니다.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

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
            
            {/* CRUD modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton className="bg-dark text-white">
                    <Modal.Title className="fw-bold">
                        <FaFilm className="me-2" />
                        {modalType === 'toWatch' ? 'Edit To Watch List' : 'Edit Watched List'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-light">
                    {/* 1. 영화 검색 영역 */}
                    <h5 className="fw-bold mb-3">Add new movies</h5>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="search with movie title"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button variant="dark" onClick={handleSearch}>
                            <FaSearch /> search
                        </Button>
                    </InputGroup>

                    {/* 2. 검색 결과 리스트 */}
                    {searchResults.length > 0 && (
                        <Card className="mb-4 shadow-sm">
                            <ListGroup variant="flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {searchResults.map(movie => (
                                    <ListGroup.Item key={movie.id} className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <img 
                                                src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/50x75'} 
                                                alt={movie.title}
                                                style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginRight: '10px' }}
                                            />
                                            <div>
                                                <div className="fw-bold">{movie.title}</div>
                                                <small className="text-muted">{movie.release_date ? movie.release_date.substring(0, 4) : '미정'}</small>
                                            </div>
                                        </div>
                                        <Button variant="outline-primary" size="sm" onClick={() => handleAddMovie(movie)}>
                                            <FaPlus /> add
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card>
                    )}

                    <hr />

                    {/* 3. 현재 리스트 관리 (삭제/수정용) */}
                    <h5 className="fw-bold mb-3 mt-4">Current list ({modalType === 'toWatch' ? toWatchMovies.length : watchedMovies.length})</h5>
                    <ListGroup variant="flush">
                        {(modalType === 'toWatch' ? toWatchMovies : watchedMovies).map(movie => (
                            <ListGroup.Item key={movie.id} className="d-flex justify-content-between align-items-center bg-white border mb-2 rounded shadow-sm">
                                <div className="d-flex align-items-center">
                                     <span className="fw-bold me-2">#{movie.id}</span>
                                     <span>{movie.title}</span>
                                </div>
                                <div>
                                    {/* Watched 리스트일 경우에만 Edit 버튼 표시 */}
                                    {modalType === 'watched' && (
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => {
                                                handleCloseModal(); // 이동 전 모달 닫기
                                                navigate(`/edit/${movie.id}`);
                                            }}
                                        >
                                            <FaPencilAlt /> edit
                                        </Button>
                                    )}

                                    {/* Modal 내부 삭제 버튼 */}
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm" 
                                        onClick={(e) => handleDelete(e, movie.id, modalType)}
                                    >
                                        <FaTrash /> delete
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}