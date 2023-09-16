import Head from "next/head"
export default function Headers({ title, description }) {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="descripcion" content={description}></meta>
      </Head>
    </div>
  )
}
Headers.defaultProps = {
  title: "Titutlo",
  description: "Descripcion",
}
