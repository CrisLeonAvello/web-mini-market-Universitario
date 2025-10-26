import React from 'react';
import './components.css';

const actividades = [
  {
    id: 'FS-93',
    titulo: 'Sistema escale horizontalmente agregando servidores según demanda',
  },
  {
    id: 'FS-94',
    titulo: 'La base de datos soporte crecimiento de volumen sin degradación de performance',
  },
  {
    id: 'FS-95',
    titulo: 'El sistema maneje picos de carga durante temporadas altas de exportación',
  },
  {
    id: 'FS-96',
    titulo: 'Arquitectura soporte múltiples regiones geográficas',
  },
  {
    id: 'FS-97',
    titulo: 'Sistema se adapte automáticamente a cambios en la demanda',
  },
  {
    id: 'FS-98',
    titulo: 'Nuevas funcionalidades se integren sin afectar componentes existentes',
  },
  {
    id: 'FS-99',
    titulo: 'El sistema mantenga alta disponibilidad durante operaciones de escalamiento',
  },
];

export default function EscalabilidadDashboard() {
  return (
    <div className="escalabilidad-dashboard">
      <h2>Seguimiento Escalabilidad del Sistema</h2>
      <ul>
        {actividades.map((act) => (
          <li key={act.id}>
            <strong>{act.id}</strong>: {act.titulo}
          </li>
        ))}
      </ul>
    </div>
  );
}
