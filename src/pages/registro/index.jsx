import { useState } from "react"
import Headers from "../../components/Headers"
import { toast } from "react-toastify"
export default function Registro() {
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")

  //SI EL USUARIO Y LA CONTRASEÑA COINCIDEN, ALMACENA LOS DATOS DEL USUARIO DE LOCAL STORAGE E INICIA SESION
  const register = async () => {
    const data = {
      usuario: usuario,
      password: password,
      isLogged: false,
    }
    const response = await fetch(`http://fitlaif-back-production.up.railway.app/usuarios/guardar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    switch (response.status) {
      case 200:
        toast.success("Usuario creado")
        window.location.href = "/login"
        break
      case 409:
        toast.error("El usuario ya existe")
        break
      case 500:
        toast.error(
          "Ha habido un error inesperado, ponte en contacto con un administrador"
        )
    }
  }

  const irALogin = () => {
    window.location.href = "/login"
  }

  //RENDERIZADO NORMAL ----->
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Headers
        title="Registro"
        description="Portal de registro de usuarios de la web de FitLaif"
      />
      <div className="max-w-md w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div className="px-6 py-8">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">
            ¡Regístrate!
          </h2>
          <div className="mb-4">
            <label htmlFor="usuario" className="block text-white text-sm mb-2">
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
              onClick={register}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Enviar
            </button>
          </div>
          <div className="text-center">
            <p className="text-white text-base text-center font-bold">
              ¿Ya tienes cuenta?
            </p>
            <button
              onClick={irALogin}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              ¡Accede!
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
