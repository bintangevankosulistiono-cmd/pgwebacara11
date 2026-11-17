const map = L.map("map");

const desaLegend = document.getElementById("desa-legend");

fetch("data/batas-desa-legend.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Legenda desa gagal dimuat (${response.status}).`);
    }
    return response.json();
  })
  .then((entries) => {
    for (const entry of entries) {
      const row = document.createElement("div");
      row.className = "legend-item";

      const color = document.createElement("span");
      color.className = "legend-color";
      color.style.backgroundColor = entry.color;

      const name = document.createElement("span");
      name.className = "legend-name";
      name.textContent = entry.name;

      row.append(color, name);
      desaLegend.append(row);
    }
  })
  .catch((error) => {
    desaLegend.textContent = "Legenda gagal dimuat.";
    console.error(error);
  });

const openStreetMap = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "&copy; OpenStreetMap contributors",
  },
).addTo(map);

const batasDesa = L.tileLayer.wms(
  "http://localhost:8080/geoserver/pgweb/wms",
  {
    layers: "pgweb:batas_desa",
    format: "image/png",
    transparent: true,
    version: "1.1.0",
    crs: L.CRS.EPSG4326,
  },
).addTo(map);

const batasKecamatan = L.tileLayer.wms(
  "http://localhost:8080/geoserver/pgweb/wms",
  {
    layers: "pgweb:batas_kecamatan",
    format: "image/png",
    transparent: true,
    version: "1.1.0",
    crs: L.CRS.EPSG4326,
  },
).addTo(map);

L.control.layers(
  {
    OpenStreetMap: openStreetMap,
  },
  {
    "Batas Administrasi Desa": batasDesa,
    "Batas Kecamatan": batasKecamatan,
  },
  { collapsed: false },
).addTo(map);

L.control.scale({
  position: "bottomright",
  metric: true,
  imperial: false,
}).addTo(map);

map.fitBounds([
  [-8.647220457999936, 122.6477921720001],
  [-8.063357603999975, 123.33921143000009],
]);
