import slugify from 'react-slugify'
import styles from '../styles/show.module.scss'
import moment from 'moment'
import { toast } from 'react-toastify'
import { fetchWithToken } from './main/auth'


export default function Show({ show, user, setUser, setNote, setRating, isSingle=true }) {

  const handleAddFav = async () => {
    if (user) {
      const resp = await fetchWithToken(process.env.apiUrl + `favourites/${user.username}`, {
        method: 'POST',
        body: JSON.stringify({ user_id: user._id, show_id: show.id })
      }).then(res => res.json())
      setUser(resp)
      toast.success(`Successfuly added ${show.name} to your favorites!`)
    }
    else {
      toast.error("Please, log in to add this show to your favorites!")
    }
  }
  const handleRmvFav = async () => {
    const resp = await fetchWithToken(process.env.apiUrl + `favourites/${user.username}`, {
      method: 'DELETE',
      body: JSON.stringify({ user_id: user._id, show_id: show.id })
    }).then(res => res.json())
    setUser(resp)
    setNote('')
    setRating(0)
    toast.success(`Successfuly removed '${show.name}' from your favorites!`)
  }

  return (
    <div className={styles.Show}>
      <a href={`${isSingle ? "" : "shows/"}${slugify((show.name).replace(new RegExp(/\'|\./),""))}`}><img src={show?.image?.medium} /></a>
      <div>
        <a href={`${isSingle ? "" : "shows/"}${slugify((show.name).replace(new RegExp(/\'|\./),""))}`}>{show.name} | {moment(show.premiered).format("YYYY")}{show.ended ? `- ${moment(show.ended).format("YYYY")}` : ""}</a>
        <p>[{show.genres.map((g, index) => `${g}${show.genres[index + 1] ? ', ' : ''}`)}] | Average episode runtime: {show.averageRuntime} mins.</p>
        <span dangerouslySetInnerHTML={{ __html: show.summary }} />
        <div>
          <a href={show.url} target={'_blank'}>View official site</a>
          {
            !user ?
              /* not logged in */
              <button
                className={styles.Add}
                onClick={handleAddFav}
              >Add to Favorites
              </button>

              :
              /* logged in.. check if show is in favs */
              user && user?.fav_shows.filter(el=>el.show_id === show.id).length !== 0 ?
                <button
                  className={styles.Rmv}
                  onClick={() => handleRmvFav(show)}
                >Remove from Favorites
                </button>
                :
                <button
                  className={styles.Add}
                  onClick={handleAddFav}
                >Add to Favorites
                </button>
          }
        </div>
      </div>
    </div>
  )
}