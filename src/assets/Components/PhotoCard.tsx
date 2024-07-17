import React from "react";
import { Card, Col } from "antd";

interface ClientData {
  clientId: string;
  region: string;
  razonSocial: string;
  nombreBodega: string;
  nombreMision: string;
  vendorCode: string;
  verdict?: string | null;
  zonaRDV?: string | null;
}

interface PhotoCardProps {
  photoUrl: string;
  clientData: ClientData;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photoUrl, clientData }) => {
  return (
    <Col xs={24} sm={12} lg={8}>
      <Card
        hoverable
        cover={<img alt="Foto" src={photoUrl} style={{ height: 300 }} />}
        
      >
        <Card.Meta
          //title={`Cliente: ${clientData.clientId}`}
          description={
            <div>
              <p style={{ margin: 0 }}>
                <strong>Cod Cliente:</strong> {clientData.clientId}
              </p>

              <p style={{ margin: 0 }}>
                <strong>Zona:</strong> {clientData.zonaRDV}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Nombre Cedi:</strong> {clientData.nombreBodega}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Nombre Misión:</strong> {clientData.nombreMision}
              </p>
              {clientData.verdict && (
                <p style={{ margin: 0 }}>
                  <strong>Veredicto:</strong> {clientData.verdict}
                  console.log(clientData.verdict)
                </p>
                
              )}
              
            </div>
          }
        />
      </Card>
    </Col>
  );
};

export default PhotoCard;
