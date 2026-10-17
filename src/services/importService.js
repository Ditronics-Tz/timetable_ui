import api from "./api";

export const importService = {
  getTemplateUrl(entity) {
    return `/protected/import/${encodeURIComponent(entity)}/template`;
  },

  async downloadTemplate(entity) {
    const response = await api.get(this.getTemplateUrl(entity), {
      responseType: "text",
    });
    return response.data;
  },

  async validateCsv(entity, rows) {
    const payload = Array.isArray(rows)
      ? { rows: rows.map((r) => r.values || r) }
      : { csv: String(rows || "") };
    const response = await api.post(
      `/protected/import/${encodeURIComponent(entity)}/validate`,
      payload
    );
    return response.data;
  },

  async importCsv(entity, rows) {
    const payload = Array.isArray(rows)
      ? { rows: rows.map((r) => r.values || r) }
      : { csv: String(rows || "") };
    const response = await api.post(
      `/protected/import/${encodeURIComponent(entity)}`,
      payload
    );
    return response.data;
  },
};

export default importService;
