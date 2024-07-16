import axios from "axios";

const baseUrl = {
  url: "https://postobon-supervisores-dev.sandboxcw.net/ImageMisiones/api",
}; //URL base
// const urlFiltros = { urlFiltros: "https://postobon-supervisores-dev.sandboxcw.net/ImageMisiones/api/ImageEverest/Misiones" };
const axiosInstance = axios.create({});

const UserServices = {
  PostFiltros: (data: any) => {
    return axiosInstance
      .post(`${baseUrl.url}/ImageEverest/Filtrar`, data)
      .then((res) => {
        return res.data;
        console.log(res.data);

      })
      .catch((e) => {
        console.error(e);
        throw e;
      });
  },
  GetImgMisiones: () => {
    return axiosInstance
      .get(`${baseUrl.url}/ImageEverest/Misiones` )
      .then((res) => {
        let r = res.data;
        return r;
      })

      .catch((e) => {
        console.error(e);
        throw e;
      });
  },
  GetTipoMotor: () => {
    return axiosInstance
      .get(`${baseUrl.url}/ImageEverest/TipoMotores`)
      .then((res) => {
        let r = res.data;
        return r;
      })

      .catch((e) => {
        console.error(e);
        throw e;
      });
  },
  GetRegional: () => {
    return axiosInstance
      .get(`${baseUrl.url}/ImageEverest/Regional`)
      .then((res) => {
        let r = res.data;
        return r;
      })

      .catch((e) => {
        console.error(e);
        throw e;
      });
  },
  GetBodega: () => {
    return axiosInstance
      .get(`${baseUrl.url}/ImageEverest/Bodega`)
      .then((res) => {
        let r = res.data;
        return r;
      })

      .catch((e) => {
        console.error(e);
        throw e;
      });
  },
  // PostSearchPho: (data:any) => {
  //   return axiosInstance
  //     .post(`${baseUrl.url}/ImageEverest/Filtrar`,data)
  //     .then((res) => {
  //       let r = res.data;
  //       console.log(r,"defefrfrfrffrfrf")
  //       return r;
  //     })

  //     .catch((e) => {
  //       console.error(e);
  //       throw e;
  //     });
  // },
};

export default UserServices;
