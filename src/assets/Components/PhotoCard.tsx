import React from "react";
import { Card, Col } from "antd";

interface ClientData {
  clientId: string;
  region: string;
  cediName: string;
  vendorCode: string;
  verdict?: string | null; 
  zonaRDV ?: string | null; 
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
          title={`Cliente: ${clientData.clientId}`}
          description={
            <div>
              <p><strong>Zona:</strong> {clientData.zonaRDV}</p>
              <p><strong>Nombre Cedi:</strong> {clientData.cediName}</p>
              <p><strong>Codigo Vendedor:</strong> {clientData.vendorCode}</p>
              {clientData.verdict && (
                <p><strong>Veredicto:</strong> {clientData.verdict}</p>
              )}
            </div>
          }
        />
      </Card>
    </Col>
  );
};

export default PhotoCard;
