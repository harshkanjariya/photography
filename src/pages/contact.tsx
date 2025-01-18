import '../assets/css/contact.css';
import Header from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";
import { CloseOutlined } from "@mui/icons-material";
import { Row, Col } from "antd";

const Contact = () => {
  return (
    <div style={{ backgroundColor: '#151515', color: '#fff' }}>
      <Header />
      <section id="page1" style={{ height: "100vh" }}>
        <div style={{ height: '60px' }}></div>
        <iframe
          style={{ height: '100%' }}
          width="100%"
          src="https://maps.google.com/maps?q=22.999694%2C%2072.635222&t=&z=13&ie=UTF8&iwloc=&output=embed"
          frameBorder="0"
          scrolling="no"
          title="Google Maps"
        ></iframe>
        <div className="contactDiv">
          <div id="closebtncn"><CloseOutlined /></div>
          <h5 className="contact-title">GET IN TOUCH</h5>
          <p className="contact-text">
            Please fill out the quick form and we will be in touch with lightning speed.
          </p>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <p className="desc">Phone</p>
              <p className="info">+91 780 200 4735</p>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <p className="desc">Phone</p>
              <p className="info">+91 780 200 4735</p>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <p className="desc">Phone</p>
              <p className="info">+91 780 200 4735</p>
            </Col>
          </Row>
          <br/>
          <br/>
          <form className="row" onSubmit={(e) => e.preventDefault()}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <div className="formgrp">
                  <input
                    type="text"
                    className="form-netweb"
                    name="name"
                    placeholder="NAME"
                  />
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="formgrp">
                  <input
                    type="email"
                    className="form-netweb"
                    name="email"
                    placeholder="EMAIL"
                  />
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className="formgrp">
                  <input
                    type="text"
                    className="form-netweb"
                    name="subject"
                    placeholder="SUBJECT"
                  />
                </div>
              </Col>
              <Col xs={24}>
                <div className="formgrp">
                  <textarea
                    className="form-netweb"
                    rows={6}
                    name="msg"
                    placeholder="MESSAGE"
                  ></textarea>
                </div>
              </Col>
              <Col xs={24}>
                <button className="btnSubmit" type="submit">
                  submit
                </button>
              </Col>
            </Row>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
