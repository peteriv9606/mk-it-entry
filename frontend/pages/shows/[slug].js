import Head from 'next/head'
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Layout from "../../components/main/layout"
import styles from '../../styles/singleShow.module.scss'
import Show from '../../components/show'
import { fetchWithToken, getUser } from '../../components/main/auth'
import { Rating } from 'react-simple-star-rating'
import { toast } from 'react-toastify'
import useDebounce from '../../components/main/useDebounce'

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
  const [rating, setRating] = useState()
  const [note, setNote] = useState()
  const noteDebounced = useDebounce(note, 1000)

  useEffect(async () => {
    const u = await getUser()
    if(u && !u.message?.includes("credentials")){
      setUser(u)
    }
  }, [])

  useEffect(() => {
    if(user){
      let fav_show = user?.fav_shows?.filter((fav) => fav.show_id == data?.id)[0]
      if (fav_show) { 
        setRating(fav_show.rating)
        setNote(fav_show.note)
      }
    }
  }, [user])

  const err_style = {
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'inherit',
    fontWeight: '700'
  }

  const handleRating = async (value) => {
    if(user){
      const resp = await fetchWithToken(process.env.apiUrl + `favourites/${user.username}/rate`, {
        method: "POST",
      body: JSON.stringify({ show_id: data.id, rating: value })
    }).then(res => res.json())
    resp?.message ? toast.error(resp.message)
    : (toast.success(
      value !== 0 ?
      `Successfully gave ${data.name} a rating of ${value}!`
      : `Successfully cleared ${data.name}'s rating!`
      ), setRating(value))
    }else{
      toast.error("Please log in to rate")
    }
  }

  useEffect(() => {
    if(noteDebounced !== undefined){
      handleNote()
    }
  }, [noteDebounced])

  const handleNote = async () => {
    const fav_show = user?.fav_shows?.filter((fav) => fav.show_id == data?.id)[0]
      if(fav_show && fav_show.note !== note){
        const resp = await fetchWithToken(process.env.apiUrl + `favourites/${user.username}/note`, {
          method: "POST",
          body: JSON.stringify({ show_id: data.id, note: note })
        }).then(res => res.json())
        resp?.message ? toast.error(resp.message)
        : (toast.success('Changes made to note were successfully saved!'), setUser(resp))
      }
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
                <>
                  <Show
                    show={data}
                    user={user}
                    setUser={setUser}
                    setNote={setNote}
                    setRating={setRating}
                    isSingle={true}
                  />
                  <h1>Your Review</h1>
                  <div className={styles.Rating_wrapper}>
                    <Rating
                      stars={5}
                      size={30}
                      ratingValue={rating}
                      onClick={handleRating}
                    />
                    <button 
                     onClick={() => handleRating(0)}
                     disabled={ !user && !user?.fav_shows?.filter((fav) => fav.show_id == data?.id)[0]}
                     >Clear rating</button>
                  </div>
                  <div className={styles.Note_wrapper}>
                    <textarea 
                    onChange={(e)=>setNote(e.target.value)} 
                    value={note} 
                    placeholder={"Your private notes and comments about the movie..."} 
                    disabled={ !user && !user?.fav_shows?.filter((fav) => fav.show_id == data?.id)[0]}
                    />
                  </div>
                </>
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
