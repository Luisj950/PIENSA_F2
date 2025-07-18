// src/components/MascotaCard.tsx

// ✅ CAMBIO: Ahora esperamos un array de URLs para las imágenes
interface Mascota {
  id: number;
  nombre: string;
  especie?: string;
  raza?: string;
  imagenUrls?: string[]; 
}

interface MascotaCardProps {
  mascota: Mascota;
}

export const MascotaCard = ({ mascota }: MascotaCardProps) => {
  // Obtenemos la primera imagen de la lista para usarla como portada.
  const imagenPrincipal = mascota.imagenUrls && mascota.imagenUrls.length > 0
    ? mascota.imagenUrls[0]
    : null;

  return (
    <div className="mascota-card-horizontal"> {/* Se usará una nueva clase para el estilo horizontal */}
      <div className="mascota-card-imagen-horizontal">
        {imagenPrincipal ? (
          <img src={imagenPrincipal} alt={mascota.nombre} />
        ) : (
          <span>🐾</span>
        )}
      </div>
      <div className="mascota-card-info-horizontal">
        <h3>{mascota.nombre}</h3>
        <p>{mascota.especie} - {mascota.raza}</p>
      </div>
    </div>
  );
};