// Paso 2: Importa la imagen desde su ruta relativa dentro de 'src'
import portadaImg from '../image/portada.jpg'; // Ajusta la ruta si es necesario

const HomePage = () => {
  return (
    <div className="hero-section">
      
      {/* Columna Izquierda: Contenido de Texto */}
      <div className="hero-content">
        <h1>El Cuidado de tu Mascota, al Alcance de tu Mano</h1>
        <p>
          Gestiona el historial clínico, citas y tratamientos de tu mejor amigo 
          en un solo lugar. Una comunicación fluida y eficiente para su salud.
        </p>
      </div>

      {/* Columna Derecha: Imagen */}
      <div className="hero-image">
        <img 
          // Paso 3: Usa la variable importada entre llaves {}
          src={portadaImg} 
          alt="Mascota feliz siendo cuidada" 
        />
      </div>
    </div>
  );
};

export default HomePage;