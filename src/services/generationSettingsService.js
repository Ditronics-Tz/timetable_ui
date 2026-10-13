import api from "./api";

const endpoint = "/protected/admin/generation-settings";

const generationSettingsService = {
  get() {
    return api.get(endpoint).then((response) => response.data);
  },
  update(settings) {
    return api.put(endpoint, settings).then((response) => response.data);
  },
};

export default generationSettingsService;
