import Head from "next/head";
import { useEffect, useState } from "react";
import Layout from "../components/main/layout"
import styles from "../styles/favourites.module.scss"
import ReactPaginate from 'react-paginate'
import { merge } from "lodash";
import { useRouter } from "next/router";
import { fetchWithToken, getUser } from "../components/main/auth";
import slugify from "react-slugify";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

export default function Favourites() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(0)
  const [favs, setFavs] = useState()

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
    let url = ''

    Object.entries(router.query).forEach(([key, value], index) => {
      url += index === 0 ? `?${key}=${value}` : `&${key}=${value}`
    })
    try {
      const resp = await fetchWithToken(process.env.apiUrl + `favourites/${jwtDecode(Cookies.get('access')).username}/paginate${url}`).then(res => res.json())
      setFavs(resp)
      setCurrentPage(router.query.page || 0)
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
    } catch (err) {
      console.error(err)
    }
  }, [router.query])


  return (
    <Layout>
      <Head>
        <title>M-Lib. | Favourites</title>
      </Head>
      <div className={styles.Wrapper}>
        <div className={"Shell"}>
          <div className={styles.Inner}>
            <h1>Your Favourites List</h1>
            <div className={styles.Favourites_wrapper}>
              {favs !== undefined ?
                favs.results.map((fav, index) =>
                  <div className={styles.Fav} key={index}>
                    <a
                      href={`/shows/${slugify((fav.name).replace(new RegExp(/\'|\./), ""))}`}
                    >
                      <img src={fav?.image?.medium} />
                    </a>
                  </div>
                )
                : "Loading"
              }
            </div>
            {
              favs && favs?.pages ?
                <ReactPaginate
                  pageCount={favs?.pages}
                  previousLabel={'<'}
                  nextLabel={'>'}
                  breakLabel={'...'}
                  breakClassName={'break-me'}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handleChange}
                  containerClassName={'pagination'}
                  activeClassName={'active'}
                  forcePage={currentPage != 0 ? (currentPage - 1) : currentPage}
                />
                : ""
            }

          </div>
        </div>
      </div>
    </Layout>
  )
}