import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vsmrhtqzjugswbndckbb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzbXJodHF6anVnc3dibmRja2JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyODU1MjUsImV4cCI6MjA1OTg2MTUyNX0.alD-tDVx86XkShnfAm4Yw9g2pcRWYGWMMf_ONWY9T4g";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function IDGenerator() {
  const [pais, setPais] = useState("A");
  const [actividad, setActividad] = useState("1");
  const [perfil, setPerfil] = useState("1");
  const [correlativo, setCorrelativo] = useState("001");
  const [ids, setIds] = useState([]);

  const paises = [
    { codigo: "A", nombre: "Argentina" },
    { codigo: "P", nombre: "Perú" },
  ];

  const actividades = [
    { codigo: "1", nombre: "Entrevistas" },
    { codigo: "2", nombre: "Grupos focales" },
    { codigo: "3", nombre: "Observaciones" },
    { codigo: "4", nombre: "Talleres de co-diseño de tecnología" },
    { codigo: "5", nombre: "Talleres de co-diseño del rol de ACS" },
    { codigo: "6", nombre: "Talleres de co-diseño de grupos comunitarios" },
    { codigo: "7", nombre: "Talleres de testeo de usabilidad" },
  ];

  const perfiles = [
    { codigo: "1", nombre: "Autoridades y otros actores clave" },
    { codigo: "2", nombre: "Pacientes" },
    { codigo: "3", nombre: "Agentes comunitarios de salud" },
    { codigo: "4", nombre: "Trabajadores de salud" },
    { codigo: "5", nombre: "Líderes comunitarios" },
  ];

  const generatedId = \`\${pais}-\${actividad}-\${perfil}-\${correlativo}\`;

  const loadIds = async () => {
    const { data, error } = await supabase.from("ids_colma").select("*").order("timestamp", { ascending: false });
    if (!error) setIds(data);
  };

  useEffect(() => {
    loadIds();
  }, []);

  const saveId = async () => {
    const { error } = await supabase.from("ids_colma").insert({
      codigo: generatedId,
      pais: paises.find(p => p.codigo === pais)?.nombre,
      actividad: actividades.find(a => a.codigo === actividad)?.nombre,
      perfil: perfiles.find(p => p.codigo === perfil)?.nombre,
      correlativo
    });
    if (!error) {
      const next = String(parseInt(correlativo) + 1).padStart(3, "0");
      setCorrelativo(next);
      loadIds();
    }
  };

  const deleteId = async (id) => {
    await supabase.from("ids_colma").delete().eq("id", id);
    loadIds();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Generador de IDs COLMA</h1>
      <p>ID generado: <strong>{generatedId}</strong></p>
      <select value={pais} onChange={e => setPais(e.target.value)}>{paises.map(p => <option key={p.codigo} value={p.codigo}>{p.nombre}</option>)}</select>
      <select value={actividad} onChange={e => setActividad(e.target.value)}>{actividades.map(a => <option key={a.codigo} value={a.codigo}>{a.nombre}</option>)}</select>
      <select value={perfil} onChange={e => setPerfil(e.target.value)}>{perfiles.map(p => <option key={p.codigo} value={p.codigo}>{p.nombre}</option>)}</select>
      <input type="text" value={correlativo} onChange={e => setCorrelativo(e.target.value.padStart(3, "0"))} />
      <button onClick={saveId}>Guardar</button>

      <h2>IDs guardados ({ids.length})</h2>
      <ul>
        {ids.map((item) => (
          <li key={item.id}>
            {item.codigo} – {item.pais}, {item.actividad}, {item.perfil}
            <button onClick={() => deleteId(item.id)} style={{ marginLeft: 10 }}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
