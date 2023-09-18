import Head from "next/head"
export default function Headers({ title, description }) {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="descripcion" content={description}></meta>
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta>
      </Head>
    </div>
  )
}
Headers.defaultProps = {
  title: "Titutlo",
  description: "Descripcion",
}
