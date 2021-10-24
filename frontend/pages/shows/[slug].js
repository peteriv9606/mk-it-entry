import Head from 'next/head'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/main/layout";
import styles from '../../styles/singleShow.module.scss'
import Show from '../../components/show';
import { fetchWithToken, getUser } from '../../components/main/auth';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';

export async function getServerSideProps(context) {
  const ssr_show = await fetch(process.env.apiUrl + `shows/${context.query.slug}`).then(res => res.json())

  return {
    props: {
      ssr_show
    }
  }
}

export default function SingleShow({ ssr_show }) {
  const router = useRouter()
  const [data, setData] = useState(ssr_show)
  const [user, setUser] = useState()

  useEffect(async () => {
    setUser(await getUser())
  }, [])

  const err_style = {
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'inherit',
    fontWeight: '700'

  }
  return (
    <Layout>
      <Head>
        <title>{`M-Lib.${data.status !== 404 ? (" | " + data.name) : ""}`}</title>
      </Head>
      <div className={styles.Wrapper}>
        <div className={"Shell"}>
          <div className={styles.Inner}>

            {
              data.status !== 404 ?
                <Show
                  show={data}
                  user={user}
                  setUser={setUser}
                />
                : <h1 style={err_style} >
                  Request to match show: '{router.query.slug}' returned status of {data.status} - Not found
                </h1>
            }
          </div>
        </div>
      </div>
    </Layout>
  )
}