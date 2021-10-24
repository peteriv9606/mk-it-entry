import Head from "next/head";
import { useEffect, useState } from "react";
import Layout from "../../components/main/layout"
import styles from "../../styles/movies.module.scss"
import ReactPaginate from 'react-paginate'
import { merge } from "lodash";
import { useRouter } from "next/router";
import moment from 'moment'

export default function Movies() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(0)
  const [movies, setMovies] = useState()
  const [initRender, setInitRender] = useState(true)

  useEffect(async () => {
    setMovies(await fetch(process.env.apiUrl + 'shows/').then(res => res.json()))
  }, [])

  const handleChange = (e) => {
    let rq = router.query
    let selectedPage = ""
    let url = ''

    selectedPage = e.selected + 1
    selectedPage === 1 ? delete rq.page : rq = merge(rq, { 'page': selectedPage })


    Object.entries(rq).forEach(([key, value], index) => {
      url += index === 0 ? `?${key}=${value}` : `&${key}=${value}`
    })
    router.push(url, url, { shallow: true })
  }

  useEffect(async () => {
    let url=''

    if (!initRender) {
      Object.entries(router.query).forEach(([key, value], index) => {
        url += index === 0 ? `?${key}=${value}` : `&${key}=${value}`
      })
      setMovies(await fetch(process.env.apiUrl + `shows/${url}`).then(res => res.json()))
      setCurrentPage(router.query.page || 0)
      setTimeout(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
      }, 200);
    } else {
      setInitRender(false)
    }
  }, [router.query])


  return (
    <Layout>
      <Head>
        <title>M-Lib. | Movies</title>
      </Head>
      <div className={styles.Wrapper}>
        <div className={"Shell"}>
          <div className={styles.Inner}>
            <h1>Movies</h1>
            <div className={styles.Movies_wrapper}>
              {movies ?
                movies.results.map((movie, index) =>
                  <div className={styles.Movie} key={index}>
                    <div>
                      <img src={movie?.image?.medium}/>
                      <h1>{movie.name} | {moment(movie.premiered).format("YYYY")}</h1>
                      <p>{movie.genres.map((g, index)=>`${g}${movie.genres[index+1]?', ':''}`)}</p>
                    </div>
                    <div className={styles.Actions}>
                      <button>Add to Favourites</button>
                      <button>View official site</button>
                    </div>
                  </div>
                ) : "Loading..."
              }
            </div>
            <ReactPaginate
              pageCount={movies?.pages}
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handleChange}
              containerClassName={'pagination light'}
              activeClassName={'active'}
              forcePage={currentPage != 0 ? (currentPage - 1) : currentPage}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}