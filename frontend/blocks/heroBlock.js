import bg from '../public/movie_bg.png'
import styles from '../styles/heroBlock.module.scss'

export default function Hero() {

  return (
    <section className={styles.Wrapper}>
      <img className={styles.Background} src={bg.src} />
      <a href='https://pngtree.com/free-backgrounds' target={'_blank'}>free background photos from pngtree.com/</a>
      <div className={'Shell'}>
        <div className={styles.Background_overlay}>
          <div>
            <h1>Welcome to your personal Movie Library</h1>
            <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio fuga ut quibusdam magni iste praesentium expedita adipisci consectetur, quasi, minus nulla! Et, laboriosam libero excepturi exercitationem id nulla sequi expedita.</h2>
          </div>
          <a href={'/shows'} className={"Button"}>Explore shows</a>
        </div>
      </div>
    </section>
  )
}