import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/api/trm", async (req, res) => {
  try {
    const resp = await fetch("https://www.datos.gov.co/resource/32sa-8pi3.json?$order=fecha DESC&$limit=1");
    const data = await resp.json();

    let valor = data[0].valor || data[0].VALOR;
    valor = parseFloat(valor.replace(/[, ]+/g, ""));
    const trm = valor * 0.95; // 🔽 Aplica descuento del 5%

    res.json({
      trm,
      fecha: data[0].fecha || data[0].FECHA,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener TRM" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor TRM Proxy en puerto ${PORT}`));
