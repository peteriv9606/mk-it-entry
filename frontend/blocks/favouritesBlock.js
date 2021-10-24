import styles from '../styles/favouritesBlock.module.scss'
import { useEffect, useState } from 'react'
import { fetchWithToken, getUser } from '../components/main/auth'
import { Swiper, SwiperSlide } from 'swiper/react';
import slugify from 'react-slugify'

import 'swiper/css';

export default function FavouritesBlock() {

  const [favs, setFavs] = useState()
  const [user, setUser] = useState()
  const breakpoints = {                
   
    768: {
      slidesPerView: 4,
      spaceBetween: 30
    },
   
    1024: {
      slidesPerView: 5,
      spaceBetween: 20
    }
  }
  useEffect(async () => {
    try {
      const u = await getUser()
      const favs_data = await fetchWithToken(process.env.apiUrl + `favourites/${u.username}`).then(res => res.json())
      setUser(u)
      setFavs(favs_data)

    } catch (err) {
      setUser()
    }
  }, [])

  return (
    <section className={styles.Wrapper}>
      <div className={'Shell'}>

        <div className={styles.Inner}>
          <h1>Your Favourites</h1>
          {
            user ? (
              !favs?.length === 0 ?
                <div className={styles.No_favs}>
                  <p>Looks like you don't have any favourites yet!</p>
                  <p><a href={"/shows"}>Explore shows</a> and add them to your favourites' list.</p>
                </div>
                :
                <div className={styles.Fav_carousel}>
                  <p>Swipe through your collection - click for details</p>
                  <Swiper
                    spaceBetween={40}
                    slidesPerView={3}
                    loop={true}
                    breakpoints={breakpoints}
                  >
                    {
                      favs?.map((show) => <SwiperSlide key={show.id}>
                        <a href={`/shows/${slugify(show.name)}`} className={styles.Fav}>
                          <img src={show.image.medium} />
                        </a>
                      </SwiperSlide>)
                    }
                  </Swiper>
                  <p>Not seeing your favourite show?</p>
                  <p>Explore our <a href={'/shows'}>shows section</a> and expand your collection.</p>
                </div>
                
            ) : <div className={styles.Not_logged}>
              <p>You need to be <a href={'/login'}>logged in</a> in order to view or add shows to your favourites list</p>
            </div>
          }

        </div>
      </div>
    </section>
  )
}