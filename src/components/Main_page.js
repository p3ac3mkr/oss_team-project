//만약 수정할 사항 있으면 주석 달아주십쇼 아마 이제 메인페이지 건들듯?
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { FaListUl, FaFilm, FaSignOutAlt } from 'react-icons/fa';

const MOCK_API_URL = 'https://69363c86f8dc350aff3031af.mockapi.io/Login';
const MOCK_MOVIE_INFO_URL = 'https://69363c86f8dc350aff3031af.mockapi.io/movieInfo';
const TMDB_API_KEY = '2053a71530878c5b6173a50b7e28855d'; 
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';

// 메인 페이지 component
const MainPage = ({ currentUser, setCurrentUser}) => {
  const userEmail = currentUser?.email_name;
  const footerDate = "2025-12";
  const navigate = useNavigate();
  // TMDB 영화 목록
  const [movies, setMovies] = useState([]);

  // 검색
  const [query, setQuery] = useState('');

  // 로딩/에러 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 유저 찜 목록
  const favoriteIds = useMemo(() => {
    const arr = currentUser?.favorite_movies;
    return Array.isArray(arr) ? arr : [];
  }, [currentUser]);

  //유저 시청 목록
  const watchedIds = useMemo(() => {
    const arr = currentUser?.watched_movies;
    return Array.isArray(arr) ? arr : [];
  }, [currentUser]);
  
  // TMDB: 현재 상영작 불러오기
  const fetchNowPlaying = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=ko-KR&page=1`
      );
      if (!res.ok) throw new Error('TMDB now_playing fetch failed');
      const data = await res.json();
      setMovies((data.results || []).slice(0, 24)); // 4열×6줄
    } catch (e) {
      console.error(e);
      setError('영화 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // TMDB 영화 검색
  const handleSearch = async () => {
    const q = query.trim();

    // 검색어 없으면 다시 현재 상영작
    if (!q) {
      fetchNowPlaying();
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=ko-KR&query=${encodeURIComponent(
          q
        )}&page=1&include_adult=false`
      );
      if (!res.ok) throw new Error('TMDB search fetch failed');
      const data = await res.json();
      setMovies((data.results || []).slice(0, 24));
    } catch (e) {
      console.error(e);
      setError('검색 결과를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 첫 진입 시 현재 상영작
  useEffect(() => {
    fetchNowPlaying();
  }, []);

  // 찜 토글 기능 (MockAPI에 favorite_movies 저장 시켜둠) 이미 있으면 제거 없으면 추가
 const handleToggleFavorite = async (movieId) => {
  if (!currentUser?.id) {
    alert('로그인 후 찜 기능을 사용할 수 있습니다.');
    return;
  }

  const prev = Array.isArray(currentUser.favorite_movies)
    ? currentUser.favorite_movies
    : [];

  const already = prev.includes(movieId);
  const next = already ? prev.filter((id) => id !== movieId) : [...prev, movieId];

  try {
    // 
    const payload = {
      email_name: currentUser.email_name,
      password: currentUser.password,
      key: currentUser.key,
      favorite_movies: next,
      watched_movies: Array.isArray(currentUser.watched_movies) ? currentUser.watched_movies : [],
    };

    const res = await fetch(`${MOCK_API_URL}/${currentUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('MockAPI PUT failed');
    
    const updatedUser = await res.json();
    setCurrentUser?.(updatedUser);
    console.log("PUT 성공 updatedUser:", updatedUser);

    if (!already) {
        const movieInfoPayload = {
          userKey: currentUser.key,  // 유저 식별 키
          movieID: movieId,          // 영화 ID
          // 아래는 초기값 설정
          totalRate: 0,
          scenarioRate: 0,
          directionRate: 0,
          musicRate: 0,
          review: '',
          rcmRate: 0,
          listCategory: 'toWatch'
        };

        const infoRes = await fetch(MOCK_MOVIE_INFO_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movieInfoPayload),
        });

        if (infoRes.ok) {
           console.log("MovieInfo created for movie:", movieId);
        } else {
           console.warn("Failed to create MovieInfo data");
        }
      }

    if (!already) alert('To watch list에 추가되었습니다!');
} catch (e) {
    console.error(e);
    alert('To watch list 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
};

  const handleToggleWatched = async (movieId) => {
    if (!currentUser?.id) {
      alert('로그인 후 시청함 기능을 사용할 수 있습니다.');
      return;
    }

    const prev = Array.isArray(currentUser.watched_movies)
      ? currentUser.watched_movies
      : [];

    const already = prev.includes(movieId);
    const next = already ? prev.filter((id) => id !== movieId) : [...prev, movieId];

    try {
      const payload = {
        email_name: currentUser.email_name,
        password: currentUser.password,
        key: currentUser.key,
        favorite_movies: Array.isArray(currentUser.favorite_movies) ? currentUser.favorite_movies : [],
        watched_movies: next,
      };

      const res = await fetch(`${MOCK_API_URL}/${currentUser.id}`, {
        method: 'PUT', // PATCH로 하니까 막히드라 이거 MOCKAPI가 막아뒀나바
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('MockAPI PUT failed');

      const updatedUser = await res.json();
      setCurrentUser?.(updatedUser);
      console.log("PUT 성공 updatedUser:", updatedUser);

      if (!already) {
        const movieInfoPayload = {
          userKey: currentUser.key,  // 유저 식별 키
          movieID: movieId,          // 영화 ID
          // 아래는 초기값 설정
          totalRate: 0,
          scenarioRate: 0,
          directionRate: 0,
          musicRate: 0,
          review: '',
          rcmRate: 0,
          listCategory: 'watched'
        };

        const infoRes = await fetch(MOCK_MOVIE_INFO_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movieInfoPayload),
        });

        if (infoRes.ok) {
           console.log("MovieInfo created for movie:", movieId);
        } else {
           console.warn("Failed to create MovieInfo data");
        }
      }

      if (!already) alert('Watched list에 추가되었습니다!');
    } catch (e) {
      console.error(e);
      alert('Watched list 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
        {/* 상단 헤더 (반응형: 작은 화면에서는 버튼이 아래로 내려감) */}
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

            </Container>
          </Navbar>
        </div>


        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
            

            {/* 검색바 */}
            <div className="d-flex w-100 w-md-50" style={{ maxWidth: '1580px' }}>
              <input
                type="text"
                className="form-control me-2"
                placeholder="영화 제목을 검색해보세요..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn btn-outline-dark btn-lg" onClick={handleSearch}>
                search
              </button>
            </div>
          </div>
        </div>


        {/* 로딩/에러 표시 */}
        {loading && <div className="alert alert-secondary">불러오는 중...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* 영화 리스트(작은 화면 2줄로 바꿔두긴 했는데 불편하면 말해주십쇼) */}
        <h3 className="fw-bold mb-3">🔥 현재 상영작</h3>
        <div className="row row-cols-2 row-cols-md-4 g-4 mb-5">
          {movies.map((movie) => {
            const posterSrc = movie.poster_path
              ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
              : `https://via.placeholder.com/300x450?text=No+Poster`;

            // 현재 영화가 찜 목록에 있는지 확인
            const isFav = favoriteIds.includes(movie.id);

            // 현재 영화가 시청함 목록에 있는지 확인
            const isWatched = watchedIds.includes(movie.id);

            return (
              <div className="col" key={movie.id}>
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={posterSrc}
                    className="card-img-top"
                    alt={movie.title}
                    loading="lazy"
                  />
                  <div className="card-body">
                    <h6 className="card-title fw-bold mb-1">{movie.title}</h6>
                    <p className="card-text text-muted small mb-2">
                      {movie.release_date ? `${movie.release_date} 개봉` : '개봉일 정보 없음'}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-warning fw-bold">
                        ★ {typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : '-'}
                      </span>

                      {/*버튼 2개(찜 / 시청함) */}
                      <div className="d-flex gap-2">
                        <button
                          className={`btn btn-sm ${isFav ? 'btn-outline-danger' : 'btn-outline-danger'}`}
                          style={{ fontSize: '0.7rem' }}
                          onClick={() => handleToggleFavorite(movie.id)}
                        >
                          {isFav ? 'To Watch ✓' : 'To Watch'}
                        </button>

                        <button
                          className={`btn btn-sm ${isWatched ? 'btn-outline-success' : 'btn-outline-success'}`}
                          style={{ fontSize: '0.7rem' }}
                          onClick={() => handleToggleWatched(movie.id)}
                        >
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
      {/* footer */}
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

export default MainPage;
