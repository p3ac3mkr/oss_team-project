import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { FaListUl, FaFilm, FaSignOutAlt } from 'react-icons/fa';

// API keys
const MOCK_API_URL = 'https://69363c86f8dc350aff3031af.mockapi.io/Login';
const MOCK_MOVIE_INFO_URL = 'https://69363c86f8dc350aff3031af.mockapi.io/movieInfo';

const TMDB_API_KEY = '2053a71530878c5b6173a50b7e28855d'; 
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';

const MainPage = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 영화 리스트 (메모이제이션)
  const toWatchIds = useMemo(() => {
    return Array.isArray(currentUser?.toWatch_movies) ? currentUser.toWatch_movies : [];
  }, [currentUser]);

  const watchedIds = useMemo(() => {
    return Array.isArray(currentUser?.watched_movies) ? currentUser.watched_movies : [];
  }, [currentUser]);
  
  // --- MovieInfo 업데이트 함수 ---
  const updateMovieInfoState = async (movieId, newCategory) => {
    try {
        const uKey = Number(currentUser.key);
        const mID = Number(movieId);

        console.log(`[DEBUG] 1. 조회 시작: userKey=${uKey}, movieID=${mID}`);

        // 1. 기존 데이터 조회
        const getRes = await fetch(`${MOCK_MOVIE_INFO_URL}?userKey=${uKey}&movieID=${mID}`);
        
        let getData = [];

        if (getData && getData.length > 0) {
            // [PUT] 이미 데이터가 있으면 수정
            console.log("[DEBUG] 3. 데이터 존재 -> PUT 실행");
            const recordId = getData[0].id;
            
            const putRes = await fetch(`${MOCK_MOVIE_INFO_URL}/${recordId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listCategory: newCategory }),
            });

            if(putRes.ok) console.log(`[SUCCESS] MovieInfo Updated (PUT)`);

        } else {
            // [POST] 데이터가 없으면 생성
            console.log("[DEBUG] 3. 데이터 없음 -> POST 실행");
            
            const postRes = await fetch(MOCK_MOVIE_INFO_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userKey: uKey,
                    movieID: mID,
                    totalRate: 0,
                    scenarioRate: 0,
                    directionRate: 0,
                    musicRate: 0,
                    review: '',
                    rcmRate: 0,
                    listCategory: newCategory
                }),
            });

            if (postRes.ok) {
                 console.log(`[SUCCESS] MovieInfo Created (POST)`);
            } else {
                 console.error(`[ERROR] POST Failed. Status: ${postRes.status}. URL 확인 필요: ${MOCK_MOVIE_INFO_URL}`);
            }
        }
    } catch (err) {
        console.error("[CRITICAL ERROR] updateMovieInfoState 함수 내부 오류:", err);
    }
  };

  // TMDB API Fetching ...
  const fetchNowPlaying = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=ko-KR&page=1`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setMovies((data.results || []).slice(0, 24));
    } catch (e) { setError('영화 목록 로딩 실패'); } 
    finally { setLoading(false); }
  };

  const handleSearch = async () => {
    if (!query.trim()) return fetchNowPlaying();
    setLoading(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=ko-KR&query=${encodeURIComponent(query)}&page=1&include_adult=false`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setMovies((data.results || []).slice(0, 24));
    } catch (e) { setError('검색 실패'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNowPlaying(); }, []);


  // =========================================================
  // To Watch 버튼 핸들러
  const handleToggletoWatch = async (movieId) => {
    if (!currentUser?.id) return alert('로그인 후 이용 가능합니다.');

    // 중복 발생 (Watched 리스트에 이미 있는 경우)
    if (watchedIds.includes(movieId)) {
        if (window.confirm("이미 'Watched(시청함)' 목록에 있습니다.\n'To Watch' 목록으로 이동하시겠습니까?")) {
            // 이동 로직: Watched 제거 & ToWatch 추가
            const newWatched = watchedIds.filter(id => id !== movieId);
            const newToWatch = [...toWatchIds, movieId];

            try {
                // Login 리소스 업데이트 (양쪽 배열 수정)
                const payload = { ...currentUser, toWatch_movies: newToWatch, watched_movies: newWatched };
                const res = await fetch(`${MOCK_API_URL}/${currentUser.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                
                if (res.ok) {
                    const updatedUser = await res.json();
                    setCurrentUser?.(updatedUser);
                    await updateMovieInfoState(movieId, 'toWatch'); // MovieInfo도 수정
                    alert("이동되었습니다!");
                }
            } catch (e) { console.error(e); }
        }
        return; 
    }

    // 중복 없음 -> 일반적인 추가/삭제
    const already = toWatchIds.includes(movieId);
    const next = already ? toWatchIds.filter(id => id !== movieId) : [...toWatchIds, movieId];

    try {
        const payload = { ...currentUser, toWatch_movies: next };
        const res = await fetch(`${MOCK_API_URL}/${currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            const updatedUser = await res.json();
            setCurrentUser?.(updatedUser); 

            if (!already) {
                await updateMovieInfoState(movieId, 'toWatch');
                alert("'To watch' 리스트에 추가되었습니다!");
            }
        }
    } catch (e) {
        console.error(e);
        alert("저장 실패");
    }
  };


  // Watched 버튼 핸들러
  const handleToggleWatched = async (movieId) => {
    if (!currentUser?.id) return alert('로그인 후 이용 가능합니다.');

    // 중복 발생 (To Watch 리스트에 이미 있는 경우)
    if (toWatchIds.includes(movieId)) {
        if (window.confirm("이미 'To Watch(보고 싶은)' 목록에 있습니다.\n'Watched' 목록으로 이동하시겠습니까?")) {
            // 이동 로직: ToWatch 제거 & Watched 추가
            const newToWatch = toWatchIds.filter(id => id !== movieId);
            const newWatched = [...watchedIds, movieId];

            try {
                // Login 리소스 업데이트 (양쪽 배열 수정)
                const payload = { ...currentUser, toWatch_movies: newToWatch, watched_movies: newWatched };
                const res = await fetch(`${MOCK_API_URL}/${currentUser.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (res.ok) {
                    const updatedUser = await res.json();
                    setCurrentUser?.(updatedUser);
                    await updateMovieInfoState(movieId, 'watched'); 
                    alert("이동되었습니다!");
                }
            } catch (e) { console.error(e); }
        }
        return; 
    }

    // 중복 없음 -> 일반적인 추가/삭제
    const already = watchedIds.includes(movieId);
    const next = already ? watchedIds.filter(id => id !== movieId) : [...watchedIds, movieId];

    try {
        const payload = { ...currentUser, watched_movies: next };
        const res = await fetch(`${MOCK_API_URL}/${currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            const updatedUser = await res.json();
            setCurrentUser?.(updatedUser); 

            if (!already) {
                await updateMovieInfoState(movieId, 'watched');
                alert("'Watched' 리스트에 추가되었습니다!");
            }
        }
    } catch (e) {
        console.error(e);
        alert("저장 실패");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
        {/* 상단 헤더 (반응형: 작은 화면에서는 버튼이 아래로 내려감) */}
        {/* 헤더 */}
        <div id="div_my-page_header">
          <Navbar bg="dark" variant="dark" expand="lg" className="px-4 position-relative">
            <Container fluid>
              {/* 로고 (항상 중앙) */}
              <Navbar.Brand
                href="#"
                className="fw-bold text-warning fs-3 position-absolute start-50 translate-middle-x"
              >
                <FaFilm size={30} className="me-2" />
                MovieArchive
              </Navbar.Brand>

              {/* 모바일 햄버거 버튼 */}
              <Navbar.Toggle aria-controls="mainpage-navbar" />

              {/* 버튼 영역 */}
              <Navbar.Collapse
                id="mainpage-navbar"
                className="justify-content-end"
              >
                <Nav className="ms-auto d-flex flex-row gap-2 align-items-center header-actions">

                  {/* 로그인 정보 */}
                  {currentUser?.email_name && (
                    <span
                      className="btn btn-outline-light btn-sm disabled text-start"
                      style={{ cursor: 'default' }}
                    >
                      Login : <strong>{currentUser.email_name}</strong> 님
                    </span>
                  )}

                  {/* 마이페이지 */}
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={() => navigate('/mypage')}
                  >
                    <FaListUl /> my page
                  </Button>

                  {/* 로그아웃 */}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => navigate('/login')}
                  >
                    <FaSignOutAlt /> sign out
                  </Button>
                </Nav>
              </Navbar.Collapse>

              <Navbar.Brand href="#" className="fw-bold text-warning fs-3 position-absolute start-50 translate-middle-x">
                <FaFilm size={30} className="me-2" />
                MovieArchive
              </Navbar.Brand>
              <Nav className="ms-auto d-flex flex-row gap-2">
                  {currentUser?.email_name && (
                    <span className="btn btn-outline-light btn-sm disabled" style={{ cursor: 'default' }}>
                      Login : <strong>{currentUser.email_name}</strong> 님
                    </span>
                  )}
                <Button variant="outline-light" size="sm" onClick={() => navigate('/mypage')}>
                  <FaListUl /> my page
                </Button>
                <Button variant="danger" size="sm" onClick={() => navigate('/login')}>
                  <FaSignOutAlt /> sign out
                </Button>
              </Nav>
            </Container>
          </Navbar>
        </div>
        {/* 검색 및 리스트 */}
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
            <div className="d-flex w-100 w-md-50" style={{ maxWidth: '1580px' }}>
              <input type="text" className="form-control me-2" placeholder="영화 제목 검색..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
              <button className="btn btn-outline-dark btn-lg" onClick={handleSearch}>search</button>
            </div>
          </div>
        </div>

        {loading && <div className="alert alert-secondary text-center">불러오는 중...</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <h3 className="fw-bold mb-3 ms-4">🔥 현재 상영작</h3>
        <div className="row row-cols-2 row-cols-md-4 g-4 mb-5 px-4">
          {movies.map((movie) => {
            const posterSrc = movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : `https://via.placeholder.com/300x450?text=No+Poster`;
            const isFav = toWatchIds.includes(movie.id);
            const isWatched = watchedIds.includes(movie.id);

            return (
              <div className="col" key={movie.id}>
                <div className="card h-100 shadow-sm border-0">
                  <img src={posterSrc} className="card-img-top" alt={movie.title} loading="lazy" />
                  <div className="card-body">
                    <h6 className="card-title fw-bold mb-1">{movie.title}</h6>
                    <p className="card-text text-muted small mb-2">{movie.release_date ? `${movie.release_date} 개봉` : '개봉일 미정'}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-warning fw-bold">★ {typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : '-'}</span>
                      <div className="d-flex gap-2">
                        <button
                          className={`btn btn-sm ${isFav ? 'btn-outline-danger' : 'btn-outline-danger'}`}
                          style={{ fontSize: '0.7rem' }}
                          onClick={() => handleToggleFavorite(movie.id)}
                        >
                          {isFav ? 'To Watch ✓' : 'To Watch'}
                        </button>
                        <button className={`btn btn-sm ${isFav ? 'btn-danger' : 'btn-outline-danger'}`} style={{ fontSize: '0.7rem' }} onClick={() => handleToggletoWatch(movie.id)}>
                          {isFav ? 'To watch ✓' : 'To watch'}
                        </button>
                        <button className={`btn btn-sm ${isWatched ? 'btn-success' : 'btn-outline-success'}`} style={{ fontSize: '0.7rem' }} onClick={() => handleToggleWatched(movie.id)}>
                          {isWatched ? 'Watched ✓' : 'Watched'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      
        <div id="footer" className="bg-dark text-white py-3 mt-5">
            <Container fluid className="d-flex justify-content-between align-items-center">
                <Navbar.Brand href="#" className="fw-bold text-warning fs-3 d-flex align-items-center">
                    <FaFilm size={24} className="me-2" /> MovieArchive
                </Navbar.Brand>
                <p className="small text-white-50 mb-0">2025-12 MovieArchive Project.</p>
            </Container>
        </div>
    </div>
  );
};

export default MainPage;