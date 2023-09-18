import { useState, useContext, useEffect } from "react"
import { UserContext } from "../../context/usuarioContext"
import Headers from "../../components/Headers"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import Loader from "../../components/Loader"

export default function Login() {
  const router = useRouter()
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const { setIsLogged } = useContext(UserContext)
  const [loading, setLoading] = useState(false)

  // SI EL USUARIO Y LA CONTRASEÑA COINCIDEN, ALMACENA LOS DATOS DEL USUARIO DE LOCAL STORAGE E INICIA SESION
  const logIn = async () => {
    setLoading(true)
    const response = await fetch(
      `fitlaif-back-production.up.railway.app/usuarios/${usuario}/${password}`
    )
    switch (response.status) {
      case 200:
        const data = await response.json()
        setIsLogged(data.isLogged)
        const loggin = window.localStorage
        loggin.setItem("logged", data.isLogged)
        loggin.setItem("userName", data.usuario)
        setLoading(false)
        window.location.href = "/"
        break
      case 409:
        setLoading(false)
        toast.error("El usuario o la contraseña son incorrectos")
        break
      case 500:
        setLoading(false)
        toast.error(
          "Ha habido un error inesperado, ponte en contacto con un administrador"
        )
    }
  }

  const irARegistro = () => {
    const account = window.localStorage
    account.setItem("account", false)
    window.location.href = "/registro"
  }

  useEffect(() => {
    const logged = window.localStorage.getItem("logged")
    if (logged) {
      router.push("/")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // RENDERIZADO NORMAL ----->
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Headers
        title="Login"
        description="Portal de inicio de sesion de la web de FitLaif"
      />
      {!loading ? (
        <div className="max-w-md w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-semibold mb-6 text-white text-center">
              Iniciar sesión
            </h2>
            <div className="mb-4">
              <label
                htmlFor="usuario"
                className="block text-white text-sm mb-2"
              >
                Usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full bg-gray-200 rounded-md py-2 px-3 text-gray-800 text-xs"
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="contraseña"
                className="block text-white text-sm mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-200 rounded-md py-2 px-3 text-gray-800 text-xs"
                />
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={logIn}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Entrar
              </button>
            </div>
            <div className="text-center">
              <p className="text-white text-base text-center font-bold">
                ¿No tienes cuenta?
              </p>
              <button
                onClick={irARegistro}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Regístrate
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  )
}
