import React from "react";
import { Layout } from "antd";
import "./App.css"; // Ajusta los estilos según sea necesario
import Filters from "./assets/Components/Filters";
// import { Divider } from "antd";

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout className="layout">
      <div className="logo-img">
        <img src="../public/Postobon1.png"></img>
      </div>
      {/* <Divider /> */}
      <Content className="content">
        <Filters />
      </Content>
    </Layout>
  );
};

export default App;
