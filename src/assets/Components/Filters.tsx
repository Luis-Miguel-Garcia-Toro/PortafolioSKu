/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Pagination,
  DatePicker,
  Input,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import UserServices from "../Services/Sevices"; // Ensure the path is correct
import "../../Styles/Skeleton.scss";

import PhotoCard from "./PhotoCard";
import moment from "moment";

const now = moment();
console.log(now.format("YYYY-MM-DD"));
const { Option } = Select;
const { Panel } = Collapse;
const dateFormat = "YYYY-MM-DD";

const Filters: React.FC = () => {
  const [expandFilters, setExpandFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<any>([]);
  const [dataMisiones, setdataMisiones] = useState<any>([]);
  const [dataTipoMotor, setdataTipoMotor] = useState<any>([]);
  const [dataRegional, setdataRegional] = useState<any>([]);
  const [dataBodega, setdataBodega] = useState<any>([]);
  const [bodega, setBodega] = useState<any>([]);
  const [dataAgrupaMotor, setdataAgrupaMotor] = useState<any>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [imgxPagina, setImgxPagina] = useState(0);
  const [formData, setFormData] = useState<any>(null);

  const [dataGDV, setdataGDV] = useState<any>([]);
  const [dataJDV, setdataJDV] = useState<any>([]);
  const [dataSDV, setdataSDV] = useState<any>([]);
  const [dataRDV, setdataRDV] = useState<any>([]);

  const [formPost, setFormPost] = useState<any>({
    regional: "",
    bodega: "",
    codigoGdv: "",
    codigoJdv: "",
    codigoSdv: "",
    codigoRdv: "",
    zonaRdv: "",
    companiaRdv: "",
  });

  const updateFieldPersonas = (fieldName, value) => {
    setFormPost(prevState => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          misionesResponse,
          tipoMotorResponse,
          regionalResponse,
          bodegaResponse, // Fetching bodega data here
          GDVresponse,
          JDVresponse,
          SDVresponse,
          RDVresponse,
        ] = await Promise.all([
          UserServices.GetImgMisiones(),
          UserServices.GetTipoMotor(),
          UserServices.GetRegional(),
          UserServices.GetBodega(),
          UserServices.PostGDV(formPost),
          UserServices.PostJDV(formPost),
          UserServices.PostSDV(formPost),
          UserServices.PostRDV(formPost),
        ]);

        setdataMisiones(misionesResponse.data);
        setdataTipoMotor(tipoMotorResponse.data);
        setdataRegional(regionalResponse.data);
        setdataBodega(bodegaResponse.data);
        setdataGDV(GDVresponse.data);
        setdataJDV(JDVresponse.data);
        setdataSDV(SDVresponse.data);
        setdataRDV(RDVresponse.data);
        // console.log(RDVresponse.data);

        // Ensure that bodega is set with the initial data
        setBodega(bodegaResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  interface FormValues {
    misionId: number | null;
    fechaInicio: Date | null;
    fechaFin: Date | null;
    motorId: number | null;
    agrupadorMotor: number | null;
    tipoMision: string;
    codigoRegional: string;
    bodega: string;
    nombreMision: string;
    nombreNegocio: string;
    codigoCliente: string;
    estado: number | null;
    jdv: string;
    sdv: string;
    rdv: string;
    gdv: string;
    zonaRDV: string;
    veredict: string;
    page: number;
    pageSize: number;
  }
  const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      misionId: null,
      fechaInicio: null, // Start as null, or new Date() for a default current date
      fechaFin: null, // Same as above
      motorId: null,
      agrupadorMotor: null,
      tipoMision: "",
      codigoRegional: "",
      bodega: "",
      nombreMision: "",
      nombreNegocio: "",
      codigoCliente: "",
      estado: null,
      jdv: "",
      sdv: "",
      rdv: "",
      gdv: "",
      zonaRDV: "",
      veredict: "",
      page: paginaActual, // Assuming paginaActual is a number and defined
      pageSize: 100,
    },
  });

  const selectedMissionId = watch("nombreMision");
  const selectRegional = watch("codigoRegional");
  const selectGDV = watch("gdv");
  const tipoMision = watch('motorId');

  // Llamar a obtenerAgrupadorMision cuando tipoMision cambie
  const setParametrosAgrupadorMotor = async(id : any) => {
    const bodegaResponse = await UserServices.GetTipoAgrupadorMotor(id);
    setdataAgrupaMotor(bodegaResponse.data);
    setValue("agrupadorMotor", null);
  }
  useEffect(() => {
    if (tipoMision) {
      try {
        setParametrosAgrupadorMotor(tipoMision)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }, [tipoMision]);

  useEffect(() => {
    if (selectRegional && dataRegional.length > 0) {
      const selecteRegional = dataRegional.find(
        (regional: any) => regional.codigo == selectRegional
      );
      setValue("codigoRegional", selecteRegional.codigo);

      const selectedBodega = bodega.filter(
        (bodega: any) => bodega.codigoRegional == selectRegional
      );
      setdataBodega(selectedBodega);
      setValue("bodega", selectedBodega);
    }
    ///
    if (selectGDV && selectGDV.length > 0) {
      const selectGDV = dataGDV.find(
        (codigoGdv: any) => codigoGdv.codigo == selectGDV
      );
      setValue("gdv", selectGDV.codigo);
      updateFieldPersonas("codigoGdv", selectGDV.codigo);

      const selectedjdv = dataGDV.filter(
        (GDV: any) => GDV.gdv == selectGDV
      );
      setdataJDV(selectedjdv);
      setValue("jdv", selectedjdv);
      updateFieldPersonas("codigoJDV", selectedjdv);
      //console.log(selectGDV,"ddddddd")
    }
    ///
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
        const startDate = new Date(selectedMission.fechaInicio);
        const endDate = new Date(selectedMission.fechaFin);

        setValue("fechaInicio", startDate);
        setValue("fechaFin", endDate);
        setValue("misionId", selectedMission.id);
        setValue("nombreMision", selectedMission.nombreMision);
        setValue("estado", Number(selectedMission.estado));
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

  const handleInputChange = (fieldName: any, date: moment.Moment | null) => {
    // Convertimos el objeto de moment a Date de JavaScript si no es null
    setValue(fieldName, date ? date.toDate() : null);
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

  const NombreNegocio = (fieldName: any, e: any | null) => {
    // Convertimos el objeto de moment a Date de JavaScript si no es null
    setValue(fieldName, e ? e : "");
  };
  const Observers = {
    gdv: watch("gdv"),
    jdv: watch("jdv"),
    supervisor: watch("sdv"),
    rdv: watch("rdv"),
  };
  

  useEffect(() => {
    const fetchData = async () => {
      let gdv = Observers.gdv;
      let jdv = Observers.jdv;
      let sdv = Observers.supervisor;
      let rdv = Observers.rdv;
      //gdv: watch("gdv"),
      //jdv: watch("jdv"),
      //supervisor: watch("sdv"),
      //rdv: watch("rdv"),
      //codigoGdv: "",
      //codigoJdv: "",
      //codigoSdv: "",
      //codigoRdv: "",
      let formDataTemp = {...formPost,
        codigoGdv: "",
        codigoJdv: "",
        codigoSdv: "",
        codigoRdv: "",
        companiaRdv: "",
      };
      
      try {
        // Primero llamar a la API GDV
        formDataTemp = {...formDataTemp, ["codigoGdv"]: gdv}
        if (gdv && gdv.trim() !== "" && gdv != formPost.codigoGdv) {
          updateFieldPersonas("codigoGdv", gdv);
          const dataApi = await UserServices.PostJDV(formDataTemp);
          setdataJDV(dataApi.data);
          //vaciar campos
          updateFieldPersonas("codigoJdv","");
          updateFieldPersonas("codigoSdv","");
          updateFieldPersonas("codigoRdv","");
          setValue("jdv","");
          setValue("sdv","");
          setValue("rdv","");
        }
        
        // Luego, si GDV fue llamado, llamar a JDV
        formDataTemp = {...formDataTemp, ["codigoJdv"]: jdv}
        if (formPost.codigoGdv && formPost.codigoGdv.trim() !== "") {
          if (jdv && jdv.trim() !== "" && jdv != formPost.codigoJdv) {
            updateFieldPersonas("codigoJdv", jdv);
            const dataApi = await UserServices.PostSDV(formDataTemp);
            setdataSDV(dataApi.data);
            updateFieldPersonas("codigoSdv","");
            updateFieldPersonas("codigoRdv","");
            setValue("sdv","");
            setValue("rdv","");
          }
        }
        
        // Luego, si JDV fue llamado, llamar a SDV
        formDataTemp = {...formDataTemp, ["codigoSdv"]: sdv}
        if (formPost.codigoJdv && formPost.codigoJdv.trim() !== "") {
          if (sdv && sdv.trim() !== "" && sdv != formPost.codigoSdv) {
            updateFieldPersonas("codigoSdv", sdv);
            const dataApi = await UserServices.PostRDV(formDataTemp);
            setdataRDV(dataApi.data);
            updateFieldPersonas("codigoRdv","");
            setValue("rdv","");
          }
        }

        // Finalmente, si SDV fue llamado, llamar a RDV
        if (formPost.codigoSdv && formPost.codigoSdv.trim() !== "") {
          if (rdv && rdv.trim() !== "" && rdv != formPost.codigoRdv) {
            updateFieldPersonas("codigoRdv", rdv);
          }
        }

      } catch (error) {
        //console.error("Error fetching data:", error);
      }
    };

    fetchData();

  }, [Observers]);

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
              <Col xs={24} sm={12} lg={6}>
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
              <Col xs={24} sm={12} lg={6}>
                <Card hoverable>
                  <Form.Item label="Fecha inicial">
                    <Controller
                      name="fechaInicio"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          format={dateFormat}
                          placeholder="Fecha Inicial"
                          style={{ width: "100%" }}
                          onChange={(date) =>
                            handleInputChange("fechaInicio", date)
                          }
                          value={field.value ? moment(field.value) : null}
                        />
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card hoverable>
                  <Form.Item label="Fecha Final">
                    <Controller
                      name="fechaFin"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          format={dateFormat}
                          placeholder="Fecha Final"
                          style={{ width: "100%" }}
                          onChange={(date) =>
                            handleInputChange("fechaFin", date)
                          }
                          value={field.value ? moment(field.value) : null}
                        />
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
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
                          <Option value={null}>Seleccionar</Option>
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
              <Col xs={24} sm={12} lg={6}>
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
                          <Option value={null}>Seleccionar</Option>
                          {dataAgrupaMotor.map((Amotor: any) => (
                            <Option
                              key={Amotor.id}
                              value={Amotor.id}
                            >
                              {Amotor.nombreAgrupador}
                            </Option>
                          ))}
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
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
              <Col xs={24} sm={12} lg={6}>
                <Card hoverable>
                  <Form.Item label="Estado">
                    <Controller
                      name="estado"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Seleccionar Misión"
                          style={{ width: "100%" }}
                          dropdownStyle={{ borderColor: "#1890ff" }}
                        >
                          <Option value={null}>Seleccionar</Option>
                          <Option value={Number(1)}>Activo</Option>
                          <Option value={Number(0)}>Inactivo</Option>
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
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
              <Col xs={24} sm={12} lg={6}>
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
              <Col xs={24} sm={12} lg={6}>
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
              <Col xs={24} sm={12} lg={6}>
                <Card hoverable>
                  <Form.Item label="Gerente Venta">
                    <Controller
                      name="gdv"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Seleccionar gerente de Ventas"
                          style={{ width: "100%" }}
                          dropdownStyle={{ borderColor: "#1890ff" }}
                        >
                          <Option value="">Seleccionar</Option>
                          {dataGDV.map((GDV: any) => (
                            <Option key={GDV.codigo} value={GDV.codigo}>
                              {GDV.nombre}
                            </Option>
                          ))}
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card hoverable>
                  <Form.Item label="Jefe Ventas">
                    <Controller
                      name="jdv"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Seleccionar Jefe Ventas"
                          style={{ width: "100%" }}
                          dropdownStyle={{ borderColor: "#1890ff" }}
                          disabled={
                            Observers.gdv === "" ||
                            Observers.gdv === null ||
                            Observers.gdv === undefined
                          }
                        >
                          <Option value="">Seleccionar</Option>
                          {dataJDV.map((JDV: any) => (
                            <Option key={JDV.codigo} value={JDV.codigo}>
                              ({JDV.codigo}) {JDV.nombre}
                            </Option>
                          ))}
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card hoverable>
                  <Form.Item label="Supervisor">
                    <Controller
                      name="sdv"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Seleccionar Supervisor"
                          style={{ width: "100%" }}
                          disabled={
                            Observers.jdv === "" || Observers.jdv === null
                          }
                          dropdownStyle={{ borderColor: "#1890ff" }}
                        >
                          <Option value="">Seleccionar</Option>
                          {dataSDV.map((SDV: any) => (
                            <Option key={SDV.codigo} value={SDV.codigo}>
                              ({SDV.codigo}) {SDV.nombre}
                            </Option>
                          ))}
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card hoverable>
                  <Form.Item label="RDV">
                    <Controller
                      name="rdv"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Seleccionar RDV"
                          style={{ width: "100%" }}
                          disabled={
                            Observers.supervisor === "" ||
                            Observers.supervisor === null
                          }
                          dropdownStyle={{ borderColor: "#1890ff" }}
                        >
                          <Option value="">Seleccionar</Option>
                          {dataRDV.map((rdv: any) => (
                            <Option key={rdv.id} value={rdv.codigo}>
                              ({rdv.codigo}) {rdv.nombre}
                            </Option>
                          ))}
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card hoverable>
                  <Form.Item label="Código Cliente">
                    <Controller
                      name="codigoCliente"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          placeholder="Ingrese Código Cliente"
                          style={{ width: "100%" }}
                          onChange={(e) =>
                            NombreNegocio("codigoCliente", e.target.value)
                          }
                        />
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card hoverable>
                  <Form.Item label="Nombre Negocio">
                    <Controller
                      name="nombreNegocio"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Ingrese Nombre Negocio"
                          onChange={(e) =>
                            NombreNegocio("nombreNegocio", e.target.value)
                          }
                        />
                      )}
                    />
                  </Form.Item>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
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
