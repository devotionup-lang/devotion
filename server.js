import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/api/trm", async (req, res) => {
  try {
    // Nueva API oficial del Banco de la República
    const url =
      "https://www.datos.gov.co/resource/mcec-87by.json?$order=vigenciadesde DESC&$limit=1";

    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.length) {
      throw new Error("No se recibieron datos de la TRM");
    }

    // Algunas veces el valor viene en 'valor' o en 'valor_trm'
    const valorStr = data[0].valor || data[0].valor_trm;

    if (!valorStr) {
      throw new Error("Campo 'valor' no encontrado en la respuesta");
    }

    const trmOficial = parseFloat(valorStr);
    const trmDescontada = trmOficial * 0.945; // aplica 5% de descuento
    const fecha =
      data[0].vigenciadesde || data[0].vigenciahasta || data[0].fecha;

    res.json({ trm: trmDescontada, fecha });
  } catch (error) {
    console.error("❌ Error obteniendo TRM:", error);
    res.status(500).json({ error: "No se pudo obtener la TRM" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor TRM activo en puerto ${PORT}`);
});
