import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Button, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaTrash, FaSignOutAlt, FaListUl, FaFilm, FaPlus, FaPencilAlt, FaListOl } from 'react-icons/fa';
import axios from 'axios';

export default function My_page() {

    const API_KEY = '2053a71530878c5b6173a50b7e28855d';
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    const [toWatchMovies, setToWatchMovies] = useState([]);
    const [watchedMovies, setWatchedMovies] = useState([]);

    const myToWatchIds = [27205, 157336, 155, 496243]; // 인셉션, 인터스텔라, 다크나이트, 기생충
    const myWatchedIds = [299534, 299536]; // 엔드게임, 인피니티 워

    useEffect(() => {
        const fetchMovies = async (ids, setState) => {
            try {
                // 여러 개의 ID를 동시에 비동기로 요청
                const requests = ids.map(id => 
                    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=ko-KR`)
                );
                
                // 모든 요청이 끝날 때까지 기다리기
                const responses = await Promise.all(requests);
                
                // 응답에서 data만 뽑아서 State에 저장
                const moviesData = responses.map(res => res.data);
                setState(moviesData);
            } catch (error) {
                console.error("영화 정보를 가져오는데 실패했습니다:", error);
            }
        };

        fetchMovies(myToWatchIds, setToWatchMovies);
        fetchMovies(myWatchedIds, setWatchedMovies);
    }, []);

    const toWatchList = [1, 2, 3, 4]; // 볼 영화
    const watchedList = [1, 2];       // 본 영화
    
    return(
        <>
            <div className="d-flex flex-column min-vh-100 bg-light">
                <div id="div_my-page_header">
                    <Navbar bg="dark" variant="dark" className="px-4 position-relative">
                        <Container fluid>
                            {/* header 로고: position-absolute로 화면 정중앙 강제 고정 */}
                            <Navbar.Brand 
                                href="#" 
                                className="fw-bold text-warning fs-3 position-absolute start-50 translate-middle-x"
                            >
                                <FaFilm size={30} className="me-2" />
                                MovieArchive
                            </Navbar.Brand>
                            
                            {/* header 우측 버튼 그룹: ms-auto로 오른쪽 끝으로 밀기 */}
                            <Nav className="ms-auto d-flex flex-row gap-2">
                                {/* 메인으로 가기 */}
                                <Button variant="outline-light" size="sm" href="/">
                                    <FaListUl /> main page
                                </Button>
                                
                                {/* 로그아웃 */}
                                <Button variant="danger" size="sm">
                                    <FaSignOutAlt /> sign out
                                </Button>
                            </Nav>
                        </Container>
                    </Navbar>
                </div>

                <Container fluid id="div_my-page_contents" className="flex-grow-1 pt-4 pb-5" style={{paddingLeft: "0px", paddingRight: "0px"}}>
                    <div id="div_my-page_towatch" className="mb-5">
                        <div id="div_my-page_towatch_title" className="d-flex justify-content-between align-items-center mt-3 mb-3" style={{marginLeft: "2%"}}>
                            <div id="div_my-page_towatch_title_title" className="d-flex align-items-center">
                                <h3 className="fw-bold me-2">To watch</h3>
                                <Badge bg="danger" pill>{toWatchMovies.length}</Badge>
                            </div>
                            <Button variant="outline-dark" size="sm" className="d-flex align-items-center" style={{marginRight: "2%"}}>
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
                                                        <Button variant="outline-light" size="sm" style={{fontSize: '0.7rem'}}>detail</Button>
                                                        <Button variant="outline-danger" size="sm" style={{fontSize: '0.7rem'}}>delete</Button>
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
                                
                    <div id="div_my-page_watched">
                        <div id="div_my-page_watched_title" className="d-flex justify-content-between align-items-center mt-5 mb-3" style={{marginLeft: "2%"}}>
                            <div id="div_my-page_towatch_title_title" className="d-flex align-items-center">
                                <h3 className="fw-bold me-2">Watched</h3>
                                <Badge bg="secondary" pill>{watchedMovies.length}</Badge>
                            </div>
                            <Button variant="outline-dark" size="sm" className="d-flex align-items-center" style={{marginRight: "2%"}}>
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
                                                    <Card.Img 
                                                        variant="top" 
                                                        src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'} 
                                                        style={{objectFit: 'cover', height: '100%'}} 
                                                    />
                                                </div>
                                                <Card.Body className="p-2 text-center">
                                                    <Card.Title className="fs-6 fw-bold text-truncate mb-2">{movie.title}</Card.Title>
                                                    <Button variant="outline-danger" size="sm" className="w-100" style={{fontSize: '0.7rem'}}>delete</Button>
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
                    <Navbar.Brand 
                        href="#" 
                        className="fw-bold text-warning fs-3 d-flex align-items-center"
                    >
                        <FaFilm size={24} className="me-2" />
                        MovieArchive
                    </Navbar.Brand>
                    <p className="small text-white-50 mb-0">
                        2025-12 MovieArchive Project.
                    </p>
                </Container>
            </div>
        </>
    );
}