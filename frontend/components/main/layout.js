import Head from 'next/head'
import React from 'react'
import Header from "./header"
import Footer from './footer'
import styles from '../../styles/layout.module.scss'
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Layout extends React.Component {
  render () {
    return (
      <div className={styles.Layout}>
        <Head>
          <title>M-Lib | My page</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <main>{this.props.children}</main>
        <Footer />
        <ToastContainer
          limit={3}
          position="top-center"
          autoClose={2500}
          hideProgressBar={true}
          newestOnTop={false}
          rtl={false}
          transition={Flip}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    )
  }
}
