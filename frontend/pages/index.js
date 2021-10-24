import Head from 'next/head'
import Layout from '../components/main/layout'
import Hero from '../blocks/heroBlock'
import Favourites from '../blocks/favouritesBlock'

export default function Index() {
  return (
    <Layout>
      <Head>
        <title>M-Lib. | Home</title>
      </Head>
      <Hero />
      <Favourites />
      
    </Layout>
  )
}
