import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/api/trm", async (req, res) => {
  try {
    // API oficial del Banco de la República (Datos Abiertos Colombia)
    const url = "https://www.datos.gov.co/resource/32sa-8pi3.json?$order=vigenciahasta DESC&$limit=1";
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.length || !data[0].valor) {
      throw new Error("Respuesta inválida del servicio TRM");
    }

    const trmOficial = parseFloat(data[0].valor);
    const trmDescontada = trmOficial * 0.95; // resta el 5 %
    const fecha = data[0].vigenciahasta;

    res.json({ trm: trmDescontada, fecha });
  } catch (error) {
    console.error("Error obteniendo TRM:", error);
    res.status(500).json({ error: "No se pudo obtener la TRM" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor TRM activo en puerto ${PORT}`);
});

