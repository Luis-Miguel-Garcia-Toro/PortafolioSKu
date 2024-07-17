import React, { useState, useEffect } from "react";
import {
  Select,
  Row,
  Col,
  Form,
  Card,
  Divider,
  Button,
  Collapse,
  Input,
  Pagination,
  DatePicker,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import UserServices from "../Services/Sevices"; // Ensure the path is correct
import "../../Styles/Skeleton.scss";

import PhotoCard from "./PhotoCard";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

const { Option } = Select;
const { Panel } = Collapse;
const dateFormat = "YYYY-MM-DD";
interface ClientData {
  clientId: string;
  region: string;
  regional: string;
  cediName: string;
  vendorCode: string;
}

interface PhotoData {
  url: string;
  clientData: ClientData;
}

const Filters: React.FC = () => {
  const [expandFilters, setExpandFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<any>([]);
  const [dataMisiones, setdataMisiones] = useState<any>([]);
  const [dataTipoMotor, setdataTipoMotor] = useState<any>([]);
  const [dataRegional, setdataRegional] = useState<any>([]);
  const [dataBodega, setdataBodega] = useState<any>([]);
  const [dataAgrupaMotor, setdataAgrupaMotor] = useState<any>([]);
  // const [dataFechaFin, setdataFechaFin] = useState<any>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [imgxPagina, setImgxPagina] = useState(0);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          misionesResponse,
          tipoMotorResponse,
          regionalResponse,
          bodegaResponse,
        ] = await Promise.all([
          UserServices.GetImgMisiones(),
          UserServices.GetTipoMotor(),
          UserServices.GetRegional(),
          UserServices.GetBodega(),
        ]);

        setdataMisiones(misionesResponse.data);
        setdataTipoMotor(tipoMotorResponse.data);
        setdataRegional(regionalResponse.data);
        setdataAgrupaMotor(dataAgrupaMotor.data);
        // console.log(dataAgrupaMotor, "agrupador]Motro");
        setdataBodega(bodegaResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      misionId: null,
      fechaInicio: null,
      fechaFin: null,
      motorId: null as number | null,
      agrupadorMotor: null as number | null,
      tipoMision: "",
      codigoRegional: "",
      bodega: "",
      nombreMision: "",
      nombreNegocio: "",
      codigoCliente: "",
      jdv: "",
      sdv: "",
      rdv: "",
      gdv: "",
      zonaRDV: "",
      veredict: "",
      page: paginaActual,
      pageSize: 100,
    },
  });

  const selectedMissionId = watch("nombreMision");
  const selectRegional = watch("codigoRegional");

  useEffect(() => {
    if (selectRegional && dataRegional.length > 0) {
      const selecteRegional = dataRegional.find(
        (regional: any) => regional.codigo == selectRegional
      );
      setValue("codigoRegional", selecteRegional.codigo);

      const selectedBodega = dataBodega.filter(
        (bodega: any) => bodega.codigoRegional == selectRegional
      );
      setdataBodega(selectedBodega);
      setValue("bodega", selectedBodega);

      console.log(selectedBodega, "bodega seleccionada");
    }
    if (selectedMissionId && dataMisiones.length > 0) {
      const selectedMission = dataMisiones.find(
        (mision: any) => mision.id === selectedMissionId
      );

      if (selectedMission) {
        const selectedMotor = dataTipoMotor.find(
          (motor: any) => motor.id == selectedMission.motorId
        );

        // console.log(selectedMission, "jujujuuju");

        setValue("motorId", selectedMotor ? selectedMotor.id : "");
        setValue(
          "agrupadorMotor",
          selectedMission.agrupadorMotor
            ? Number(selectedMission.agrupadorMotor)
            : null
        );
        setValue("fechaInicio", selectedMission.fechaInicio);
        setValue("fechaFin", selectedMission.fechaFin);
        setValue("misionId", selectedMission.id);
        setValue("nombreMision", selectedMission.nombreMision);
        setValue("nombreMision", selectedMission.nombreMision);
      }
    }
  }, [
    selectedMissionId,
    selectRegional,
    dataMisiones,
    dataTipoMotor,
    setValue,
  ]);
  const toggleFilters = () => {
    setExpandFilters(!expandFilters);
  };

  const handleInputChange = (fieldName: any, value: any) => {
    setValue(fieldName, value);
    // console.log(fieldName, value, "input" )
  };
  const addFilterPho = async (data: any) => {
    try {
      setLoading(true);
      const [RespuestaPho] = await Promise.all([
        UserServices.PostFiltros(data),
      ]);
      setPaginaActual(RespuestaPho.data.paginaActual);
      setImgxPagina(RespuestaPho.data.totalPaginas);
      setPhotos(RespuestaPho.data.imagenes);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleOnSubmit = async (data: any) => {
    setPaginaActual(1); // Reset page to 1 on new search
    setFormData(data);
    await addFilterPho({ ...data, page: 1 });
  };

  const changePaginator = async (page: number) => {
    setPaginaActual(page);
    const updatedFormData = { ...formData, page };
    setFormData(updatedFormData);
    await addFilterPho(updatedFormData);
  };

  return (
    <div style={{ padding: "30px" }}>
      <Form layout="vertical" onFinish={handleSubmit(handleOnSubmit)}>
        <Button
          type="primary"
          onClick={toggleFilters}
          style={{ marginBottom: "16px" }}
        >
          {expandFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
        </Button>
        <Collapse activeKey={expandFilters ? ["1"] : []}>
          <Panel header="Filtros" key="1">
            <Row gutter={[8, 24]}>
              <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="Nombre Misión">
                    <Controller
                      name="nombreMision"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          showSearch
                          optionFilterProp="label"
                          filterSort={(optionA, optionB) =>
                            (optionA?.label ?? "")
                              .toLowerCase()
                              .localeCompare(
                                (optionB?.label ?? "").toLowerCase()
                              )
                          }
                          placeholder="Seleccionar Misión"
                          style={{ width: "100%" }}
                          dropdownStyle={{ borderColor: "#1890ff" }}
                        >
                          <Option value="">Seleccionar</Option>

                          {dataMisiones.map((mision: any) => (
                            <Option
                              key={mision.id}
                              value={mision.id}
                              label={mision.nombreMision}
                            >
                              {mision.nombreMision}
                            </Option>
                          ))}
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="Fecha inicial">
                    <Controller
                      name="fechaInicio"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Fecha inicial"
                          style={{ width: "100%" }}
                          dropdownStyle={{ borderColor: "#1890ff" }}
                        ></Select>
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="Fecha Final">
                    <Controller
                      name="fechaFin"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Fecha Final"
                          style={{ width: "100%" }}
                          dropdownStyle={{ borderColor: "#1890ff" }}
                        >
                          {/* <Option value="mision1">Misión 1</Option> */}
                          {/* <Option value="mision2">Misión 2</Option> */}
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="Tipo Motor">
                    <Controller
                      name="motorId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Seleccionar Motor"
                          style={{ width: "100%" }}
                          dropdownStyle={{ borderColor: "#1890ff" }}
                        >
                          {dataTipoMotor.map((motor: any) => (
                            <Option key={motor.id} value={motor.id}>
                              {motor.nombre}
                            </Option>
                          ))}
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              {/* /////// pendiente  */}
              <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="Agrupador Motor">
                    <Controller
                      name="agrupadorMotor"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="agrupadorMotor"
                          style={{ width: "100%" }}
                          dropdownStyle={{ borderColor: "#1890ff" }}
                        >
                          {/* {dataAgrupaMotor.map((Amotor: any) => (
                            <Option
                              key={Amotor.codigo}
                              value={Amotor.codigo}
                            >
                              {Amotor.agrupadorMotor}
                            </Option>
                          ))} */}
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="Tipo Misión">
                    <Controller
                      name="tipoMision"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Seleccionar TipoMisión"
                          style={{ width: "100%" }}
                          dropdownStyle={{ borderColor: "#1890ff" }}
                        >
                          <Option value="">Seleccionar</Option>
                          <Option value="1">Captura Imagen</Option>
                          <Option value="2">Encuesta</Option>
                          <Option value="3">Portafolio</Option>
                          <Option value="4">Solicitudes</Option>
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              {/* <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="Estado">
                    <Controller
                      name="estado"              falta estadio
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Seleccionar Misión"
                          style={{ width: "100%" }}
                          dropdownStyle={{ borderColor: "#1890ff" }}
                        >
                          <Option value="mision1">Misión 1</Option>
                          <Option value="mision2">Misión 2</Option>
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col> */}
              <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="Veredicto">
                    <Controller
                      name="veredict"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Seleccionar Veredicto"
                          style={{ width: "100%" }}
                          dropdownStyle={{ borderColor: "#1890ff" }}
                        >
                          <Option value="">Seleccionar</Option>
                          <Option value="true">Aprobado</Option>
                          <Option value="false">No Aprobado</Option>
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="Nombre Regional">
                    <Controller
                      name="codigoRegional"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="regional"
                          style={{ width: "100%" }}
                          dropdownStyle={{ borderColor: "#1890ff" }}
                          defaultValue="" // Valor por defecto cuando no se ha seleccionado nada
                        >
                          {/* Opción vacía para mostrar el placeholder */}
                          <Option value="">Seleccionar</Option>

                          {/* Mapeo de las opciones */}
                          {dataRegional.map((regional: any) => (
                            <Option
                              key={regional.codigo}
                              value={regional.codigo}
                            >
                              {regional.nombreRegional}
                            </Option>
                          ))}
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="Nombre Cedi">
                    <Controller
                      name="bodega"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Seleccionar una Cedi"
                          style={{ width: "100%" }}
                          dropdownStyle={{ borderColor: "#1890ff" }}
                          defaultValue=""
                        >
                          <Option value="">Seleccionar</Option>
                          {dataBodega.map((cedi: any) => (
                            <Option key={cedi.codigo} value={cedi.codigo}>
                              {cedi.nombreBodega}
                            </Option>
                          ))}
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="gerente Venta">
                    <Controller
                      name="gdv"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Escribir gerente Venta"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            handleInputChange("gdv", e.target.value)
                          }
                        />
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="Jefe Ventas">
                    <Controller
                      name="jdv"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Escribir Jefe Ventas"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            handleInputChange("jdv", e.target.value)
                          }
                        />
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="Supervisor">
                    <Controller
                      name="sdv"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Escribir Supervisor"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            handleInputChange("sdv", e.target.value)
                          }
                        />
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="Zona Representantes">
                    <Controller
                      name="zonaRDV"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Escribir zonaRDV"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            handleInputChange("zonaRDV", e.target.value)
                          }
                        />
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="RDV">
                    <Controller
                      name="rdv"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Escribir rdv"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            handleInputChange("rdv", e.target.value)
                          }
                        />
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="Código Cliente">
                    <Controller
                      name="codigoCliente"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Escribir Código Cliente"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            handleInputChange("codigoCliente", e.target.value)
                          }
                        />
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="Nombre Negocio">
                    <Controller
                      name="nombreNegocio"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Escribir el nombre del negocio"
                          onChange={(e) =>
                            handleInputChange("nombreNegocio", e.target.value)
                          }
                        />
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={4}>
                <Card hoverable>
                  <Form.Item label="Imágenes por página">
                    <Controller
                      name="pageSize"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Total Imágenes"
                          style={{ width: "100%" }}
                          dropdownStyle={{ borderColor: "#1890ff" }}
                        >
                          <Option value={100}>100</Option>
                          <Option value={500}>500</Option>
                          {/* <Option value={1000}>1.000</Option>
                          <Option value={100000}>100.000</Option> */}
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
            </Row>
            <Divider />
            <div className="container-btn">
              <Button
                type="primary"
                htmlType="submit"
                className="Button"
                disabled={loading}
              >
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </Panel>
        </Collapse>
        <br />

        <div style={{ textAlign: "center" }}>
          {imgxPagina > 0 && (
            <Pagination
              onChange={(page) => {
                changePaginator(page);
              }}
              defaultCurrent={paginaActual}
              total={imgxPagina}
            ></Pagination>
          )}
        </div>
        <Divider />
        {loading ? (
          <div className="loading-container">
            <img
              src="/Postobon1.png"
              className="loading-logo blinking"
              alt="Loading logo"
            />
            <div className="loading-text">Cargando...</div>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {photos.map((photo: any, index: any) => (
              <PhotoCard key={index} photoUrl={photo.url} clientData={photo} />
            ))}
          </Row>
        )}
        <Divider />
        <div style={{ textAlign: "center" }}>
          {imgxPagina > 0 && (
            <Pagination
              onChange={(page) => {
                changePaginator(page);
              }}
              defaultCurrent={paginaActual}
              total={imgxPagina}
            ></Pagination>
          )}
        </div>
      </Form>
    </div>
  );
};

export default Filters;
