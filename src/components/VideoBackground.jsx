import React from "react"

const VideoBackground = () => {
  return (
    <div className="video-container">
      <video autoPlay loop muted>
        <source src="/landing/inicio.mp4" type="video/mp4" />
        Tu navegador no soporta la etiqueta de video.
      </video>
      <div className="content">{/* Aquí puedes agregar tu contenido */}</div>
      <style jsx>{`
        .video-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .video-container video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .content {
          /* Estilos para el contenido */
        }
      `}</style>
    </div>
  )
}

export default VideoBackground
