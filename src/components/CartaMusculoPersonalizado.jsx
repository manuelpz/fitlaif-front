import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/router"
import Confetti from "react-confetti"
import ReactModal from "react-modal"
import estilos from "../components/Modal.module.css"
import { guardarEjercicioPersonalizado } from "../funciones/guardarEjercicio"
import { toast } from "react-toastify"

export default function CartaMusculo({ ejerciciosElegidos }) {
  const [usuario, setUsuario] = useState()
  const [ultimoPr, setUltimoPr] = useState()
  const [nuevoPr, setNuevoPr] = useState(false)
  const [visibleDiv, setVisibleDiv] = useState(0)
  const [completado, setCompletado] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [abreRegistro, setAbreRegistro] = useState(false)
  const [repeticiones1, setRepeticiones1] = useState("")
  const [repeticiones2, setRepeticiones2] = useState("")
  const [repeticiones3, setRepeticiones3] = useState("")
  const [repeticiones4, setRepeticiones4] = useState("")
  const [nuevoRegistro, setNuevoRegistro] = useState(false)
  const [abreMarcasAnteriores, setAbreMarcasAnteriores] = useState(false)
  const [abreUltimasMarcas, setAbreUltimasMarcas] = useState(false)
  const [peso1, setPeso1] = useState("")
  const [peso2, setPeso2] = useState("")
  const [peso3, setPeso3] = useState("")
  const [peso4, setPeso4] = useState("")
  const [ultimasMarcas, setUltimasMarcas] = useState([])
  const touchStartRef = useRef(null)
  const router = useRouter()
  const series = ["1", "2", "3", "4"]

  const irAEntrenamientos = () => {
    router.push("/entrenamientos")
  }

  //MANJEAR EL TOQUE DE MOVIL (ARRASTRAR DEDO)
  const handleTouchStart = (event) => {
    touchStartRef.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    }
  }

  const handleTouchEnd = (event) => {
    const touchEnd = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    }

    const touchDiffX = touchStartRef.current.x - touchEnd.x
    const touchDiffY = touchStartRef.current.y - touchEnd.y

    if (Math.abs(touchDiffX) > Math.abs(touchDiffY)) {
      // Movimiento horizontal
      if (touchDiffX > 0) {
        // Deslizamiento hacia la izquierda
        handleClickDerecha()
      } else if (touchDiffX < 0) {
        // Deslizamiento hacia la derecha
        handleClickIzquierda()
      }
    }
  }

  //MANJEA QUE SE VEA EL SIGUIENTE EJERCICIO
  const handleClickDerecha = () => {
    setVisibleDiv(
      (prevVisibleDiv) => (prevVisibleDiv + 1) % ejerciciosElegidos.length
    )
  }

  //MANJEA QUE SE VEA EL EJERCICIO ANTERIOR
  const handleClickIzquierda = () => {
    if (visibleDiv === 0) {
      setVisibleDiv(ejerciciosElegidos.length - 1)
    } else {
      setVisibleDiv(
        (prevVisibleDiv) => (prevVisibleDiv - 1) % ejerciciosElegidos.length
      )
    }
  }

  //CLICK A COMPLETADO. AÑADE UN ELEMENTO A UN ARRAY DE EJERCICIOS COMPLETADO
  const agregarElemento = () => {
    const nuevoElemento = ejerciciosElegidos[visibleDiv]
    setCompletado([...completado, nuevoElemento])
    setAbreMarcasAnteriores(false)
  }

  //FUNCION QUE TACHA EL EJERCICIO (DEVUELVE CSS)
  const completarCarta = () => {
    if (completado.includes(ejerciciosElegidos[visibleDiv])) {
      return "line-through"
    }
  }

  //AÑADE EL EJERCICIO A LA LISTA DE COMPLETADOS
  const estaCompletado = () => {
    if (completado.includes(ejerciciosElegidos[visibleDiv])) {
      return true
    }
  }

  //GUARDA LOS REGISTROS DEL EJERCICIO EN BASE DE DATOS
  const actualizaRegistro = () => {
    guardarEjercicioPersonalizado(
      ejerciciosElegidos[visibleDiv].ejercicio,
      series,
      [repeticiones1, repeticiones2, repeticiones3, repeticiones4],
      [peso1, peso2, peso3, peso4],
      usuario.usuario,
      1
    )
    setAbreRegistro(false)
    toast.success("Marcas registradas 🏋🏻‍♀️")
    setNuevoRegistro(true)
    fetchUltimoPr()
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUltimoPr = async () => {
    const response = await fetch(
      `http://13.38.93.125:8080/ejerciciosPersonalizados/seriesRepeticiones/${ejerciciosElegidos[visibleDiv].ejercicio}`
    )
    if (response.ok) {
      const data = await response.json()
      setUltimasMarcas(data.seriesRepes)
      setUltimoPr(data.pr)
      if (ultimoPr < data.pr) {
        setNuevoPr(true)
      }
    } else setUltimoPr(0)
  }


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://13.38.93.125:8080/usuarios/${window.localStorage.getItem(
          "userName"
        )}`
      )
      const data = await response.json()
      setUsuario(data)
    }
    if (window.localStorage.getItem("userName") !== undefined) {
      fetchData()
    }
    fetchUltimoPr()
    if (nuevoRegistro) {
      fetchUltimoPr()
      setNuevoRegistro(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleDiv, nuevoRegistro])

  //RENDERIZADO NORMAL
  return (
    <div className="container mx-auto">
      {ejerciciosElegidos.map((e, index) => (
        <div
          key={e.ejercicioId}
          className={`justify-center flex ${index === visibleDiv ? "z-10" : "hidden"
            }`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 justify-self-center h-100 w-80 absolute">
            <div
              className={`text-gray-900 font-bold text-xl mb-2 text-center ${completarCarta()}`}
            >
              {e.ejercicio.toUpperCase()}
            </div>
            {e.img ? (
              <div className="grid justify-items-center !w-72 !h-48">
                <Image
                  className="w-full h-full"
                  src={e.img}
                  width={300}
                  height={300}
                  alt="Imagen explicativa del ejercicio"
                />
              </div>
            ) : (
              ""
            )}
            <div className="grid justify-items-center">
              <p className="text-gray-700 text-center">{e.descripcion}</p>
              <p>
                <b>Record personal</b> <i>(PR)</i> :{" "}
                <b>{ultimoPr ? ultimoPr + ` kg` : "Todavía sin registrar"} </b>
              </p>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-fulld"
                onClick={() => setAbreUltimasMarcas(true)}
              >
                Últimas marcas
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-fulld"
                onClick={() => setAbreRegistro(true)}
              >
                Añadir registros
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-fulld"
                onClick={() => setAbreMarcasAnteriores(true)}
                disabled={estaCompletado()}
              >
                Completado!
              </button>
            </div>
            <div className="grid grid-cols-3 justify-items-center">
              <Image
                src="/iconos/flecha-izquierda.png"
                width={50}
                height={50}
                alt="flecha hacia la izquierda"
                onClick={handleClickIzquierda}
              />
              <p className="text-gray-700 text-base text-center font-bold">
                {index + 1}/{ejerciciosElegidos.length}
              </p>
              <Image
                src="/iconos/flecha-derecha.png"
                width={50}
                height={50}
                alt="flecha hacia la derecha"
                onClick={handleClickDerecha}
              />
            </div>
          </div>
        </div>
      ))}

      {/* RENDERIZADO DEL CONFETI CUANDO SE COMPLETAN TODOS LOS EJERCICIOS */}
      {completado.length === ejerciciosElegidos.length && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
      {completado.length === ejerciciosElegidos.length && (
        <ReactModal
          ariaHideApp={false}
          className={estilos.customModal}
          isOpen={isModalOpen}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
            content: {
              width: "250px",
              height: "200px",
              margin: "auto",
            },
          }}
        >
          <h3 className={`${estilos.entreno} text-center`}>
            ¡ENHORABUENA! Has completado el entrenamiento de hoy
          </h3>
          <div className="grid grid-cols-2 gap-4 content-center">
            <button
              type="button"
              className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={irAEntrenamientos}
            >
              Volver
            </button>
            <button
              type="button"
              className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={() => setIsModalOpen(false)}
            >
              Quedarme aquí
            </button>
          </div>
        </ReactModal>
      )}

      {/* RENDERIZADO DEL MODAL PARA AÑADIR NUEVOS REGISTROS */}
      {abreRegistro && (
        <ReactModal
          ariaHideApp={false}
          className={estilos.customModal}
          isOpen={isModalOpen}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
            content: {
              width: "500px",
              height: "400px",
              margin: "auto",
            },
          }}
        >
          <h3 className={`${estilos.entreno} text-center`}>
            Añade tus registros
          </h3>
          <br />
          <div className="grid grid-cols-3 gap-4 content-center">
            <p className="font-bold">Primera serie: </p>{" "}
            <input
              onChange={(e) => setRepeticiones1(e.target.value)}
              type="text"
              placeholder="Repeticiones"
            ></input>{" "}
            <input
              onChange={(e) => setPeso1(e.target.value)}
              type="text"
              placeholder="Peso"
            ></input>
          </div>
          <div className="grid grid-cols-3 gap-4 content-center">
            <p className="font-bold">Segunda serie: </p>{" "}
            <input
              onChange={(e) => setRepeticiones2(e.target.value)}
              type="text"
              placeholder="Repeticiones"
            ></input>{" "}
            <input
              onChange={(e) => setPeso2(e.target.value)}
              type="text"
              placeholder="Peso"
            ></input>
          </div>
          <div className="grid grid-cols-3 gap-4 content-center">
            <p className="font-bold">Tercera serie: </p>{" "}
            <input
              onChange={(e) => setRepeticiones3(e.target.value)}
              type="text"
              placeholder="Repeticiones"
            ></input>{" "}
            <input
              onChange={(e) => setPeso3(e.target.value)}
              type="text"
              placeholder="Peso"
            ></input>
          </div>
          <div className="grid grid-cols-3 gap-4 content-center">
            <p className="font-bold">Última serie: </p>{" "}
            <input
              onChange={(e) => setRepeticiones4(e.target.value)}
              type="text"
              placeholder="Repeticiones"
            ></input>{" "}
            <input
              onChange={(e) => setPeso4(e.target.value)}
              type="text"
              placeholder="Peso"
            ></input>
          </div>
          <br />
          <div className="grid grid-cols-2 gap-4 content-center">
            <button
              type="button"
              className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={() => actualizaRegistro()}
            >
              Guardar
            </button>
            <button
              type="button"
              className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={() => setAbreRegistro(false)}
            >
              Cancelar
            </button>
          </div>
        </ReactModal>
      )}

      {/* RENDERIZADO DEL MODAL PARA PREGUNTAR SI SEGURO SE HA FINALIZADO EL EJERCICIO */}
      {
        abreMarcasAnteriores && (
          <ReactModal
            ariaHideApp={false}
            className={estilos.customModal}
            isOpen={isModalOpen}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
              content: {
                width: "300px",
                height: "150px",
                margin: "auto",
              },
            }}
          >
            <h3 className={`${estilos.entreno} text-center`}>
              ¿Seguro que quieres finalizar este ejercicio?
            </h3>
            <div className="grid grid-cols-2 gap-4 content-center">
              <button
                type="button"
                className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={() => agregarElemento()}
              >
                SI
              </button>
              <button
                type="button"
                className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={() => setAbreMarcasAnteriores(false)}
              >
                NO
              </button>
            </div>
          </ReactModal>
        )
      }

      {/* RENDERIZADO DE PARA OBTENER LAS ULTIMAS MARCAS */}
      {
        abreUltimasMarcas && ultimasMarcas !== null && (
          <ReactModal
            ariaHideApp={false}
            className={estilos.customModal}
            isOpen={isModalOpen}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
              content: {
                width: "350px",
                height: "400px",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              },
            }}
          >
            <h3 className={`${estilos.entreno} text-center`}>
              ÚLTIMAS MARCAS
            </h3>
            <div className="overflow-x-auto">
              <table className="table-auto mx-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-center">Serie</th>
                    <th className="px-4 py-2 text-center" >Repeticiones</th>
                    <th className="px-4 py-2 text-center">Peso (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimasMarcas.map((e, index) => (
                    //comprobar nulo
                    e.peso || e.repeticiones !== null ?
                      <tr className="even:bg-gray-100" key={index}>
                        <td className="border px-4 py-2 text-center">{e.series}</td>
                        <td className="border px-4 py-2 text-center">{e.repeticiones}</td>
                        <td className="border px-4 py-2 text-center">{e.peso} kg</td>
                      </tr>
                      : ''))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={() => setAbreUltimasMarcas(false)}
              >
                Cerrar
              </button>
            </div>
          </ReactModal>
        )
      }
      {/* RENDERIZADO AUN NO HAY ULTIMAS MARCAS REGISTRADAS */}
      {
        abreUltimasMarcas && ultimasMarcas === null && (
          <ReactModal
            ariaHideApp={false}
            className={estilos.customModal}
            isOpen={isModalOpen}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
              content: {
                width: "250px",
                height: "200px",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              },
            }}
          >
            <h3 className={`${estilos.entreno} text-center`}>
              ❌ ¡ERROR! ❌ <br /> NO HAY REGISTROS TODAVIA
            </h3>
            <div className="overflow-x-auto">
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={() => setAbreUltimasMarcas(false)}
              >
                Cerrar
              </button>
            </div>
          </ReactModal>
        )
      }
      {/* RENDERIZADO DE ENHORABUENA POR NUEVO PR */}
      {
        nuevoPr && (
          <ReactModal
            ariaHideApp={false}
            className={estilos.customModal}
            isOpen={isModalOpen}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
              content: {
                width: "350px",
                height: "400px",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              },
            }}
          >
            <h3 className={`${estilos.entreno} text-center`}>
              ¡NUEVO RECORD PERSONAL <i>(PR)</i> ALCANZADO! 🎉🎊<br /> <br /> Bienvenido a los {ultimoPr} kg 🏋🏻
            </h3>
            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={() => setNuevoPr(false)}
              >
                Cerrar
              </button>
            </div>
          </ReactModal>
        )
      }
    </div>
  )
}
