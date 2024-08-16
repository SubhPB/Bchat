/**
 * Byimaan
 */

import {
    Body,
    Container,
    Head,
    Html,
    Preview,
    Text,
  } from "@react-email/components";
  import * as  React from "react";

  interface EmailProps {
    name?: string;
    href: string;
    expiresInText ?: string,
    preview ?: string,
  };

  const main = {
    backgroundColor: "#eeeeee",
    padding: "10px 0",
  };
  
  const container = {
    backgroundColor: "#ffffff",
    border: "1px solid #f0f0f0",
    padding: "45px",
    borderRadius: "12px",
    
  };

  const section = {
    fontFamily:
      "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
    padding:"0 14px",
    marginBottom: "8px",
    fontSize: "14px"
  }
  
  export const ResetPasswordTemplate = ({name, href, expiresInText, preview="BChat reset your password"}: EmailProps) => {

    return (
      <Html>
        <Head />
        <Preview>{preview}</Preview>
        <Body style={main}>
          <Container style={container}>
            <section style={section}>
                <Text style={{color:"#909497", textAlign:"center", fontSize:"24px", fontWeight: "bold",}}> <span style={{color: "#424949"}}>B</span>Chat</Text>
                <Text style={{color:"#2c3338", textAlign:"center", fontWeight:"semibold", fontSize:"18px",}}>Reset your BChat password.</Text>

                <div style={{backgroundColor: "#f6f7f7", padding: ".6vmax", borderRadius:"6px",}}>
                    <Text style={{fontSize: "large", fontWeight: "semibold", textAlign: "center"}}>BChat password reset</Text>
                    {
                       name && <Text> Hi {name}</Text>
                    }
                    <Text> We heard that you lost your BChat password. <br /> But don't worry! You can click the following button to reset your password.</Text>
                    
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{padding: "8px 16px", borderRadius: "10px", color: "white", backgroundColor: "#008a20", fontWeight: "semibold", display:"inline", width:"fit-content", alignSelf:"center", textAlign: "center"}}>Reset your password</a>
                    {
                        expiresInText && (
                            <Text>If you don't use this link within {expiresInText}, it will expire.</Text>
                        )
                    }
                    <Text>Thanks. <br />BChat team</Text>
                </div>
                
                <div style={{opacity:".7"}}>
                    <Text>You're receving this email because a password reset was requested for your account.</Text>
                </div>
            </section>
            

          </Container>
        </Body>
      </Html>
    );
  };
  
  export default ResetPasswordTemplate;
  