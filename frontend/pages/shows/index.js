import Head from 'next/head'
import Layout from '../../components/main/layout';
import styles from '../../styles/shows.module.scss'
import { useEffect, useState } from 'react';
import { merge } from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import useDebounce from '../../components/main/useDebounce'
import Show from '../../components/show';
import { getUser } from '../../components/main/auth';

export async function getServerSideProps(context) {
  const ssr_shows = await fetch(process.env.apiUrl + `shows?page=0`).then(res => res.json())
  
  return {
    props: {
      ssr_shows
    }
  }
}


export default function Shows({ ssr_shows }) {
  const [shows, setShows] = useState(ssr_shows)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [user, setUser] = useState()
  const debouncedSearch = useDebounce(searchTerm, 500)

  const fetchData = async () => {
    const more = await fetch(process.env.apiUrl + `shows?page=${currentPage + 1}`)
      .then(res => res.json())
    setShows(shows.concat(more))
    setCurrentPage(currentPage + 1)
  }

  useEffect(async () => {
    if (debouncedSearch) {
      var search_results = []
      const resp = await fetch(process.env.apiUrl + `shows/search/${searchTerm}`)
        .then(res => res.json())
        .catch(err => console.error(err))
      search_results = resp.length !== 0 ?
        merge(search_results, resp.map(res => res.show))
        : []

      setShows(search_results)
      setHasMore(false)
    } else {
      // no search term.. fetch normal data
      setShows(await fetch(process.env.apiUrl + `shows?page=0`).then(res => res.json()))
      setHasMore(true)
    }
    setCurrentPage(0)
  }, [debouncedSearch])

  useEffect(async () => {
    setUser(await getUser())
  }, [])

  return (
    <Layout>
      <Head>
        <title>M-Lib. | Shows</title>
      </Head>

      <div className={styles.Wrapper}>
        <div className={"Shell"}>
          <div className={styles.Inner}>
            <h1>Shows</h1>
            <input
              type={'text'}
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder={'Search by title'}
            />
            <div className={styles.InfiniteScroll}>
              {shows != undefined ?
                <InfiniteScroll
                  dataLength={shows.length}
                  next={fetchData}
                  hasMore={hasMore}
                  loader={<h4>Loading...</h4>}
                  endMessage={
                    <p style={{ textAlign: 'center' }}>
                      <b>---END---</b>
                    </p>
                  }
                >
                  {
                    shows?.map((show, index) =>
                      <Show
                      key={index}
                      show={show}
                      user={user}
                      setUser={setUser}
                      />
                    )
                  }
                </InfiniteScroll>
                : "LOADING"}
            </div>
          </div>
        </div>
      </div>

    </Layout>
  )
}