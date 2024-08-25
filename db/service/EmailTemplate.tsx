import * as React from "react";
import {
  Html,
  Button,
  Text,
  Container,
  Section,
  Row,
  Column,
} from "@react-email/components";

export function EmailTemplate(props: { connectionInfo: any[] }) {
  return (
    <Html lang="en">
      <Container style={containerStyle}>
        <Section style={sectionStyle}>
          <Text style={headerStyle}>IPTV Connection Information</Text>
          {props.connectionInfo.map((info, index) => (
            <Section key={index} style={connectionStyle}>
              <Text style={subHeaderStyle}>Connection {index + 1}</Text>
              <Row>
                <Column>
                  <Text style={labelStyle}>Playlist Name:</Text>
                  <Text style={labelStyle}>Username:</Text>
                  <Text style={labelStyle}>Password:</Text>
                  <Text style={labelStyle}>Host/API/URL:</Text>
                  <Text style={labelStyle}>M3U Link:</Text>
                  <Text style={labelStyle}>EPG Link:</Text>
                </Column>
                <Column>
                  <Text style={valueStyle}>{info.playlistName}</Text>
                  <Text style={valueStyle}>{info.username}</Text>
                  <Text style={valueStyle}>{info.password}</Text>
                  <Text style={valueStyle}>{info.host}</Text>
                  <Text style={valueStyle}>{info.m3uUrl}</Text>
                  <Text style={valueStyle}>{info.epgUrl}</Text>
                </Column>
              </Row>
            </Section>
          ))}
          <Button href="https://example.com" style={buttonStyle}>
            View Details
          </Button>
          <Button
            href={`https://wa.me/1234567890?text=Hello,%20I%20need%20help%20with%20my%20IPTV%20connection`}
            style={whatsappButtonStyle}
          >
            Contact Us on WhatsApp
          </Button>
        </Section>
      </Container>
    </Html>
  );
}

// Styles
const containerStyle = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "100%",
  maxWidth: "600px",
};

const sectionStyle = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  borderRadius: "5px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  padding: "20px",
};

const headerStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "20px 0",
};

const subHeaderStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  margin: "15px 0",
};

const connectionStyle = {
  borderBottom: "1px solid #e0e0e0",
  paddingBottom: "15px",
  marginBottom: "15px",
};

const labelStyle = {
  fontWeight: "bold",
  marginBottom: "5px",
};

const valueStyle = {
  marginBottom: "5px",
};

const buttonStyle = {
  backgroundColor: "#007bff",
  borderRadius: "5px",
  color: "#ffffff",
  fontWeight: "bold",
  padding: "12px 20px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  margin: "20px auto",
};

const whatsappButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#25D366",
};
