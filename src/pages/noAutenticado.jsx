export default function NoAutenticado() {
  const irALogin = () => {
    window.location.href = "/login"
  }
  return (
    <div className="text-center">
      <h1>Debes estar logeado para ver esta sección</h1>
      <button onClick={irALogin}>Ir al inicio</button>
    </div>
  )
}
